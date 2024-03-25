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
