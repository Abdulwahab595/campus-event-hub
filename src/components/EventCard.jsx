function EventCard({ event }) {
  const eventDate = new Date(event.date).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
    timeZone: 'Asia/Karachi',
  })

  return (
    <article className="event-card">
      <h3>{event.title}</h3>
      <p className="event-category">{event.category}</p>
      <p>{event.description}</p>
      <p>
        <strong>Date and time:</strong>{' '}
        <time dateTime={event.date}>{eventDate} PKT</time>
      </p>
      <p><strong>Venue:</strong> {event.venue}</p>
    </article>
  )
}

export default EventCard
