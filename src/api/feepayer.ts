import type { DeciDashConfig } from "@/config";
import type { Aptos, CommittedTransactionResponse } from "@aptos-labs/ts-sdk";
import type { PostFeePayerResponse } from "./types";
import { post } from "./utils";

export const postFeePayer = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  signature: number[];
  transaction: number[];
}): Promise<CommittedTransactionResponse> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const response = await post<PostFeePayerResponse>(
    `${tradingVM.FeePayerURL}/transactions`,
    {
      signature: args.signature,
      transaction: args.transaction,
    },
    fetchFn,
  );
  return await args.aptos.waitForTransaction({
    transactionHash: response.hash,
  });
};
