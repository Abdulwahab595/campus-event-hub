import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { apiRequest, TOKEN_KEY } from '../api'
import EventForm from '../components/EventForm'
import { saveEvent } from '../store/eventsSlice'
import './Organizer.css'

function OrganizerEventFormPage() {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.currentUser)
  const event = useSelector((state) => state.events.items.find((item) => item.id === eventId))
  const [loading, setLoading] = useState(Boolean(eventId))
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const organizerId = user?.role === 'organizer' && user.isVerified ? user.id : ''

  useEffect(() => {
    if (!eventId || !organizerId) return
    let active = true
    async function loadEvent() {
      setLoading(true)
      setLoadError('')
      try {
        const { event } = await apiRequest(`/api/events/${eventId}`)
        if (active) dispatch(saveEvent(event))
      } catch (error) {
        if (active) setLoadError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadEvent()
    return () => { active = false }
  }, [dispatch, eventId, organizerId, refresh])

  async function handleSave(values) {
    if (!organizerId || saving || (eventId && event?.organizerId !== organizerId)) return
    setSaving(true)
    setError('')
    try {
      const { event: saved } = await apiRequest(eventId ? `/api/events/${eventId}` : '/api/events', {
        method: eventId ? 'PUT' : 'POST', data: values, token: localStorage.getItem(TOKEN_KEY),
      })
      dispatch(saveEvent(saved))
      navigate('/organizer')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) return <Navigate to="/login" replace />
  if (!organizerId) {
    return <section className="page-panel"><h1>Organizer account required</h1><p>A verified Organizer account is required to manage events.</p><Link to="/">Back to events</Link></section>
  }
  if (eventId && loading) return <section className="page-panel"><p role="status">Loading event...</p></section>
  if (eventId && (loadError || !event)) {
    return (
      <section className="page-panel">
        <h1>Event unavailable</h1>
        <p role="alert">{loadError || 'This event is unavailable or has been removed.'}</p>
        <button type="button" onClick={() => setRefresh(refresh + 1)}>Try again</button>
        <p><Link to="/organizer">Back to dashboard</Link></p>
      </section>
    )
  }
  if (event && event.organizerId !== organizerId) {
    return <section className="page-panel"><h1>Access denied</h1><p>You can only edit events that you created.</p><Link to="/organizer">Back to dashboard</Link></section>
  }

  return (
    <section className="page-panel">
      <h1>{eventId ? 'Edit event' : 'Create event'}</h1>
      <p>Enter the event information below.</p>
      {error && <p className="event-form-error" role="alert">{error}</p>}
      <EventForm key={eventId || 'new'} event={event} onSave={handleSave} saving={saving} />
    </section>
  )
}

export default OrganizerEventFormPage
