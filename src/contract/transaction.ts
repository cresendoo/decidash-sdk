import type {
  Account,
  Aptos,
  InputEntryFunctionData,
  InputMultiSigData,
} from "@aptos-labs/ts-sdk";

export const buildFeepayerTxRequest = async (
  aptos: Aptos,
  signer: Account,
  payload: InputEntryFunctionData | InputMultiSigData,
) => {
  const transaction = await aptos.transaction.build.simple({
    sender: signer.accountAddress,
    data: payload,
    withFeePayer: true,
    options: {
      expireTimestamp: Date.now() + 60_000,
    },
  });
  const senderAuthenticator = aptos.transaction.sign({ signer, transaction });

  return {
    transaction: Array.from(transaction.rawTransaction.bcsToBytes()),
    signature: Array.from(senderAuthenticator.bcsToBytes()),
  };
};
