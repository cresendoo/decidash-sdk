import { postFeePayer } from "@/api/feepayer";
import type { DeciDashConfig } from "@/config";
import {
  type Account,
  Aptos,
  AptosConfig,
  type CommittedTransactionResponse,
  type InputGenerateTransactionPayloadData,
  Network,
} from "@aptos-labs/ts-sdk";

export class ContractWrapper {
  readonly aptos: Aptos;
  readonly config: DeciDashConfig;
  readonly signerAccount: Account;

  constructor(config: DeciDashConfig, signerAccount: Account, aptos?: Aptos) {
    const aptosConfig = new AptosConfig({
      network: Network.DEVNET,
      fullnode: config.node.HTTPURL,
    });
    this.aptos = aptos ?? new Aptos(aptosConfig);
    this.signerAccount = signerAccount;
    this.config = config;
  }

  public async submitFeepayerTx(
    payload: InputGenerateTransactionPayloadData,
    signerAccount?: Account,
  ): Promise<CommittedTransactionResponse> {
    const signer = signerAccount ?? this.signerAccount;
    const sender = signer.accountAddress;
    const transaction = await this.aptos.transaction.build.simple({
      sender: sender,
      data: payload,
      withFeePayer: true,
      options: { expireTimestamp: Date.now() + 60_000 },
    });
    const senderAuthenticator = this.aptos.transaction.sign({
      signer,
      transaction,
    });
    const response = await postFeePayer({
      decidashConfig: this.config,
      aptos: this.aptos,
      signature: Array.from(senderAuthenticator.bcsToBytes()),
      transaction: Array.from(transaction.rawTransaction.bcsToBytes()),
    });
    return response;
  }
}
