const express = require("express");
const { register, verifyEmail, resendCode } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);

module.exports = router;
