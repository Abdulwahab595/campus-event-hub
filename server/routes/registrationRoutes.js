const express = require("express");
const { getMyRegistrations } = require("../controllers/registrationController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, requireRole("student"), getMyRegistrations);

module.exports = router;
