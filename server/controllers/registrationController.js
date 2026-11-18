const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const eventData = require("../utils/eventData");

async function registerForEvent(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: "The event ID is invalid." });
  }
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "This event is unavailable or has been removed." });
  if (event.date.getTime() <= Date.now()) {
    return res.status(400).json({ message: "Registration is closed because this event has started." });
  }

  let registration;
  try {
    // Never accept a student ID from the request body.
    registration = await Registration.create({ studentId: req.user.id, eventId: event.id });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You are already registered for this event." });
    throw error;
  }

  // The organizer might delete the event while this registration is being saved.
  const available = await Event.exists({ _id: event.id, date: { $gt: new Date() } });
  if (!available) {
    await Registration.deleteOne({ _id: registration.id });
    return res.status(409).json({ message: "This event was removed or has already started." });
  }

  return res.status(201).json({
    message: "You are registered for this event.",
    registration: { id: registration.id, studentId: req.user.id, eventId: event.id },
  });
}

async function getMyRegistrations(req, res) {
  const registrations = await Registration.find({ studentId: req.user.id }).populate("eventId");
  const results = registrations.filter((item) => item.eventId).map((item) => ({
    id: item.id,
    studentId: req.user.id,
    eventId: item.eventId.id,
    event: eventData(item.eventId),
  }));
  res.set("Cache-Control", "no-store");
  return res.json({ registrations: results });
}

async function cancelRegistration(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: "The event ID is invalid." });
  }
  const registration = await Registration.findOneAndDelete({ eventId: req.params.id, studentId: req.user.id });
  if (!registration) return res.status(404).json({ message: "You are not registered for this event." });
  return res.json({ message: "Your registration has been cancelled." });
}

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration };
