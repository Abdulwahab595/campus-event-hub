import { nanoid } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import EventForm from '../components/EventForm'
import { createEvent, updateEvent } from '../store/eventsSlice'
import './Organizer.css'

function OrganizerEventFormPage() {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.currentUser)
  const event = useSelector((state) => state.events.items.find((item) => item.id === eventId))

  function handleSave(values) {
    if (!user || user.role !== 'organizer' || !user.isVerified) return

    if (eventId) {
      if (!event || event.organizerId !== user.id) return
      dispatch(updateEvent({ ...values, id: event.id, organizerId: user.id }))
    } else {
      dispatch(createEvent({ ...values, id: nanoid(), organizerId: user.id }))
    }

    navigate('/organizer')
  }

  if (!user) return <Navigate to="/login" replace />

  if (user.role !== 'organizer' || !user.isVerified) {
    return (
      <section className="page-panel">
        <h1>Organizer account required</h1>
        <p>A verified Organizer account is required to manage events.</p>
        <Link to="/">Back to events</Link>
      </section>
    )
  }

  if (eventId && !event) {
    return (
      <section className="page-panel">
        <h1>Event not found</h1>
        <p>This event is unavailable or has been removed.</p>
        <Link to="/organizer">Back to dashboard</Link>
      </section>
    )
  }

  if (event && event.organizerId !== user.id) {
    return (
      <section className="page-panel">
        <h1>Access denied</h1>
        <p>You can only edit events that you created.</p>
        <Link to="/organizer">Back to dashboard</Link>
      </section>
    )
  }

  return (
    <section className="page-panel">
      <h1>{eventId ? 'Edit event' : 'Create event'}</h1>
      <p>Enter the event information below.</p>
      <EventForm key={eventId || 'new'} event={event} onSave={handleSave} />
    </section>
  )
}

export default OrganizerEventFormPage
