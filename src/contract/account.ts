import type { PostFeePayerResponse } from "@/api";
import { postFeePayer } from "@/api/feepayer";
import type { DeciDashConfig } from "@/config";
import type {
  Account,
  AccountAddressInput,
  AnyNumber,
  Aptos,
  CommittedTransactionResponse,
} from "@aptos-labs/ts-sdk";
import {
  COLLECTAL_DECIMALS,
  DECIBEL_CONTRACT_ADDRESS,
  USDC_METADATA_ADDRESS,
} from "./const";
import { buildFeepayerTxRequest } from "./transaction";

export const getPrimarySubAccount = async (args: {
  aptos: Aptos;
  primaryAddress: AccountAddressInput;
  minLedgerVersion?: AnyNumber;
}) => {
  const { aptos, primaryAddress: accountAddress, minLedgerVersion } = args;
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

export const getSubAccountBalance = async (args: {
  aptos: Aptos;
  subAccountAddress: AccountAddressInput;
  minLedgerVersion?: AnyNumber;
}) => {
  const { aptos, subAccountAddress: accountAddress, minLedgerVersion } = args;
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
  primaryAccount: Account;
}): Promise<CommittedTransactionResponse> => {
  const { decidashConfig, aptos, primaryAccount: account } = args;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::create_new_subaccount`,
    functionArguments: [],
  });

  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    aptos: aptos,
    signature: request.signature,
    transaction: request.transaction,
  });

  return response;
};

export const deposit = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  signer: Account;
  amount: number;
  subAccountAddress?: AccountAddressInput;
}): Promise<CommittedTransactionResponse> => {
  if (args.subAccountAddress) {
    return depositToSubAccountAt({
      decidashConfig: args.decidashConfig,
      aptos: args.aptos,
      primaryAccount: args.signer,
      subAccountAddress: args.subAccountAddress,
      amount: args.amount,
    });
  }
  return depositToSubAccount({
    decidashConfig: args.decidashConfig,
    aptos: args.aptos,
    signer: args.signer,
    amount: args.amount,
  });
};

const depositToSubAccount = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  signer: Account;
  amount: number;
}): Promise<CommittedTransactionResponse> => {
  const { decidashConfig, aptos, signer: account, amount } = args;
  const _amount = amount * COLLECTAL_DECIMALS;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::deposit_to_subaccount`,
    functionArguments: [USDC_METADATA_ADDRESS, _amount],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    aptos: aptos,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};

const depositToSubAccountAt = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  primaryAccount: Account;
  subAccountAddress: AccountAddressInput;
  amount: number;
}): Promise<CommittedTransactionResponse> => {
  const {
    decidashConfig,
    aptos,
    primaryAccount: account,
    subAccountAddress,
    amount,
  } = args;
  const _amount = amount * COLLECTAL_DECIMALS;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::deposit_to_subaccount_at`,
    functionArguments: [subAccountAddress, USDC_METADATA_ADDRESS, _amount],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    aptos: aptos,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};

export const withdraw = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  signer: Account;
  subAccountAddress: AccountAddressInput | string;
  amount: number;
}): Promise<CommittedTransactionResponse> => {
  const {
    decidashConfig,
    aptos,
    signer: account,
    subAccountAddress,
    amount,
  } = args;
  const _amount = amount * COLLECTAL_DECIMALS;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::withdraw_from_subaccount`,
    functionArguments: [subAccountAddress, USDC_METADATA_ADDRESS, _amount],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    aptos: aptos,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};

export const testUSDCMint = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  primaryAccount: Account;
  amount: number;
}): Promise<CommittedTransactionResponse> => {
  const { decidashConfig, aptos, primaryAccount: account, amount } = args;
  const _amount = amount * COLLECTAL_DECIMALS;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::usdc::mint`,
    functionArguments: [account.accountAddress, _amount],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    aptos: aptos,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};
