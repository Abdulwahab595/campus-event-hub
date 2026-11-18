const express = require("express");
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");
const { registerForEvent, cancelRegistration } = require("../controllers/registrationController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", requireAuth, requireRole("organizer"), createEvent);
router.put("/:id", requireAuth, requireRole("organizer"), updateEvent);
router.delete("/:id", requireAuth, requireRole("organizer"), deleteEvent);
router.post("/:id/registrations", requireAuth, requireRole("student"), registerForEvent);
router.delete("/:id/registrations", requireAuth, requireRole("student"), cancelRegistration);

module.exports = router;
