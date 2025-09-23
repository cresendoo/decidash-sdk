import type { DeciDashConfig } from "@/config";
import { post } from "./utils";

export const postFeePayer = async (args: {
  decidashConfig: DeciDashConfig;
  signature: number[];
  transaction: number[];
}) => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const response = await post(
    `${tradingVM.FeePayerURL}/transactions`,
    {
      signature: args.signature,
      transaction: args.transaction,
    },
    fetchFn,
  );
  return response;
};
