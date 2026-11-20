const escapeHtml = require("escape-html");
const eventData = require("./eventData");

function eventEmail(event, heading = "New campus event") {
  const details = eventData(event);
  const date = new Date(details.date).toLocaleString("en-GB", {
    dateStyle: "medium", timeStyle: "short", hour12: true, timeZone: "Asia/Karachi",
  });

  return {
    subject: `${heading}: ${details.title}`,
    text: `${heading}\n\n${details.title}\n${details.description}\nCategory: ${details.category}\nDate and time: ${date} PKT\nVenue: ${details.venue}`,
    html: `<h2>${escapeHtml(heading)}</h2>
      <h3>${escapeHtml(details.title)}</h3>
      <p>${escapeHtml(details.description)}</p>
      <p><strong>Category:</strong> ${escapeHtml(details.category)}</p>
      <p><strong>Date and time:</strong> ${escapeHtml(date)} PKT</p>
      <p><strong>Venue:</strong> ${escapeHtml(details.venue)}</p>`,
  };
}

module.exports = eventEmail;
