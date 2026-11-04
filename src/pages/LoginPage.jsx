import { useState } from 'react'
import { Link } from 'react-router'
import './Auth.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    // Checking credentials and setting the logged-in user come in the next task.
    setMessage('Form checked. Account login will be connected next.')
  }

  return (
    <section className="page-panel auth-panel">
      <h1>Log in</h1>
      <p>Access your Campus Event Hub account.</p>

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
              setMessage('')
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
              setMessage('')
            }}
            required
          />
        </label>

        {message && <p className="form-message" role="status">{message}</p>}

        <button type="submit">Log in</button>
      </form>

      <p className="auth-links">Need an account? <Link to="/register">Register</Link></p>
    </section>
  )
}

export default LoginPage
