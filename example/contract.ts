import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  type HexInput,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { config } from "dotenv";
import { DeciDashConfig } from "../src/config";
import {
  createNewSubAccount,
  depositToSubAccount,
  getAccountBalance,
  getPrimarySubAccount,
  testUSDCMint,
  withdrawFromSubAccount,
} from "../src/contract/account";

config();

async function main() {
  const config = new AptosConfig({
    network: Network.DEVNET,
    fullnode: DeciDashConfig.DEVNET.node.HTTPURL,
  });
  const decidashConfig = DeciDashConfig.DEVNET;

  const aptos = new Aptos(config);

  const PRIVATE_KEY = process.env.PRIVATE_KEY as HexInput;

  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
    ),
  });
  const accountAddress = account.accountAddress;

  try {
    const result1 = await createNewSubAccount({
      decidashConfig,
      aptos,
      signer: account,
    });

    console.log("New Sub Account:", result1);

    const subAccountAddress = await getPrimarySubAccount({
      aptos,
      accountAddress,
    });

    console.log("Primary Sub Account:", subAccountAddress);

    const result2 = await testUSDCMint({
      decidashConfig,
      aptos,
      signer: account,
      amount: 10000, // 10000 USDC
    });

    console.log("Test USDC Mint:", result2);

    let balance = await getAccountBalance({
      aptos,
      accountAddress,
    });
    console.log("Account Balance:", balance);

    const result4 = await depositToSubAccount({
      decidashConfig,
      aptos,
      signer: account,
      amount: 10000, // 10000 USDC
    });
    console.log("Deposit to Sub Account:", result4);

    balance = await getAccountBalance({
      aptos,
      accountAddress,
    });
    console.log("Account Balance:", balance);

    const result5 = await withdrawFromSubAccount({
      decidashConfig,
      aptos,
      signer: account,
      subAccountAddress,
      amount: 10000, // 10000 USDC
    });

    console.log("Withdraw from Sub Account:", result5);

    balance = await getAccountBalance({
      aptos,
      accountAddress,
    });
    console.log("Account Balance:", balance);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
