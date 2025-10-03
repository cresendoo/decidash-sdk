import type { AccountAddressInput, Aptos } from "@aptos-labs/ts-sdk";
import { getSubAccountBalance } from "../src/contract/account";

export const printAccountBalance = async (
  aptos: Aptos,
  accountAddress: AccountAddressInput,
  subAccountAddress: AccountAddressInput,
) => {
  const primaryAccountBalance = await getSubAccountBalance({
    aptos,
    subAccountAddress: accountAddress,
  });

  const subAccountBalance = await getSubAccountBalance({
    aptos,
    subAccountAddress: subAccountAddress,
  });
  console.log("-------------------------------------------------");
  console.log("Primary Account Balance:", primaryAccountBalance);
  console.log("Sub Account Balance:", subAccountBalance);
  console.log("-------------------------------------------------");
};
