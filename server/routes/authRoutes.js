const express = require("express");
const { register, verifyEmail, resendCode, login, getCurrentUser } = require("../controllers/authController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);
router.post("/login", login);
router.get("/me", requireAuth, requireRole("student", "organizer"), getCurrentUser);

module.exports = router;
