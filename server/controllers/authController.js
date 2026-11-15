const { createHmac, randomInt } = require("node:crypto");
const User = require("../models/User");
const hashPassword = require("../utils/password");

const CODE_LIFETIME = 10 * 60 * 1000;
const RESEND_DELAY = 60 * 1000;
const MAX_ATTEMPTS = 5;

function normalizeEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function hashCode(email, code) {
  const secret = process.env.VERIFICATION_SECRET;
  if (!secret) throw new Error("Set VERIFICATION_SECRET in server/.env");
  return createHmac("sha256", secret).update(`${email}:${code}`).digest("hex");
}

function createVerification(email, previousHash) {
  let code, codeHash;
  do {
    code = String(randomInt(100000, 1000000));
    codeHash = hashCode(email, code);
  } while (codeHash === previousHash);

  const now = Date.now();
  return {
    code,
    fields: {
      verificationCodeHash: codeHash,
      verificationExpiresAt: new Date(now + CODE_LIFETIME),
      verificationResendAt: new Date(now + RESEND_DELAY),
      verificationAttempts: 0,
    },
  };
}

async function sendVerificationEmail(res, email, code, status) {
  try {
    const sendEmail = require("../utils/sendEmail");
    await sendEmail({
      to: email,
      subject: "Campus Event Hub verification code",
      text: `Your verification code is ${code}. It expires in 10 minutes. If you did not register, ignore this email.`,
    });
  } catch (error) {
    console.error("Verification email failed:", error.code || error.name);
    return res.status(503).json({ message: "Email could not be sent. Request another code after one minute." });
  }

  return res.status(status).json({ message: "Verification code sent to your email." });
}

async function register(req, res) {
  const { name, email: inputEmail, password, role } = req.body || {};
  const email = normalizeEmail(inputEmail);
  if (typeof name !== "string" || !name.trim() || name.trim().length > 100 || !email) {
    return res.status(400).json({ message: "Enter a valid name (up to 100 characters) and email address." });
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 128) {
    return res.status(400).json({ message: "Use a password of 6 to 128 characters." });
  }
  if (role !== "student" && role !== "organizer") {
    return res.status(400).json({ message: "Choose Student or Organizer." });
  }

  const { code, fields } = createVerification(email);
  try {
    await User.create({ name: name.trim(), email, passwordHash: await hashPassword(password), role, ...fields });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    throw error;
  }

  return sendVerificationEmail(res, email, code, 201);
}

async function verifyEmail(req, res) {
  const { email: inputEmail, code } = req.body || {};
  const email = normalizeEmail(inputEmail);
  if (!email || typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ message: "Enter your email and a six-digit code." });
  }

  const codeHash = hashCode(email, code);
  // Count the attempt in MongoDB before checking the code.
  const user = await User.findOneAndUpdate({
    email,
    isVerified: false,
    verificationExpiresAt: { $gt: new Date() },
    verificationAttempts: { $lt: MAX_ATTEMPTS },
  }, { $inc: { verificationAttempts: 1 } }).select("+verificationCodeHash");

  if (!user || user.verificationCodeHash !== codeHash) {
    return res.status(400).json({ message: "The code is incorrect, expired, or out of attempts. Try again or request a new code." });
  }

  const result = await User.updateOne({
    _id: user._id,
    isVerified: false,
    verificationCodeHash: codeHash,
    verificationExpiresAt: { $gt: new Date() },
  }, {
    $set: { isVerified: true },
    $unset: { verificationCodeHash: 1, verificationExpiresAt: 1, verificationAttempts: 1, verificationResendAt: 1 },
  });
  if (!result.modifiedCount) {
    return res.status(400).json({ message: "The code is no longer valid. Use your latest code." });
  }

  return res.json({ message: "Email verified. You can now log in." });
}

async function resendCode(req, res) {
  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(400).json({ message: "Enter a valid email address." });

  const user = await User.findOne({ email, isVerified: false }).select("+verificationCodeHash");
  if (!user) return res.status(404).json({ message: "No unverified account was found." });
  if (user.verificationResendAt > new Date()) {
    return res.status(429).json({ message: "Wait one minute before requesting another code." });
  }

  const { code, fields } = createVerification(email, user.verificationCodeHash);
  const result = await User.updateOne({
    _id: user._id,
    isVerified: false,
    verificationCodeHash: user.verificationCodeHash ?? null,
  }, { $set: fields });
  if (!result.modifiedCount) {
    return res.status(409).json({ message: "Your verification details changed. Try again shortly." });
  }

  return sendVerificationEmail(res, email, code, 200);
}

module.exports = { register, verifyEmail, resendCode };
