import { useSelector } from 'react-redux'
import EventCard from '../components/EventCard'
import './EventsPage.css'

function EventsPage() {
  const events = useSelector((state) => state.events.items)

  return (
    <section className="page-panel">
      <h1>Campus Events</h1>
      <p>Explore workshops, seminars and activities at your university.</p>
      <h2>Upcoming events</h2>
      {events.length === 0 ? (
        <p>No events available yet.</p>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}

export default EventsPage
