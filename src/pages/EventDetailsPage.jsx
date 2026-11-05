import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router'

function EventDetailsPage() {
  const { eventId } = useParams()
  const event = useSelector((state) => state.events.items.find((item) => item.id === eventId))

  if (!event) {
    return (
      <section className="page-panel">
        <h1>Event not found</h1>
        <p>This event is unavailable or has been removed.</p>
        <Link to="/">Back to events</Link>
      </section>
    )
  }

  const eventDate = new Date(event.date).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
    timeZone: 'Asia/Karachi',
  })

  return (
    <section className="page-panel">
      <h1>{event.title}</h1>
      <p><strong>Category:</strong> {event.category}</p>
      <p>{event.description}</p>
      <p>
        <strong>Date and time:</strong>{' '}
        <time dateTime={event.date}>{eventDate} PKT</time>
      </p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <Link to="/">Back to events</Link>
    </section>
  )
}

export default EventDetailsPage
