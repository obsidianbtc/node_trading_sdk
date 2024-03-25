```javascript
const express = require("express");
const app = express();
const port = process.env.PORT || 5001; // Use environment variable for port
const aptosSdk = require("./aptos");

app.use(express.json());

// Logging middleware for consistent logging
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

app.post("/apt/createCollectionBid", async (req, res, next) => {
  try {
    const { collectionId, bidAmount, numOfBids, wallet } = req.body;
    if (collectionId && bidAmount && numOfBids) {
      const tx = await aptosSdk.createCollectionBid(
        collectionId,
        bidAmount,
        numOfBids,
        wallet,
      );
      res.json(tx);
    } else {
      res.status(400).json({
        error: "Send data in format: { collectionId, bidAmount, numOfBids }",
      });
    }
  } catch (e) {
    next(e); // Pass errors to the error-handling middleware
  }
});

app.post("/apt/listNft", async (req, res, next) => {
  try {
    const { nft, price, wallet } = req.body;
    if (nft && price) {
      const tx = await aptosSdk.listNft(nft, price, wallet);
      res.json(tx);
    } else {
      res.status(400).json({ error: "Send data in format: { nft, price }" });
    }
  } catch (e) {
    next(e);
  }
});

app.post("/apt/removeCollectionBid", async (req, res, next) => {
  try {
    const { bid, wallet } = req.body;
    if (bid) {
      const tx = await aptosSdk.removeCollectionBid(bid, wallet);
      res.json(tx);
    } else {
      res.status(400).json({ error: "Send data in format: { bid }" });
    }
  } catch (e) {
    next(e);
  }
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.log("error thrown");
  console.log(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
```

```javascript
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
```

Write a readme file on how to set up this application and what it does

# Aptos Express Server Application

This application provides a back-end server implemented in Node.js using the Express framework, capable of interacting with the Aptos blockchain. It allows users to create collection bids, list NFTs for sale, and remove collection bids through associated API endpoints, leveraging the Aptos API and the `@indexer-xyz/aptos` AptosMarketClient.

## Features

- Creating bids on NFT collections.
- Listing NFTs for sale.
- Removing existing bids on NFT collections.
- Logging of HTTP requests.
- Centralized error handling.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended).
- npm (typically included with Node.js).
- An Aptos blockchain account with its wallet address and private key.

## Installation

1. **Clone the repository.**

```sh
git clone [URL to this repository]
cd [repository-name]
```

2. **Install dependencies.**

```sh
npm install
```

3. **Set environment variables.**

Create a `.env` file in the root directory of the project. Add the following keys:

- `PORT` (optional) - The port number on which your server will run (default is 5001).
- Wallet addresses and private keys

Replace the placeholders in the `.env` file accordingly.

```env
PORT=5001
WALLET_ADDRESS_1=insert_wallet_address_here
WALLET_PRIVATE_KEY_1=insert_private_key_here
API_KEY=insert_api_key_here
API_USER=insert_api_user_here
```

4. **Replace placeholder values in the code.**

In the file containing the Aptos SDK logic:

- Replace the placeholders `"insert_private_key_here"` and `"insert_wallet_address_here"` with the actual values from your `.env` file or a secure configuration source.
- Update `"insert_api_key"` and `"insert_api_user"` in the `aptosMarketClient` with the API keys you receive after signing up with the Aptos marketplace.

## Running the Server

1. **Start the server.**

```sh
npm start
```

The server will start and listen on the port defined in the `.env` file or default to port `5001`.

2. **Testing the endpoints.**

You can test the functionality by sending HTTP POST requests to the server's endpoints:

- `/apt/createCollectionBid`: Creates a collection bid.
- `/apt/listNft`: Lists an NFT for sale.
- `/apt/removeCollectionBid`: Removes a collection bid.

Use tools such as `curl` command-line utility, Postman, or any REST client to interact with the server.

## Security Note

Never commit your private keys or API secrets into the version control system. Always use environment variables or a key management service to securely manage sensitive information.

## Support and Contribution

For any questions or contributions to the project, consider creating an issue or pull request in the repository.

## Disclaimer

This application is provided for educational and demonstration purposes. Always ensure the proper security measures are in place when dealing with blockchain transactions and sensitive information.
