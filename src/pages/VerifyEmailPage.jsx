import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router'
import { createDemoCode, resendVerificationCode, verifyEmail } from '../store/authSlice'
import './Auth.css'

function VerifyEmailPage() {
  const dispatch = useDispatch()
  const { users, pendingEmail, currentUser } = useSelector((state) => state.auth)
  const account = users.find((user) => user.email === pendingEmail)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!/^[0-9]{6}$/.test(code)) {
      setError('Please enter exactly six digits.')
      setMessage('')
      return
    }

    if (code !== account.verificationCode) {
      setError('Incorrect verification code. Please try again.')
      setMessage('')
      return
    }

    dispatch(verifyEmail({ email: account.email, code }))
  }

  function handleResend() {
    let newCode = createDemoCode()
    while (newCode === account.verificationCode) {
      newCode = createDemoCode()
    }

    dispatch(resendVerificationCode({ email: account.email, code: newCode }))
    setCode('')
    setError('')
    setMessage('A new demo code is ready.')
  }

  if (currentUser) return <Navigate to="/" replace />

  if (!account) {
    return (
      <section className="page-panel auth-panel">
        <h1>Verify your email</h1>
        <p>Register a demo account first, or try logging in to an unverified account.</p>
        <Link to="/register">Register</Link>
        {' | '}
        <Link to="/login">Log in</Link>
      </section>
    )
  }

  if (account.isVerified) {
    return (
      <section className="page-panel auth-panel">
        <h1>Email verified</h1>
        <p role="status">Your demo account is verified. You can now log in.</p>
        <Link to="/login">Continue to login</Link>
      </section>
    )
  }

  return (
    <section className="page-panel auth-panel">
      <h1>Verify your email</h1>
      <p>Verify the demo account for <strong>{account.email}</strong>.</p>
      <p className="demo-note">
        No email is sent in this frontend demo. Your code is <strong>{account.verificationCode}</strong>.
      </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
          <button type="submit">Verify email</button>
          <button type="button" onClick={handleResend}>Resend code</button>
        </div>
      </form>

      <p className="auth-links"><Link to="/login">Back to login</Link></p>
    </section>
  )
}

export default VerifyEmailPage
