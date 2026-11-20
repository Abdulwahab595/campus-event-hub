import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Route, Routes } from 'react-router'
import { apiRequest, TOKEN_KEY } from './api'
import { setCurrentUser, logoutUser } from './store/authSlice'
import { setRegistrations } from './store/registrationsSlice'
import Navbar from './components/Navbar'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import MyRegistrationsPage from './pages/MyRegistrationsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import OrganizerPage from './pages/OrganizerPage'
import OrganizerEventFormPage from './pages/OrganizerEventFormPage'
import PlaceholderPage from './pages/PlaceholderPage'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const [restoringSession, setRestoringSession] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  const [sessionError, setSessionError] = useState('')
  const [restoreAttempt, setRestoreAttempt] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setSessionError('')
      setRestoringSession(false)
      return
    }

    let active = true

    async function restoreSession() {
      setRestoringSession(true)
      setSessionError('')
      try {
        const { user } = await apiRequest('/api/auth/me', { token })
        if (active) dispatch(setCurrentUser(user))
      } catch (error) {
        if (active) {
          if (error.status === 401 || error.status === 403) {
            localStorage.removeItem(TOKEN_KEY)
            dispatch(setRegistrations([]))
            dispatch(logoutUser(error.message))
          } else {
            setSessionError(error.message)
          }
        }
      } finally {
        if (active) setRestoringSession(false)
      }
    }

    restoreSession()
    return () => { active = false }
  }, [dispatch, restoreAttempt])

  if (restoringSession) {
    return <main className="page-content"><p role="status">Checking your login…</p></main>
  }

  if (sessionError) {
    return (
      <main className="page-content">
        <section className="page-panel">
          <h1>Could not check your login</h1>
          <p role="alert">{sessionError}</p>
          <button type="button" onClick={() => setRestoreAttempt(restoreAttempt + 1)}>Try again</button>
        </section>
      </main>
    )
  }

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="/organizer" element={<OrganizerPage />} />
          <Route path="/organizer/events/new" element={<OrganizerEventFormPage />} />
          <Route path="/organizer/events/:eventId/edit" element={<OrganizerEventFormPage />} />
          <Route
            path="*"
            element={
              <PlaceholderPage title="Page not found">
                <p>The page you requested could not be found.</p>
                <Link to="/">Back to events</Link>
              </PlaceholderPage>
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default App
