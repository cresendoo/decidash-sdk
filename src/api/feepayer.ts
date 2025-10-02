import type { DeciDashConfig } from "@/config";
import type { PostFeePayerResponse } from "./types";
import { post } from "./utils";

export const postFeePayer = async (args: {
  decidashConfig: DeciDashConfig;
  signature: number[];
  transaction: number[];
}) => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const response = await post<PostFeePayerResponse>(
    `${tradingVM.FeePayerURL}/transactions`,
    {
      signature: args.signature,
      transaction: args.transaction,
    },
    fetchFn,
  );
  return response;
};
