import {
  Account,
  type AccountAddressInput,
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
  deposit,
  getPrimarySubAccount,
  getSubAccountBalance,
  testUSDCMint,
  withdraw,
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

  const primaryAccount = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
    ),
  });
  const accountAddress = primaryAccount.accountAddress;

  const printAccountBalance = async (
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

  try {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
    void (await createNewSubAccount({
      decidashConfig,
      aptos,
      primaryAccount: primaryAccount,
    }));
    console.log("New Sub Account");

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
    const subAccountAddress = await getPrimarySubAccount({
      aptos,
      primaryAddress: accountAddress,
    });
    console.log("Primary Sub Account:", subAccountAddress);

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
    void (await testUSDCMint({
      decidashConfig,
      aptos,
      primaryAccount: primaryAccount,
      amount: 10000, // 10000 USDC
    }));
    console.log("Test USDC Mint");
    printAccountBalance(accountAddress, subAccountAddress);

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
    void (await deposit({
      decidashConfig,
      aptos,
      signer: primaryAccount,
      amount: 10000, // 10000 USDC
    }));
    console.log("Deposit to Sub Account");
    printAccountBalance(accountAddress, subAccountAddress);

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
    void (await withdraw({
      decidashConfig,
      aptos,
      signer: primaryAccount,
      subAccountAddress,
      amount: 10000, // 10000 USDC
    }));
    console.log("Withdraw from Sub Account");
    printAccountBalance(accountAddress, subAccountAddress);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
