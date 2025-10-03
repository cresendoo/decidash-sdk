import type {
  InputEntryFunctionData,
  InputMultiSigData,
} from "@aptos-labs/ts-sdk";
import { DECIBEL_CONTRACT_ADDRESS } from "../const";
import type { TimeInForce } from "../types";

export const configureUserSettingsForMarketPayload = (args: {
  subAccountAddress: string;
  marketAddress: string;
  isCross: boolean;
  userLeverage: number;
}): InputEntryFunctionData | InputMultiSigData => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::configure_user_settings_for_market`,
  functionArguments: [
    args.subAccountAddress,
    args.marketAddress,
    args.isCross,
    args.userLeverage,
  ],
});

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
}): InputEntryFunctionData | InputMultiSigData => ({
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

export const placeTwapOrderToSubaccountPayload = (args: {
  subAccountAddress: string;
  marketAddress: string;
  size: number;
  isLong: boolean;
  isReduceOnly: boolean;
  twapFrequencySeconds: number;
  twapDurationSeconds: number;
}): InputEntryFunctionData | InputMultiSigData => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::place_twap_order_to_subaccount`,
  functionArguments: [
    args.subAccountAddress,
    args.marketAddress,
    args.size,
    args.isLong,
    args.isReduceOnly,
    args.twapFrequencySeconds,
    args.twapDurationSeconds,
  ],
});

export const cancelOrderToSubaccountPayload = (args: {
  subAccountAddress: string;
  orderId: string;
  marketAddress: string;
}): InputEntryFunctionData | InputMultiSigData => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::cancel_order_to_subaccount`,
  functionArguments: [args.subAccountAddress, args.orderId, args.marketAddress],
});

export const cancelClientOrderToSubaccountPayload = (args: {
  subAccountAddress: string;
  clientOrderId: string;
  marketAddress: string;
}): InputEntryFunctionData | InputMultiSigData => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::cancel_client_order_to_subaccount`,
  functionArguments: [
    args.subAccountAddress,
    args.clientOrderId,
    args.marketAddress,
  ],
});
