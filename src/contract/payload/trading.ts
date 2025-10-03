import { DECIBEL_CONTRACT_ADDRESS } from "../const";
import type { TimeInForce } from "../types";

export const placeOrderToSubaccountPayload = (args: {
  accountAddress: string;
  marketAddress: string;
  price: number;
  size: number;
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
}) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::place_order_to_subaccount`,
  functionArguments: [
    args.accountAddress,
    args.marketAddress,
    args.price,
    args.size,
    args.isLong,
    args.timeInForce,
    args.isReduceOnly,
    args.clientOrderId,
    args.stopPrice,
    args.tpTriggerPrice,
    args.tpLimitPrice,
    args.slTriggerPrice,
    args.slLimitPrice,
    args.builderAddress,
    args.builderFee,
  ],
});
