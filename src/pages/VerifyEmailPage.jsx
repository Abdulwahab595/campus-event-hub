import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router'
import { apiRequest } from '../api'
import './Auth.css'

function VerifyEmailPage() {
  const { state } = useLocation()
  const currentUser = useSelector((state) => state.auth.currentUser)
  const [email, setEmail] = useState(state?.email || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState(state?.error || '')
  const [message, setMessage] = useState('')
  const [verified, setVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    setError('')
    setMessage('')
    if (!email.trim()) {
      setError('Enter the email address you registered with.')
      return
    }
    if (!/^[0-9]{6}$/.test(code)) {
      setError('Please enter exactly six digits.')
      return
    }

    setSubmitting(true)
    try {
      await apiRequest('/api/auth/verify-email', { method: 'POST', data: { email, code } })
      setVerified(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (submitting) return
    setError('')
    setMessage('')
    if (!email.trim()) {
      setError('Enter the email address you registered with.')
      return
    }

    setSubmitting(true)
    try {
      const result = await apiRequest('/api/auth/resend-code', { method: 'POST', data: { email } })
      setCode('')
      setMessage(result.message)
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (currentUser) return <Navigate to="/" replace />

  if (verified) {
    return (
      <section className="page-panel auth-panel">
        <h1>Email verified</h1>
        <p role="status">Your account is verified. You can now log in.</p>
        <Link to="/login">Continue to login</Link>
      </section>
    )
  }

  return (
    <section className="page-panel auth-panel">
      <h1>Verify your email</h1>
      <p>Enter the six-digit code sent to your email. Check Spam if it is not in your inbox.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="verification-email">
          Email address
          <input
            id="verification-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setCode('')
              setError('')
              setMessage('')
            }}
            required
          />
        </label>

        <label htmlFor="verification-code">
          Six-digit code
          <input
            id="verification-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            value={code}
            onChange={(event) => {
              setCode(event.target.value)
              setError('')
              setMessage('')
            }}
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-message" role="status">{message}</p>}

        <div className="auth-actions">
          <button type="submit" disabled={submitting}>Verify email</button>
          <button type="button" disabled={submitting} onClick={handleResend}>Resend code</button>
        </div>
      </form>

      <p className="auth-links"><Link to="/login">Back to login</Link></p>
    </section>
  )
}

export default VerifyEmailPage
