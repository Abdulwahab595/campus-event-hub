import { useSelector } from 'react-redux'

function EventsPage() {
  const events = useSelector((state) => state.events.items)

  return (
    <section className="page-panel">
      <h1>Campus Events</h1>
      <p>Explore workshops, seminars and activities at your university.</p>
      <h2>Upcoming events</h2>
      <p>
        {events.length === 0
          ? 'No events available yet.'
          : events.length + ' events available.'}
      </p>
    </section>
  )
}

export default EventsPage
