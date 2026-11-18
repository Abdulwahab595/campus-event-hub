import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router'
import { apiRequest, TOKEN_KEY } from '../api'
import { setEvents, deleteEvent } from '../store/eventsSlice'
import './Organizer.css'

function OrganizerPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.currentUser)
  const events = useSelector((state) => state.events.items)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [pendingDelete, setPendingDelete] = useState('')
  const [deleting, setDeleting] = useState('')
  const [message, setMessage] = useState('')
  const [refresh, setRefresh] = useState(0)
  const organizerId = user?.role === 'organizer' && user.isVerified ? user.id : ''

  useEffect(() => {
    if (!organizerId) return
    let active = true
    async function loadEvents() {
      setLoading(true)
      setError('')
      try {
        const { events } = await apiRequest(`/api/events?organizerId=${organizerId}`)
        if (active) dispatch(setEvents(events))
      } catch (error) {
        if (active) setError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadEvents()
    return () => { active = false }
  }, [dispatch, organizerId, refresh])

  async function handleDelete(event) {
    if (!organizerId || event.organizerId !== organizerId || deleting) return
    setDeleting(event.id)
    setActionError('')
    try {
      await apiRequest(`/api/events/${event.id}`, { method: 'DELETE', token: localStorage.getItem(TOKEN_KEY) })
      dispatch(deleteEvent(event.id))
      setPendingDelete('')
      setMessage('Event deleted.')
    } catch (error) {
      setActionError(error.message)
    } finally {
      setDeleting('')
    }
  }

  if (!user) return <Navigate to="/login" replace />
  if (!organizerId) {
    return <section className="page-panel"><h1>Organizer account required</h1><p>A verified Organizer account is required to manage events.</p><Link to="/">Back to events</Link></section>
  }
  const myEvents = events.filter((event) => event.organizerId === organizerId)

  return (
    <section className="page-panel">
      <h1>Organizer Dashboard</h1>
      <p>Welcome, {user.name}.</p>
      <p>Create and manage your campus events.</p>
      <Link to="/organizer/events/new">Create event</Link>
      {message && <p role="status">{message}</p>}
      {actionError && <p className="form-error" role="alert">{actionError}</p>}
      <h2>My events</h2>
      {loading ? <p role="status">Loading your events...</p> : error ? (
        <div>
          <p className="form-error" role="alert">{error}</p>
          <button type="button" onClick={() => setRefresh(refresh + 1)}>Try again</button>
        </div>
      ) : myEvents.length === 0 ? <p>You have not created any events yet.</p> : (
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
                <button type="button" disabled={Boolean(deleting)} onClick={() => {
                  setPendingDelete(event.id)
                  setMessage('')
                  setActionError('')
                }}>Delete</button>
              </div>
              {pendingDelete === event.id && (
                <div className="delete-confirmation">
                  <p>Delete this event? Its student registrations will also be removed.</p>
                  <div className="organizer-actions">
                    <button type="button" disabled={Boolean(deleting)} onClick={() => handleDelete(event)}>{deleting === event.id ? 'Deleting...' : 'Confirm delete'}</button>
                    <button type="button" disabled={Boolean(deleting)} onClick={() => setPendingDelete('')}>Cancel delete</button>
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
