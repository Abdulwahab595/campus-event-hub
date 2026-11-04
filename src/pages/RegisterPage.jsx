import { useState } from 'react'
import { Link } from 'react-router'
import './Auth.css'

function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // This task adds the form. Account creation is connected in the next task.
    setError('')
    setMessage('Form checked. Account creation will be connected next.')
  }

  return (
    <section className="page-panel auth-panel">
      <h1>Register</h1>
      <p>Create a student or organizer account.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="register-name">
          Full name
          <input
            id="register-name"
            name="name"
            type="text"
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
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-message" role="status">{message}</p>}

        <button type="submit">Register</button>
      </form>

      <p className="auth-links">Already have an account? <Link to="/login">Log in</Link></p>
      <p>Have a verification code? <Link to="/verify-email">Verify your email</Link></p>
    </section>
  )
}

export default RegisterPage
