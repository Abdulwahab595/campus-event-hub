import { Link, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import OrganizerPage from './pages/OrganizerPage'
import OrganizerEventFormPage from './pages/OrganizerEventFormPage'
import PlaceholderPage from './pages/PlaceholderPage'
import './App.css'

function App() {
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
          <Route
            path="/my-registrations"
            element={
              <PlaceholderPage title="My Registrations">
                <p>Events you register for will appear here.</p>
              </PlaceholderPage>
            }
          />
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
