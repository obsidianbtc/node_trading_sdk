const { AptosMarketClient } = require("@indexer-xyz/aptos");
const {
  Account,
  Aptos,
  AptosConfig,
  Deserializer,
  Ed25519PrivateKey,
  InputEntryFunctionData,
  Network,
  RawTransaction,
  TransactionPayloadEntryFunction,
} = require("@aptos-labs/ts-sdk");

const aptos = new Aptos(new AptosConfig({ network: Network.MAINNET }));

const getAccount = (address) => {
  switch (address) {
    // Ice Blue
    case "insert_wallet_address_here":
      let pk = new Ed25519PrivateKey(toUint8Array("insert_private_key_here"));
      let account1 = Account.fromPrivateKey({ privateKey: pk });
      return account1;
    // Apt Monkey
  }
};

function toUint8Array(hex) {
  return Buffer.from(hex.replace(/^0x/, ""), "hex");
}

function toHexString(byteArray) {
  return Buffer.from(byteArray).toString("hex");
}

const aptosMarketClient = new AptosMarketClient({
  apiKey: "insert_api_key",
  apiUser: "Insert_api_user",
});

const txHash = async (hash) => {
  const tx = await aptos.getTransactionByHash({ transactionHash: hash });
  if (tx && tx.success) {
    return tx;
  } else if (tx && tx.success == false) {
    console.log(`tx failed: ${hash}`);
    return tx;
  } else {
    console.log("txHash waiting..");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return txHash(hash);
  }
};

const signAndSubmit = async (data, wallet) => {
  const transaction = await aptos.transaction.build.simple({
    sender: getAccount(wallet).accountAddress,
    data: data,
  });
  // console.log(transaction);
  // return transaction;
  const committedTransaction = await aptos.signAndSubmitTransaction({
    signer: getAccount(wallet),
    transaction,
  });
  console.log(committedTransaction);
  hash = committedTransaction.hash;
  //find if tx is confirmed

  const tx = await txHash(hash);
  return tx;
  // return committedTransaction;
};

const convertToAptos = (price) => {
  return price / 100000000;
};

const createCollectionBid = async (
  collectionId,
  bidAmount,
  numOfBids,
  wallet,
) => {
  console.log(collectionId, bidAmount, numOfBids);
  const payload = await aptosMarketClient.placeCollectionBid({
    collectionId: collectionId,
    bidAmount: convertToAptos(bidAmount),
    numOfBids: numOfBids,
  });
  console.log("here ->", payload);
  const tx = await signAndSubmit(payload, wallet);
  console.log(`createCollectionBid(): ${bidAmount}`);
  return tx;
};

const listNft = async (nft, price, wallet) => {
  try {
    const payload = await aptosMarketClient.listNfts({
      nfts: [
        {
          id: nft.id,
          listPrice: convertToAptos(price),
        },
      ],
    });
    const tx = await signAndSubmit(payload, wallet);
    console.log(`listNft(): ${price}`);
    return tx;
  } catch (e) {
    throw e;
  }
};

const removeCollectionBid = async (bid, wallet) => {
  const payload = await aptosMarketClient.removeCollectionBid({
    bidId: bid?.id,
  });
  const tx = await signAndSubmit(payload, wallet);
  return tx;
};

module.exports = {
  createCollectionBid,
  listNft,
  removeCollectionBid,
  getAccount,
};
