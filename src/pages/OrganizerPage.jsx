import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import './Organizer.css'

function OrganizerPage() {
  const user = useSelector((state) => state.auth.currentUser)
  const events = useSelector((state) => state.events.items)

  if (!user || user.role !== 'organizer') {
    return (
      <section className="page-panel">
        <h1>Organizer Dashboard</h1>
        <p>Log in with an Organizer account to open this page.</p>
        <Link to="/login">Go to login</Link>
      </section>
    )
  }

  return (
    <section className="page-panel">
      <h1>Organizer Dashboard</h1>
      <p>Welcome, {user.name}.</p>
      <p>Preview the event forms using the sample events below. Changes are not saved yet.</p>
      <Link to="/organizer/events/new">Create event</Link>

      <h2>Sample events</h2>
      {events.length === 0 ? (
        <p>No events available yet.</p>
      ) : (
        <ul className="organizer-events">
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.category} | {event.venue}</p>
              <p>
                <strong>Date and time:</strong>{' '}
                <time dateTime={event.date}>
                  {new Date(event.date).toLocaleString('en-GB', {
                    dateStyle: 'medium', timeStyle: 'short', hour12: true, timeZone: 'Asia/Karachi',
                  })} PKT
                </time>
              </p>
              <Link to={`/organizer/events/${event.id}/edit`}>Preview edit form</Link>
              {' | '}
              <Link to={`/events/${event.id}`}>View details</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default OrganizerPage
