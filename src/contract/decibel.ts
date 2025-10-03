import type { Market } from "@/api";
import { postFeePayer } from "@/api/feepayer";
import type { DeciDashConfig } from "@/config";
import type {
  Account,
  AccountAuthenticator,
  Aptos,
  CommittedTransactionResponse,
  SimpleTransaction,
} from "@aptos-labs/ts-sdk";
import { ContractWrapper } from "./contract";
import {
  cancelClientOrderToSubaccountPayload,
  cancelOrderToSubaccountPayload,
  configureUserSettingsForMarketPayload,
  placeOrderToSubaccountPayload,
  placeTwapOrderToSubaccountPayload,
} from "./payload";
import type { OrderEvent, TimeInForce } from "./types";

export class DecibelAccount extends ContractWrapper {
  public async submitFeepayerTxRaw(
    simpleTransaction: SimpleTransaction,
    senderAuthenticator: AccountAuthenticator,
  ): Promise<CommittedTransactionResponse> {
    const response = await postFeePayer({
      decidashConfig: this.config,
      aptos: this.aptos,
      signature: Array.from(senderAuthenticator.bcsToBytes()),
      transaction: Array.from(simpleTransaction.rawTransaction.bcsToBytes()),
    });
    return response;
  }

  public async configureUserSettingsForMarket(args: {
    subAccountAddress: string;
    marketAddress: string;
    isCross: boolean;
    userLeverage: number;
  }): Promise<{ txhash: string }> {
    const payload = configureUserSettingsForMarketPayload(args);
    const tx = await this.submitFeepayerTx(payload);
    return { txhash: tx.hash };
  }

  public async placeOrder(args: {
    accountAddress: string;
    market: Market;
    price: number; // 4.5$ => 4.5
    size: number; // 10 APT => 10
    isLong: boolean;
    timeInForce: TimeInForce;
    isReduceOnly: boolean;
    clientOrderId?: number;
    stopPrice?: number;
    tpTriggerPrice?: number;
    tpLimitPrice?: number;
    slTriggerPrice?: number;
    slLimitPrice?: number;
    builderAddress?: string;
    builderFee?: number;
  }): Promise<{ orderId: string | null; txhash: string }> {
    args.price = args.price * 10 ** args.market.px_decimals;
    args.size = args.size * 10 ** args.market.sz_decimals;

    args.stopPrice = args.stopPrice
      ? args.stopPrice * 10 ** args.market.px_decimals
      : undefined;
    args.tpTriggerPrice = args.tpTriggerPrice
      ? args.tpTriggerPrice * 10 ** args.market.px_decimals
      : undefined;
    args.tpLimitPrice = args.tpLimitPrice
      ? args.tpLimitPrice * 10 ** args.market.px_decimals
      : undefined;
    args.slTriggerPrice = args.slTriggerPrice
      ? args.slTriggerPrice * 10 ** args.market.px_decimals
      : undefined;
    args.slLimitPrice = args.slLimitPrice
      ? args.slLimitPrice * 10 ** args.market.px_decimals
      : undefined;

    const payload = placeOrderToSubaccountPayload({
      ...args,
      marketAddress: args.market.market_addr,
    });
    const tx = await this.submitFeepayerTx(payload);

    return {
      orderId: this.extractOrderIdFromTransaction(tx, args.accountAddress),
      txhash: tx.hash,
    };
  }

  public async placeTwapOrder(args: {
    accountAddress: string;
    market: Market;
    size: number;
    isLong: boolean;
    isReduceOnly: boolean;
    twapFrequencySeconds: number;
    twapDurationSeconds: number;
  }): Promise<{ orderId: string | null; txhash: string }> {
    args.size = args.size * 10 ** args.market.sz_decimals;
    const payload = placeTwapOrderToSubaccountPayload({
      ...args,
      marketAddress: args.market.market_addr,
      subAccountAddress: args.accountAddress,
    });
    const tx = await this.submitFeepayerTx(payload);
    return {
      orderId: this.extractOrderIdFromTransaction(tx, args.accountAddress),
      txhash: tx.hash,
    };
  }

  public async cancelOrder(args: {
    accountAddress: string;
    orderId: string;
    marketAddress: string;
  }): Promise<{ txhash: string }> {
    const payload = cancelOrderToSubaccountPayload({
      ...args,
      subAccountAddress: args.accountAddress,
    });
    const tx = await this.submitFeepayerTx(payload);
    return { txhash: tx.hash };
  }

  public async cancelClientOrder(args: {
    accountAddress: string;
    clientOrderId: string;
    marketAddress: string;
  }): Promise<{ txhash: string }> {
    const payload = cancelClientOrderToSubaccountPayload(args);
    const tx = await this.submitFeepayerTx(payload);
    return { txhash: tx.hash };
  }

  private extractOrderIdFromTransaction = (
    txResponse: CommittedTransactionResponse,
    subaccountAddr: string,
  ): string | null => {
    try {
      if ("events" in txResponse && Array.isArray(txResponse.events)) {
        for (const event of txResponse.events) {
          if (event.type.includes("::market_types::OrderEvent")) {
            const orderEvent = event.data as OrderEvent;
            if (orderEvent.user === subaccountAddr) {
              return orderEvent.order_id;
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error extracting order_id from transaction:", error);
      return null;
    }
  };
}
