const Registration = require("../models/Registration");
const sendEmail = require("./sendEmail");
const eventEmail = require("./eventEmail");

const ONE_DAY = 24 * 60 * 60 * 1000;
let running = false;

async function sendEventReminders() {
  if (running) return;
  running = true;

  try {
    const registrations = await Registration.find().select("_id");
    for (const item of registrations) {
      // A registration or event can change while another email is being sent.
      const registration = await Registration.findById(item.id).populate("eventId").populate("studentId");
      if (!registration) continue;
      const event = registration.eventId;
      const student = registration.studentId;
      if (!event || !student || student.role !== "student" || !student.isVerified) continue;

      const timeLeft = event.date.getTime() - Date.now();
      if (timeLeft <= 0 || timeLeft > ONE_DAY) continue;
      if (registration.reminderSentFor?.getTime() === event.date.getTime()) continue;

      try {
        await sendEmail({ to: student.email, ...eventEmail(event, "Event reminder") });
        registration.reminderSentFor = event.date;
        await registration.save();
      } catch (error) {
        // A failed delivery stays eligible for the next check.
        console.error("Event reminder failed:", error.code || error.name);
      }
    }
  } catch (error) {
    console.error("Reminder check failed:", error.code || error.name);
  } finally {
    running = false;
  }
}

module.exports = sendEventReminders;
