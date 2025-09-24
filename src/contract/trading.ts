import { postFeePayer } from "@/api/feepayer";
import type { DeciDashConfig } from "@/config";
import type { Account, AccountAddressInput, Aptos } from "@aptos-labs/ts-sdk";
import { buildFeepayerTxRequest } from "./aptos";
import {
  DECIBEL_CONTRACT_ADDRESS,
  PRICE_DECIMALS,
  SIZE_DECIMALS,
} from "./const";

export const placeOrderToSubaccount = async (args: {
  decidashConfig: DeciDashConfig;
  aptos: Aptos;
  signer: Account;
  subAccountAddress: AccountAddressInput;
  marketAdddress: string;
  price: number; // 4.5$ => 4.5
  size: number; // 10 APT => 10
  isLong: boolean;
  timeInForce: number;
  reduceOnly: boolean;
}) => {
  const {
    decidashConfig,
    aptos,
    signer,
    subAccountAddress,
    marketAdddress,
    isLong,
    timeInForce,
    reduceOnly,
  } = args;
  const _price = args.price * PRICE_DECIMALS;
  const _size = args.size * SIZE_DECIMALS;

  const request = await buildFeepayerTxRequest(aptos, signer, {
    function: `${DECIBEL_CONTRACT_ADDRESS}::dex_accounts::place_order_to_subaccount`,
    functionArguments: [
      subAccountAddress,
      marketAdddress,
      _price,
      _size,
      isLong,
      timeInForce,
      reduceOnly,
    ],
  });

  const response = await postFeePayer({
    decidashConfig: decidashConfig,
    signature: request.signature,
    transaction: request.transaction,
  });
  return response;
};
