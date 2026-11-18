import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router'
import { apiRequest, TOKEN_KEY } from '../api'
import { saveEvent } from '../store/eventsSlice'
import { setRegistrations, saveRegistration } from '../store/registrationsSlice'
import './EventsPage.css'

function EventDetailsPage() {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.currentUser)
  const event = useSelector((state) => state.events.items.find((item) => item.id === eventId))
  const isRegistered = useSelector((state) => state.registrations.items.some(
    (item) => item.eventId === eventId && item.studentId === user?.id,
  ))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registrationError, setRegistrationError] = useState('')
  const [registrationLoaded, setRegistrationLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const studentId = user?.role === 'student' && user.isVerified ? user.id : ''

  useEffect(() => {
    let active = true
    async function loadEvent() {
      setLoading(true)
      setError('')
      try {
        const { event } = await apiRequest(`/api/events/${eventId}`)
        if (active) dispatch(saveEvent(event))
      } catch (error) {
        if (active) setError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadEvent()
    return () => { active = false }
  }, [dispatch, eventId, refresh])

  useEffect(() => {
    if (!studentId) return
    let active = true
    async function loadRegistrations() {
      setRegistrationLoaded(false)
      setRegistrationError('')
      try {
        const { registrations } = await apiRequest('/api/registrations/me', { token: localStorage.getItem(TOKEN_KEY) })
        if (active) {
          dispatch(setRegistrations(registrations))
          setRegistrationLoaded(true)
        }
      } catch (error) {
        if (active) setRegistrationError(error.message)
      }
    }
    loadRegistrations()
    return () => { active = false }
  }, [dispatch, studentId, refresh])

  async function handleRegister() {
    if (!event || !studentId || submitting || isRegistered || !registrationLoaded) return
    setSubmitting(true)
    setRegistrationError('')
    const token = localStorage.getItem(TOKEN_KEY)
    try {
      const { registration } = await apiRequest(`/api/events/${eventId}/registrations`, { method: 'POST', token })
      dispatch(saveRegistration({ ...registration, event }))
    } catch (error) {
      if (error.status === 409) {
        // Another tab may already have registered this student.
        setRefresh(refresh + 1)
      }
      setRegistrationError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <section className="page-panel"><p role="status">Loading event...</p></section>
  if (error || !event) {
    return (
      <section className="page-panel">
        <h1>Event unavailable</h1>
        <p role="alert">{error || 'This event is unavailable or has been removed.'}</p>
        <button type="button" onClick={() => setRefresh(refresh + 1)}>Try again</button>
        <p><Link to="/">Back to events</Link></p>
      </section>
    )
  }

  const eventDate = new Date(event.date).toLocaleString('en-GB', {
    dateStyle: 'medium', timeStyle: 'short', hour12: true, timeZone: 'Asia/Karachi',
  })
  const hasStarted = new Date(event.date).getTime() <= Date.now()

  return (
    <section className="page-panel">
      <h1>{event.title}</h1>
      <p><strong>Category:</strong> {event.category}</p>
      <p>{event.description}</p>
      <p><strong>Date and time:</strong> <time dateTime={event.date}>{eventDate} PKT</time></p>
      <p><strong>Venue:</strong> {event.venue}</p>

      {!user ? (
        <p><Link to="/login">Log in</Link> with a Student account to register for this event.</p>
      ) : user.role !== 'student' ? (
        <p>Event registration is available to Student accounts.</p>
      ) : !user.isVerified ? (
        <p><Link to="/verify-email">Verify your email</Link> before registering for an event.</p>
      ) : (
        <div className="event-registration">
          {registrationError && (
            <div>
              <p className="form-error" role="alert">{registrationError}</p>
              <button type="button" onClick={() => setRefresh(refresh + 1)}>Try again</button>
            </div>
          )}
          {!registrationLoaded && !registrationError && <p role="status">Checking your registration...</p>}
          <button type="button" onClick={handleRegister} disabled={!registrationLoaded || submitting || isRegistered || hasStarted}>
            {submitting ? 'Registering...' : isRegistered ? 'Already registered' : hasStarted ? 'Registration closed' : 'Register for event'}
          </button>
          {isRegistered && <p role="status">You are registered for this event. <Link to="/my-registrations">View My Registrations</Link></p>}
        </div>
      )}
      <Link to="/">Back to events</Link>
    </section>
  )
}

export default EventDetailsPage
