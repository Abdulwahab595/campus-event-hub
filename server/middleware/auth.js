const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (\S+)$/i);
  if (!match) return res.status(401).json({ message: "Log in to continue." });

  let decoded;
  try {
    decoded = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ message: "Your login has expired or is invalid. Log in again." });
  }

  if (!mongoose.isObjectIdOrHexString(decoded?.id) || !Number.isInteger(decoded?.exp)) {
    return res.status(401).json({ message: "Your login is invalid. Log in again." });
  }

  // Look up the current account so permissions use its saved role.
  const user = await User.findOne({ _id: decoded.id, isVerified: true }).select("name email role isVerified");
  if (!user) return res.status(401).json({ message: "Your verified account could not be found." });

  req.user = user;
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Your account does not have permission." });
    }

    next();
  };
}

module.exports = { requireAuth, requireRole };
