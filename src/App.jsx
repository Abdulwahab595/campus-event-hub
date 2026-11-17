import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Route, Routes } from 'react-router'
import { apiRequest, TOKEN_KEY } from './api'
import { setCurrentUser } from './store/authSlice'
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

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return

    let active = true

    async function restoreSession() {
      try {
        const { user } = await apiRequest('/api/auth/me', { token })
        if (active) dispatch(setCurrentUser(user))
      } catch (error) {
        if (active && (error.status === 401 || error.status === 403)) {
          localStorage.removeItem(TOKEN_KEY)
        }
      } finally {
        if (active) setRestoringSession(false)
      }
    }

    restoreSession()
    return () => { active = false }
  }, [dispatch])

  if (restoringSession) {
    return <main className="page-content"><p role="status">Checking your login…</p></main>
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
