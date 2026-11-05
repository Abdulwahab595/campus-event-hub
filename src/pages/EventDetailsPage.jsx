import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router'
import { registerForEvent } from '../store/registrationsSlice'
import './EventsPage.css'

function EventDetailsPage() {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.currentUser)
  const event = useSelector((state) => state.events.items.find((item) => item.id === eventId))
  const isRegistered = useSelector((state) => state.registrations.items.some(
    (item) => item.eventId === eventId && item.studentId === user?.id,
  ))

  function handleRegister() {
    if (!event || !user || user.role !== 'student' || !user.isVerified) return
    dispatch(registerForEvent({ eventId: event.id, studentId: user.id }))
  }

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

      {!user ? (
        <p><Link to="/login">Log in</Link> with a Student account to register for this event.</p>
      ) : user.role !== 'student' ? (
        <p>Event registration is available to Student accounts.</p>
      ) : !user.isVerified ? (
        <p><Link to="/verify-email">Verify your email</Link> before registering for an event.</p>
      ) : (
        <div className="event-registration">
          <button type="button" onClick={handleRegister} disabled={isRegistered}>
            {isRegistered ? 'Already registered' : 'Register for event'}
          </button>
          {isRegistered && (
            <p role="status">
              You are registered for this event. <Link to="/my-registrations">View My Registrations</Link>
            </p>
          )}
        </div>
      )}

      <Link to="/">Back to events</Link>
    </section>
  )
}

export default EventDetailsPage
