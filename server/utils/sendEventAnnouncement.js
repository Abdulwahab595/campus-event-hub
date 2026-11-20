const User = require("../models/User");
const sendEmail = require("./sendEmail");
const eventEmail = require("./eventEmail");

async function sendEventAnnouncement(event) {
  const students = await User.find({ role: "student", isVerified: true }).select("email");
  const content = eventEmail(event);
  let failed = 0;

  for (const student of students) {
    try {
      // Send separately so students do not see each other's email addresses.
      await sendEmail({ to: student.email, ...content });
    } catch (error) {
      failed += 1;
      console.error("Event announcement failed:", error.code || error.name);
    }
  }

  return { sent: students.length - failed, failed };
}

module.exports = sendEventAnnouncement;
