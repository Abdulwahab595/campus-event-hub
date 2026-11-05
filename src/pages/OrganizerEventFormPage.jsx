import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router'
import EventForm from '../components/EventForm'
import './Organizer.css'

function OrganizerEventFormPage() {
  const { eventId } = useParams()
  const user = useSelector((state) => state.auth.currentUser)
  const event = useSelector((state) => state.events.items.find((item) => item.id === eventId))

  if (!user || user.role !== 'organizer') {
    return (
      <section className="page-panel">
        <h1>Organizer account required</h1>
        <p>Log in with an Organizer account to open the event form.</p>
        <Link to="/login">Go to login</Link>
      </section>
    )
  }

  if (eventId && !event) {
    return (
      <section className="page-panel">
        <h1>Event not found</h1>
        <p>This sample event is unavailable.</p>
        <Link to="/organizer">Back to dashboard</Link>
      </section>
    )
  }

  return (
    <section className="page-panel">
      <h1>{eventId ? 'Edit event' : 'Create event'}</h1>
      <p>Form preview only. Events are not saved yet.</p>
      <EventForm key={eventId || 'new'} event={event} />
    </section>
  )
}

export default OrganizerEventFormPage
