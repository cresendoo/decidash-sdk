import { DECIBEL_CONTRACT_ADDRESS, USDC_METADATA_ADDRESS } from "../const";

export const delegateTradingToSubaccountPayload = (
  delegateAccountAddress: string,
) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::delegate_trading_to`,
  functionArguments: [delegateAccountAddress],
});

export const primarySubAccountPayload = (primaryAddress: string) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::primary_subaccount`,
  functionArguments: [primaryAddress],
});

export const createSubAccountPayload = () => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::create_new_subaccount`,
  functionArguments: [],
});

export const getAccountBalancePayload = (accountAddress: string) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::perp_engine::get_account_balance_fungible`,
  functionArguments: [accountAddress],
});

export const depositToSubAccountPayload = (amount: number) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::deposit_to_subaccount`,
  functionArguments: [USDC_METADATA_ADDRESS, amount],
});

export const depositToSubAccountAtPayload = (
  subAccountAddress: string,
  amount: number,
) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::deposit_to_subaccount_at`,
  functionArguments: [subAccountAddress, USDC_METADATA_ADDRESS, amount],
});

export const withdrawFromSubAccountPayload = (
  subAccountAddress: string,
  amount: number,
) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::withdraw_from_subaccount`,
  functionArguments: [subAccountAddress, USDC_METADATA_ADDRESS, amount],
});

export const mintUSDCPayload = (accountAddress: string, amount: number) => ({
  function: `${DECIBEL_CONTRACT_ADDRESS}::usdc::mint`,
  functionArguments: [accountAddress, amount],
});
