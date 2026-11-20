const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const eventData = require("../utils/eventData");
const sendEventAnnouncement = require("../utils/sendEventAnnouncement");

const categories = ["Workshop", "Seminar", "Sports", "Other"];

function cleanText(value) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function validDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const day = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(day.getTime()) && day.toISOString().slice(0, 10) === value;
}

function eventInput(body) {
  const { title, description, category, date, venue } = body || {};
  if (typeof title !== "string" || typeof description !== "string" || typeof venue !== "string") {
    return { error: "Enter an event title, description and venue." };
  }

  const values = { title: cleanText(title), description: cleanText(description), venue: cleanText(venue) };
  if (!values.title || values.title.length > 150) {
    return { error: "Enter an event title up to 150 characters." };
  }
  if (!values.description || values.description.length > 5000) {
    return { error: "Enter an event description up to 5000 characters." };
  }
  if (!values.venue || values.venue.length > 200) {
    return { error: "Enter a venue up to 200 characters." };
  }
  if (!categories.includes(category)) return { error: "Choose a valid event category." };

  // Require a timezone so the date is independent of the server's timezone.
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/.test(date) || !validDay(date.slice(0, 10))) {
    return { error: "Enter a valid event date and time with its timezone." };
  }
  const eventDate = new Date(date);
  if (Number.isNaN(eventDate.getTime()) || eventDate.getTime() <= Date.now()) {
    return { error: "Choose a future event date and time." };
  }

  return { values: { ...values, category, date: eventDate } };
}

async function getEvents(req, res) {
  const { search = "", category = "", date = "", organizerId = "" } = req.query;
  if ([search, category, date, organizerId].some((value) => typeof value !== "string")) {
    return res.status(400).json({ message: "Use one text value for each filter." });
  }
  if (search.length > 150 || (category && !categories.includes(category))) {
    return res.status(400).json({ message: "Use a valid search and category." });
  }
  if (date && !validDay(date)) return res.status(400).json({ message: "Use an event date in YYYY-MM-DD format." });
  if (organizerId && !mongoose.isObjectIdOrHexString(organizerId)) {
    return res.status(400).json({ message: "The organizer ID is invalid." });
  }

  const filter = {};
  if (category) filter.category = category;
  if (organizerId) filter.organizerId = organizerId;
  if (date) {
    const start = new Date(`${date}T00:00:00+05:00`);
    // Filter by a calendar day in Pakistan, matching the React date picker.
    filter.date = { $gte: start, $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
  }

  const events = await Event.find(filter).sort({ date: 1, _id: 1 });
  const searchText = search.trim().toLowerCase();
  const results = events.map(eventData).filter((event) => event.title.toLowerCase().includes(searchText));
  return res.json({ events: results });
}

async function getEvent(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: "The event ID is invalid." });
  }
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "This event is unavailable or has been removed." });
  return res.json({ event: eventData(event) });
}

async function createEvent(req, res) {
  const input = eventInput(req.body);
  if (input.error) return res.status(400).json({ message: input.error });

  const event = await Event.create({ ...input.values, organizerId: req.user.id });
  let warning = "";
  try {
    const result = await sendEventAnnouncement(event);
    if (result.failed) warning = "Event saved, but some announcement emails could not be sent.";
  } catch (error) {
    console.error("Event announcements failed:", error.code || error.name);
    warning = "Event saved, but announcement emails could not be sent.";
  }

  return res.status(201).json({ message: "Event created.", event: eventData(event), warning });
}

async function updateEvent(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: "The event ID is invalid." });
  }
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "This event is unavailable or has been removed." });
  if (event.organizerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only edit events that you created." });
  }

  const input = eventInput(req.body);
  if (input.error) return res.status(400).json({ message: input.error });

  const updated = await Event.findByIdAndUpdate(event.id, input.values, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "This event has been removed." });
  return res.json({ message: "Event updated.", event: eventData(updated) });
}

async function deleteEvent(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: "The event ID is invalid." });
  }
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "This event is unavailable or has been removed." });
  if (event.organizerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only delete events that you created." });
  }

  await Event.deleteOne({ _id: event.id });
  await Registration.deleteMany({ eventId: event.id });
  return res.json({ message: "Event and its registrations deleted." });
}

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
