import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router'
import { apiRequest, TOKEN_KEY } from '../api'
import { setCurrentUser } from '../store/authSlice'
import './Auth.css'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.currentUser)
  const sessionMessage = useSelector((state) => state.auth.sessionMessage)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    const normalizedEmail = email.trim().toLowerCase()
    setError('')
    setNeedsVerification(false)
    setSubmitting(true)
    try {
      const { token, user } = await apiRequest('/api/auth/login', {
        method: 'POST',
        data: { email: normalizedEmail, password },
      })
      localStorage.setItem(TOKEN_KEY, token)
      dispatch(setCurrentUser(user))
      navigate('/', { replace: true })
    } catch (error) {
      setError(error.message)
      setNeedsVerification(error.code === 'EMAIL_NOT_VERIFIED')
    } finally {
      setSubmitting(false)
    }
  }

  if (currentUser) return <Navigate to="/" replace />

  return (
    <section className="page-panel auth-panel login-panel">
      <h1>Log in</h1>
      <p>Access your Campus Event Hub account.</p>
      <p className="demo-note">Verify your email before logging in.</p>
      {sessionMessage && !error && <p className="form-error" role="alert">{sessionMessage}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">
          Email address
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
              setNeedsVerification(false)
            }}
            required
          />
        </label>

        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
              setNeedsVerification(false)
            }}
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        {needsVerification && <Link to="/verify-email" state={{ email }}>Verify your email</Link>}

        <button type="submit" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</button>
      </form>

      <p className="auth-links">Need an account? <Link to="/register">Register</Link></p>
    </section>
  )
}

export default LoginPage
