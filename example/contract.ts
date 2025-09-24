import {
  Account,
  Aptos,
  AptosConfig,
  Deserializer,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
  RawTransaction,
  TransactionPayload,
} from "@aptos-labs/ts-sdk";
import { DeciDashConfig } from "../src/config";
import {
  createNewSubAccount,
  getPrimarySubAccount,
  testUSDCMint,
} from "../src/contract/account";

async function main() {
  const config = new AptosConfig({
    network: Network.DEVNET,
    fullnode: DeciDashConfig.DEVNET.node.HTTPURL,
  });
  const aptos = new Aptos(config);

  const PRIVATE_KEY = "your-private-key";

  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
    ),
  });

  try {
    const accountAddress =
      "0x28b8e2fe37a8d13b62b49d96d2c9ada464db0ea0520527c94bdcc6ae91cf299a"; // 사용자 계정 주소
    const result = await getPrimarySubAccount({
      aptos,
      accountAddress,
    });

    console.log("Primary Sub Account:", result);

    const result2 = await testUSDCMint({
      decidashConfig: DeciDashConfig.DEVNET,
      aptos,
      account,
      amount: BigInt(10_000_000), // 10 USDC
    });

    console.log("Test USDC Mint:", result2);

    // const result2 = await createNewSubAccount({
    //   decidashConfig: DeciDashConfig.DEVNET,
    //   aptos,
    //   account,
    // });

    // console.log("New Sub Account:", result2);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
