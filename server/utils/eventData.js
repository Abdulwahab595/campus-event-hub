// Sanitized fields are stored as HTML-safe text. Return normal text for React.
function displayText(value) {
  return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function eventData(event) {
  return {
    id: event.id,
    title: displayText(event.title),
    description: displayText(event.description),
    category: event.category,
    date: event.date.toISOString(),
    venue: displayText(event.venue),
    organizerId: event.organizerId.toString(),
  };
}

module.exports = eventData;
