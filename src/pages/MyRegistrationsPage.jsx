import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router'
import { apiRequest, TOKEN_KEY } from '../api'
import { setRegistrations, removeRegistration } from '../store/registrationsSlice'
import EventCard from '../components/EventCard'
import './EventsPage.css'

function MyRegistrationsPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.currentUser)
  const registrations = useSelector((state) => state.registrations.items)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [message, setMessage] = useState('')
  const [cancelling, setCancelling] = useState('')
  const [refresh, setRefresh] = useState(0)
  const studentId = user?.role === 'student' && user.isVerified ? user.id : ''

  useEffect(() => {
    if (!studentId) return
    let active = true
    async function loadRegistrations() {
      setLoading(true)
      setError('')
      try {
        const { registrations } = await apiRequest('/api/registrations/me', { token: localStorage.getItem(TOKEN_KEY) })
        if (active) dispatch(setRegistrations(registrations))
      } catch (error) {
        if (active) setError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadRegistrations()
    return () => { active = false }
  }, [dispatch, studentId, refresh])

  async function handleCancel(eventId) {
    if (!studentId || cancelling) return
    setCancelling(eventId)
    setActionError('')
    setMessage('')
    try {
      await apiRequest(`/api/events/${eventId}/registrations`, { method: 'DELETE', token: localStorage.getItem(TOKEN_KEY) })
      dispatch(removeRegistration(eventId))
      setMessage('Your registration has been cancelled.')
    } catch (error) {
      setActionError(error.message)
      if (error.status === 404) setRefresh(refresh + 1)
    } finally {
      setCancelling('')
    }
  }

  if (!user) return <Navigate to="/login" replace />
  if (!studentId) {
    return <section className="page-panel"><h1>Student account required</h1><p>A verified Student account is required to view registered events.</p><Link to="/">Back to events</Link></section>
  }
  const myRegistrations = registrations.filter((item) => item.studentId === studentId)

  return (
    <section className="page-panel">
      <h1>My Registrations</h1>
      <p>Events you have registered for.</p>
      {message && <p role="status">{message}</p>}
      {actionError && <p className="form-error" role="alert">{actionError}</p>}
      {loading ? <p role="status">Loading your registrations...</p> : error ? (
        <div>
          <p className="form-error" role="alert">{error}</p>
          <button type="button" onClick={() => setRefresh(refresh + 1)}>Try again</button>
        </div>
      ) : myRegistrations.length === 0 ? <p>You have not registered for any events yet.</p> : (
        <div className="event-list">
          {myRegistrations.map((item) => (
            <div key={item.id}>
              <EventCard event={item.event} />
              <div className="event-registration">
                <button type="button" disabled={Boolean(cancelling)} onClick={() => handleCancel(item.eventId)}>
                  {cancelling === item.eventId ? 'Cancelling...' : 'Cancel registration'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p><Link to="/">Browse events</Link></p>
    </section>
  )
}

export default MyRegistrationsPage
