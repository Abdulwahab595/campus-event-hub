require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Campus Event Hub API is running" });
});

connectDB().then(() => {
  app.listen(PORT, "127.0.0.1", (error) => {
    if (error) {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    }

    console.log(`Server running at http://localhost:${PORT}`);
  });
});
