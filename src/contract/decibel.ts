import type { Market } from "@/api";
import type { DeciDashConfig } from "@/config";
import type { Account, Aptos } from "@aptos-labs/ts-sdk";
import { ContractWrapper } from "./contract";

export type Cache = {
  markets: Market[];

  lastupdated: Date;
};

export class DecibelAccount extends ContractWrapper {
  private cache: Cache;

  constructor(config: DeciDashConfig, signerAccount: Account, aptos?: Aptos) {
    super(config, signerAccount, aptos);
    this.cache = {
      markets: [],
      lastupdated: new Date(),
    };
  }
}
