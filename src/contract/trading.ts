import type { Market } from "@/api";
import { postFeePayer } from "@/api/feepayer";
import type { DeciDashConfig } from "@/config";
import type {
  Account,
  Aptos,
  CommittedTransactionResponse,
} from "@aptos-labs/ts-sdk";
import { DECIBEL_CONTRACT_ADDRESS } from "./const";
import { buildFeepayerTxRequest } from "./transaction";
import type { OrderEvent, TimeInForce } from "./types";

export const placeOrderToSubaccount = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  signer: Account;
  subAccountAddress: string;
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
}) => {
  const {
    decidashConfig,
    aptos,
    signer,
    subAccountAddress,
    market,
    isLong,
    timeInForce,
    isReduceOnly,
    clientOrderId,
    stopPrice,
    tpTriggerPrice,
    tpLimitPrice,
    slTriggerPrice,
    slLimitPrice,
    builderAddress,
    builderFee,
  } = args;
  const { px_decimals, sz_decimals } = market;
  const _price = args.price * 10 ** px_decimals;
  const _size = args.size * 10 ** sz_decimals;

  const _stopPrice = stopPrice ? stopPrice * 10 ** px_decimals : undefined;
  const _tpTriggerPrice = tpTriggerPrice
    ? tpTriggerPrice * 10 ** px_decimals
    : undefined;
  const _tpLimitPrice = tpLimitPrice
    ? tpLimitPrice * 10 ** px_decimals
    : undefined;
  const _slTriggerPrice = slTriggerPrice
    ? slTriggerPrice * 10 ** px_decimals
    : undefined;
  const _slLimitPrice = slLimitPrice
    ? slLimitPrice * 10 ** px_decimals
    : undefined;

  const request = await buildFeepayerTxRequest(aptos, signer, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::place_order_to_subaccount`,
    functionArguments: [
      subAccountAddress,
      market.market_addr,
      _price,
      _size,
      isLong,
      timeInForce,
      isReduceOnly,
      clientOrderId,
      _stopPrice,
      _tpTriggerPrice,
      _tpLimitPrice,
      _slTriggerPrice,
      _slLimitPrice,
      builderAddress,
      builderFee,
    ],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    aptos: aptos,
    signature: request.signature,
    transaction: request.transaction,
  });
  return {
    orderId: extractOrderIdFromTransaction(response, subAccountAddress),
    txhash: response.hash,
  };
};

const extractOrderIdFromTransaction = (
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
