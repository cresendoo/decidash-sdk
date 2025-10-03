import type { Market } from "@/api";
import type { DeciDashConfig } from "@/config";
import type { Account, AccountAuthenticator, Aptos, CommittedTransactionResponse, SimpleTransaction } from "@aptos-labs/ts-sdk";
import { ContractWrapper } from "./contract";
import { postFeePayer } from "@/api/feepayer";

export type Cache = {
  markets: Market[];

  lastupdated: Date;
};

export class DecibelAccount extends ContractWrapper {
  private cache: Cache;

  constructor(config: DeciDashConfig, delegateAccount: Account, aptos?: Aptos) {
    super(config, delegateAccount, aptos);
    this.cache = {
      markets: [],
      lastupdated: new Date(),
    };
  }

  public async submitFeepayerTxRaw(
    simpleTransaction: SimpleTransaction,
    senderAuthenticator: AccountAuthenticator
  ): Promise<CommittedTransactionResponse> {
    const response = await postFeePayer({
      decidashConfig: this.config,
      aptos: this.aptos,
      signature: Array.from(senderAuthenticator.bcsToBytes()),
      transaction: Array.from(simpleTransaction.rawTransaction.bcsToBytes()),
    });
    return response;
  }
}
