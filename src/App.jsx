import { Link, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import EventsPage from './pages/EventsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PlaceholderPage from './pages/PlaceholderPage'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/verify-email"
            element={
              <PlaceholderPage title="Verify your email">
                <p>Email verification is required before using your account.</p>
              </PlaceholderPage>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <PlaceholderPage title="My Registrations">
                <p>Events you register for will appear here.</p>
              </PlaceholderPage>
            }
          />
          <Route
            path="/organizer"
            element={
              <PlaceholderPage title="Organizer Dashboard">
                <p>Create and manage your campus events.</p>
              </PlaceholderPage>
            }
          />
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
