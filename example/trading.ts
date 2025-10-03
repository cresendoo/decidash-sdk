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
import { getMarkets } from "../src/api/market";
import { DeciDashConfig } from "../src/config";
import {
  createNewSubAccount,
  deposit,
  getPrimarySubAccount,
  testUSDCMint,
  withdraw,
} from "../src/contract/account";
import { placeOrderToSubaccount } from "../src/contract/trading";
import { printAccountBalance } from "./utils";

config();

async function main() {
  const config = new AptosConfig({
    network: Network.DEVNET,
    fullnode: DeciDashConfig.DEVNET.node.HTTPURL,
  });
  const decidashConfig = DeciDashConfig.DEVNET;

  const aptos = new Aptos(config);

  const PRIVATE_KEY = process.env.PRIVATE_KEY as HexInput;

  const primaryAccount = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
    ),
  });
  const accountAddress = primaryAccount.accountAddress;

  try {
    // Get Primary Sub Account
    const subAccountAddress = await getPrimarySubAccount({
      aptos,
      primaryAddress: accountAddress,
    });
    console.log("Primary Sub Account:", subAccountAddress);

    // Test USDC Mint
    void (await testUSDCMint({
      decidashConfig,
      aptos,
      primaryAccount: primaryAccount,
      amount: 10000, // 10000 USDC
    }));
    console.log("Test USDC Mint");
    printAccountBalance(aptos, accountAddress, subAccountAddress);

    // Deposit to Sub Account
    void (await deposit({
      decidashConfig,
      aptos,
      signer: primaryAccount,
      amount: 10000, // 10000 USDC
    }));
    console.log("Deposit to Sub Account");
    printAccountBalance(aptos, accountAddress, subAccountAddress);

    // Get Market
    const markets = await getMarkets({ decidashConfig });
    const targetMarket = markets[0];
    if (!targetMarket) {
      console.log("⚠️ No markets returned. Exiting example.");
      return;
    }
    console.log("Target Market:", targetMarket);

    // Place Order
    const result = await placeOrderToSubaccount({
      decidashConfig,
      aptos,
      signer: primaryAccount,
      subAccountAddress,
      market: targetMarket,
      price: 354,
      size: 354,
      isLong: true,
      timeInForce: 1,
      isReduceOnly: false,
      clientOrderId: 1,
    });
    console.log("Place Order");
    printAccountBalance(aptos, accountAddress, subAccountAddress);
    console.log("Order Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
