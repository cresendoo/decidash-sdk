import {
  Aptos,
  AptosConfig,
  Deserializer,
  Network,
  RawTransaction,
} from "@aptos-labs/ts-sdk";
import { DeciDashConfig } from "../src/config";

async function parse() {
  const config = new AptosConfig({
    network: Network.DEVNET,
    fullnode: DeciDashConfig.DEVNET.node.HTTPURL,
  });
  const aptos = new Aptos(config);

  const transactionData = {
    signature: [
      0, 32, 198, 246, 0, 193, 69, 14, 229, 185, 193, 94, 244, 216, 62, 24, 180,
      56, 69, 244, 214, 0, 242, 62, 20, 67, 25, 238, 237, 139, 164, 181, 117,
      185, 64, 117, 64, 245, 215, 197, 143, 234, 7, 90, 13, 145, 254, 15, 186,
      234, 153, 221, 56, 152, 41, 163, 245, 83, 118, 243, 117, 19, 186, 7, 26,
      125, 99, 143, 121, 223, 47, 200, 18, 119, 143, 247, 104, 239, 54, 196,
      226, 106, 6, 179, 62, 80, 85, 63, 19, 8, 252, 242, 102, 76, 221, 180, 152,
      246, 1,
    ],
    transaction: [
      113, 244, 112, 150, 254, 74, 253, 36, 243, 113, 76, 124, 89, 195, 33, 137,
      162, 160, 134, 219, 22, 155, 89, 160, 209, 85, 76, 203, 228, 205, 39, 18,
      1, 0, 0, 0, 0, 0, 0, 0, 2, 184, 165, 120, 131, 20, 69, 28, 228, 210, 251,
      186, 211, 46, 27, 173, 136, 212, 24, 75, 115, 148, 59, 127, 229, 22, 110,
      171, 147, 207, 26, 90, 149, 12, 100, 101, 120, 95, 97, 99, 99, 111, 117,
      110, 116, 115, 21, 100, 101, 112, 111, 115, 105, 116, 95, 116, 111, 95,
      115, 117, 98, 97, 99, 99, 111, 117, 110, 116, 0, 2, 32, 101, 85, 186, 1,
      3, 11, 54, 111, 145, 201, 153, 172, 148, 51, 37, 9, 100, 149, 179, 57,
      216, 30, 33, 106, 42, 244, 94, 16, 35, 96, 159, 2, 8, 0, 228, 11, 84, 2,
      0, 0, 0, 64, 13, 3, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 89, 200, 210,
      104, 0, 0, 0, 0, 4,
    ],
  };

  // Uint8Array로 변환
  const transactionBytes = new Uint8Array(transactionData.transaction);
  const signatureBytes = new Uint8Array(transactionData.signature);
  const deserializer = new Deserializer(transactionBytes);
  const transaction = RawTransaction.deserialize(deserializer);

  console.log("=== Deserialized Transaction Details ===");
  console.log("Sender:", transaction.sender.toString());
  console.log("Sequence Number:", transaction.sequence_number.toString());
  console.log("Gas Unit Price:", transaction.gas_unit_price.toString());
  console.log("Max Gas Amount:", transaction.max_gas_amount.toString());
  console.log(
    "Expiration Timestamp:",
    transaction.expiration_timestamp_secs.toString(),
  );
  console.log("Chain ID:", transaction.chain_id.chainId.toString());

  console.log("\n=== Payload Details ===");
  if (transaction.payload) {
    console.log("Payload Type:", transaction.payload.constructor.name);

    const payload = transaction.payload as any;
    if (payload.function) {
      console.log("Function:", payload.function);
      console.log("Arguments Count:", payload.arguments?.length || 0);

      if (payload.arguments && payload.arguments.length > 0) {
        console.log("Arguments:");
        payload.arguments.forEach((arg: any, index: number) => {
          console.log(`  [${index}]:`, arg);
        });
      }

      if (payload.type_arguments && payload.type_arguments.length > 0) {
        console.log("Type Arguments:");
        payload.type_arguments.forEach((typeArg: any, index: number) => {
          console.log(`  [${index}]:`, typeArg);
        });
      }
    }
  }

  console.log("\n=== Signature Details ===");
  console.log("Signature Length:", signatureBytes.length);
  console.log(
    "Signature (hex):",
    Array.from(signatureBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  );
  console.log("Signature (bytes):", Array.from(signatureBytes));

  if (signatureBytes.length >= 65) {
    const publicKey = signatureBytes.slice(0, 32);
    const signature = signatureBytes.slice(32, 96);
    const recoveryId = signatureBytes.slice(96, 97);

    console.log(
      "Public Key (hex):",
      Array.from(publicKey)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    );
    console.log(
      "Signature (hex):",
      Array.from(signature)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    );
    console.log("Recovery ID:", Array.from(recoveryId)[0]);
  }

  console.log("\n=== Transaction Bytes Details ===");
  console.log("Transaction Length:", transactionBytes.length);
  console.log(
    "Transaction (hex):",
    Array.from(transactionBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  );

  console.log("\n=== Raw Transaction Object ===");

  const replacer = (key: string, value: any) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    if (value && typeof value === "object" && value.data) {
      return Array.from(value.data);
    }
    return value;
  };
  console.log(JSON.stringify(transaction, replacer, 2));
}

parse().catch(console.error);
