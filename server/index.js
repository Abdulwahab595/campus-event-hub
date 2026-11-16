require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Campus Event Hub API is running" });
});

app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Send a valid JSON body." });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "The request body is too large." });
  }

  console.error("API request failed:", error.name);
  res.status(500).json({ message: "The server could not complete the request." });
});

async function startServer() {
  if (!process.env.JWT_SECRET) throw new Error("Set JWT_SECRET in server/.env");

  await connectDB();
  await User.init(); // Wait for MongoDB to create the unique email index.

  app.listen(PORT, "127.0.0.1", (error) => {
    if (error) {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    }

    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server failed to start:", error.message);
  process.exit(1);
});
