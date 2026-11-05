import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { loginUser, setPendingEmail } from '../store/authSlice'
import './Auth.css'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const users = useSelector((state) => state.auth.users)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    const user = users.find((user) => user.email === normalizedEmail)

    if (!user || user.password !== password) {
      setError('Email or password is incorrect.')
      setNeedsVerification(false)
      return
    }

    if (!user.isVerified) {
      dispatch(setPendingEmail(user.email))
      setError('Verify your email before logging in.')
      setNeedsVerification(true)
      return
    }

    dispatch(loginUser({ email: normalizedEmail, password }))
    navigate('/')
  }

  return (
    <section className="page-panel auth-panel">
      <h1>Log in</h1>
      <p>Access your Campus Event Hub account.</p>
      <p className="demo-note">Use an account created in this demo. Accounts reset when the page is reloaded.</p>

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
        {needsVerification && <Link to="/verify-email">Verify your email</Link>}

        <button type="submit">Log in</button>
      </form>

      <p className="auth-links">Need an account? <Link to="/register">Register</Link></p>
    </section>
  )
}

export default LoginPage
