import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { deleteEvent } from '../store/eventsSlice'
import { removeRegistrationsForEvent } from '../store/registrationsSlice'
import './Organizer.css'

function OrganizerPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.currentUser)
  const events = useSelector((state) => state.events.items)
  const [pendingDelete, setPendingDelete] = useState('')
  const [message, setMessage] = useState('')

  function handleDelete(event) {
    if (!user || user.role !== 'organizer' || !user.isVerified || event.organizerId !== user.id) return
    dispatch(deleteEvent({ id: event.id, organizerId: user.id }))
    dispatch(removeRegistrationsForEvent(event.id))
    setPendingDelete('')
    setMessage('Event deleted.')
  }

  if (!user || user.role !== 'organizer' || !user.isVerified) {
    return (
      <section className="page-panel">
        <h1>Organizer Dashboard</h1>
        <p>Log in with an Organizer account to open this page.</p>
        <Link to="/login">Go to login</Link>
      </section>
    )
  }

  const myEvents = events.filter((event) => event.organizerId === user.id)

  return (
    <section className="page-panel">
      <h1>Organizer Dashboard</h1>
      <p>Welcome, {user.name}.</p>
      <p>Create and manage your campus events.</p>
      <Link to="/organizer/events/new">Create event</Link>
      {message && <p role="status">{message}</p>}

      <h2>My events</h2>
      {myEvents.length === 0 ? (
        <p>You have not created any events yet.</p>
      ) : (
        <ul className="organizer-events">
          {myEvents.map((event) => (
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
              <div className="organizer-actions">
                <Link to={`/organizer/events/${event.id}/edit`}>Edit event</Link>
                <Link to={`/events/${event.id}`}>View details</Link>
                <button type="button" onClick={() => {
                  setPendingDelete(event.id)
                  setMessage('')
                }}>Delete</button>
              </div>
              {pendingDelete === event.id && (
                <div className="delete-confirmation">
                  <p>Delete this event? Its student registrations will also be removed.</p>
                  <div className="organizer-actions">
                    <button type="button" onClick={() => handleDelete(event)}>Confirm delete</button>
                    <button type="button" onClick={() => setPendingDelete('')}>Cancel delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default OrganizerPage
