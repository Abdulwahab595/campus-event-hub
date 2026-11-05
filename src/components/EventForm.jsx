import { useState } from 'react'
import { Link } from 'react-router'

function EventForm({ event }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    category: event?.category || 'Workshop',
    // The sample events store their date and time in PKT (+05:00).
    date: event?.date ? event.date.slice(0, 16) : '',
    venue: event?.venue || '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function handleChange(changeEvent) {
    setForm({ ...form, [changeEvent.target.name]: changeEvent.target.value })
    setError('')
    setMessage('')
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault()

    if (!form.title.trim() || !form.description.trim() || !form.venue.trim()) {
      setError('Enter a title, description and venue using more than spaces.')
      setMessage('')
      return
    }

    setError('')
    setMessage('Form checked. This preview has not changed the event list.')
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <label htmlFor="event-title">
        Event title
        <input id="event-title" name="title" type="text" value={form.title} onChange={handleChange} required />
      </label>

      <label htmlFor="event-description">
        Description
        <textarea id="event-description" name="description" rows={4} value={form.description} onChange={handleChange} required />
      </label>

      <label htmlFor="event-category">
        Category
        <select id="event-category" name="category" value={form.category} onChange={handleChange} required>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label htmlFor="event-date">
        Date and time (PKT)
        <input id="event-date" name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
      </label>

      <label htmlFor="event-venue">
        Venue
        <input id="event-venue" name="venue" type="text" value={form.venue} onChange={handleChange} required />
      </label>

      {error && <p className="event-form-error" role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <div className="event-form-actions">
        <button type="submit">Check form</button>
        <Link to="/organizer">Cancel</Link>
      </div>
    </form>
  )
}

export default EventForm
