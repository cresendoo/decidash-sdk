import {
  Account,
  Aptos,
  AptosConfig,
  Deserializer,
  Ed25519PrivateKey,
  type HexInput,
  Network,
  PrivateKey,
  PrivateKeyVariants,
  RawTransaction,
  TransactionPayload,
} from "@aptos-labs/ts-sdk";
import { DeciDashConfig } from "../src/config";
import {
  createNewSubAccount,
  depositToSubAccount,
  getAccountBalance,
  getPrimarySubAccount,
  testUSDCMint,
  withdrawFromSubAccount,
} from "../src/contract/account";

async function main() {
  const config = new AptosConfig({
    network: Network.DEVNET,
    fullnode: DeciDashConfig.DEVNET.node.HTTPURL,
  });
  const aptos = new Aptos(config);

  const PRIVATE_KEY = process.env.PRIVATE_KEY as HexInput;

  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
    ),
  });

  try {
    const accountAddress =
      "0x3ad47b35a05c6fb2238b00851c407c31dcb298c7c3578b014eb10ac9fd6ff883"; // 사용자 계정 주소

    const result1 = await createNewSubAccount({
      decidashConfig: DeciDashConfig.DEVNET,
      aptos,
      account,
    });

    console.log("New Sub Account:", result1);

    const subAccountAddress = await getPrimarySubAccount({
      aptos,
      accountAddress,
    });

    console.log("Primary Sub Account:", subAccountAddress);

    const result2 = await testUSDCMint({
      decidashConfig: DeciDashConfig.DEVNET,
      aptos,
      account,
      amount: BigInt(10_000_000_000), // 10000 USDC
    });

    console.log("Test USDC Mint:", result2);

    let balance = await getAccountBalance({
      aptos,
      accountAddress,
    });
    console.log("Account Balance:", balance);

    const result4 = await depositToSubAccount({
      decidashConfig: DeciDashConfig.DEVNET,
      aptos,
      account,
      amount: BigInt(10_000_000_000), // 10000 USDC
    });
    console.log("Deposit to Sub Account:", result4);

    balance = await getAccountBalance({
      aptos,
      accountAddress,
    });
    console.log("Account Balance:", balance);

    const result5 = await withdrawFromSubAccount({
      decidashConfig: DeciDashConfig.DEVNET,
      aptos,
      account,
      subAccountAddress,
      amount: BigInt(10_000_000_000), // 10000 USDC
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
