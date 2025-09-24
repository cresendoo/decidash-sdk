import { postFeePayer } from "@/api/feepayer";
import type { DeciDashConfig } from "@/config";
import type {
  Account,
  AccountAddressInput,
  AnyNumber,
  Aptos,
} from "@aptos-labs/ts-sdk";
import { buildFeepayerTxRequest } from "./aptos";
import {
  COLLECTAL_DECIMALS,
  DECIBEL_CONTRACT_ADDRESS,
  USDC_METADATA_ADDRESS,
} from "./const";

export const getPrimarySubAccount = async (args: {
  aptos: Aptos;
  accountAddress: AccountAddressInput;
  minLedgerVersion?: AnyNumber;
}) => {
  const { aptos, accountAddress, minLedgerVersion } = args;
  const resp = await aptos.view<[string]>({
    payload: {
      function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::primary_subaccount`,
      functionArguments: [accountAddress],
    },
    options: {
      ledgerVersion: minLedgerVersion,
    },
  });
  return resp[0];
};

export const getAccountBalance = async (args: {
  aptos: Aptos;
  accountAddress: AccountAddressInput;
  minLedgerVersion?: AnyNumber;
}) => {
  const { aptos, accountAddress, minLedgerVersion } = args;
  const resp = await aptos.view<[number]>({
    payload: {
      function: `${DECIBEL_CONTRACT_ADDRESS}::perp_engine::get_account_balance_fungible`,
      functionArguments: [accountAddress],
    },
    options: {
      ledgerVersion: minLedgerVersion,
    },
  });
  return +resp[0] / COLLECTAL_DECIMALS;
};

export const createNewSubAccount = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  account: Account;
}) => {
  const { decidashConfig, aptos, account } = args;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::create_new_subaccount`,
    functionArguments: [],
  });

  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};

export const depositToSubAccount = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  account: Account;
  amount: number;
}) => {
  const { decidashConfig, aptos, account, amount } = args;
  const _amount = amount * COLLECTAL_DECIMALS;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::deposit_to_subaccount`,
    functionArguments: [USDC_METADATA_ADDRESS, amount],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};

export const withdrawFromSubAccount = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  account: Account;
  subAccountAddress: AccountAddressInput | string;
  amount: number;
}) => {
  const { decidashConfig, aptos, account, subAccountAddress, amount } = args;
  const _amount = amount * COLLECTAL_DECIMALS;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::withdraw_from_subaccount`,
    functionArguments: [subAccountAddress, USDC_METADATA_ADDRESS, _amount],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};

export const testUSDCMint = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  account: Account;
  amount: number;
}) => {
  const { decidashConfig, aptos, account, amount } = args;
  const _amount = amount * COLLECTAL_DECIMALS;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::usdc::mint`,
    functionArguments: [account.accountAddress, _amount],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};
