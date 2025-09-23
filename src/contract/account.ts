import { postFeePayer } from "@/api/feepayer";
import type { DeciDashConfig } from "@/config";
import type {
  Account,
  AccountAddressInput,
  AnyNumber,
  Aptos,
} from "@aptos-labs/ts-sdk";
import { buildFeepayerTxRequest } from "./aptos";
import { DECIBEL_CONTRACT_ADDRESS } from "./const";

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

export const createNewSubAccount = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  account: Account;
  minLedgerVersion?: AnyNumber;
}) => {
  const { decidashConfig, aptos, account, minLedgerVersion } = args;
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
  minLedgerVersion?: AnyNumber;
}) => {
  const { decidashConfig, aptos, account, minLedgerVersion } = args;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::deposit_to_subaccount`,
    functionArguments: [],
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
  amount: bigint;
  minLedgerVersion?: AnyNumber;
}) => {
  const { decidashConfig, aptos, account, amount, minLedgerVersion } = args;
  const request = await buildFeepayerTxRequest(aptos, account, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::usdc::mint`,
    functionArguments: [
      account.accountAddress,
      amount,
    ],
  });
  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};