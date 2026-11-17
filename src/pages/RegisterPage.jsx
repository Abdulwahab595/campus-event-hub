import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router'
import { apiRequest } from '../api'
import './Auth.css'

function RegisterPage() {
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.currentUser)
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const email = form.email.trim().toLowerCase()
    setError('')
    setSubmitting(true)
    try {
      await apiRequest('/api/auth/register', {
        method: 'POST',
        data: { name: form.name.trim(), email, role: form.role, password: form.password },
      })
      navigate('/verify-email', { state: { email } })
    } catch (error) {
      if (error.status === 503) {
        navigate('/verify-email', { state: { email, error: error.message } })
      } else {
        setError(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (currentUser) return <Navigate to="/" replace />

  return (
    <section className="page-panel auth-panel">
      <h1>Register</h1>
      <p>Create a student or organizer account.</p>
      <p>Use an email address where you can receive your verification code.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="register-name">
          Full name
          <input
            id="register-name"
            name="name"
            type="text"
            maxLength={100}
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="register-email">
          Email address
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="register-role">
          Account type
          <select
            id="register-role"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
          </select>
        </label>

        <label htmlFor="register-password">
          Password
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            maxLength={128}
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="register-confirm-password">
          Confirm password
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            maxLength={128}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>{submitting ? 'Registering…' : 'Register'}</button>
      </form>

      <p className="auth-links">Already have an account? <Link to="/login">Log in</Link></p>
      <p>Have a verification code? <Link to="/verify-email" state={{ email: form.email }}>Verify your email</Link></p>
    </section>
  )
}

export default RegisterPage
