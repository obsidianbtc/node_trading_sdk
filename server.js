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
