import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router'
import EventCard from '../components/EventCard'
import './EventsPage.css'

function MyRegistrationsPage() {
  const user = useSelector((state) => state.auth.currentUser)
  const registrations = useSelector((state) => state.registrations.items)
  const events = useSelector((state) => state.events.items)

  if (!user) return <Navigate to="/login" replace />

  if (user.role !== 'student' || !user.isVerified) {
    return (
      <section className="page-panel">
        <h1>Student account required</h1>
        <p>A verified Student account is required to view registered events.</p>
        <Link to="/">Back to events</Link>
      </section>
    )
  }

  const eventIds = registrations
    .filter((item) => item.studentId === user.id)
    .map((item) => item.eventId)
  const registeredEvents = events.filter((event) => eventIds.includes(event.id))

  return (
    <section className="page-panel">
      <h1>My Registrations</h1>
      <p>Events you have registered for.</p>

      {registeredEvents.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        <div className="event-list">
          {registeredEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}

      <p><Link to="/">Browse events</Link></p>
    </section>
  )
}

export default MyRegistrationsPage
