import { useState } from 'react'
import { Link } from 'react-router'

function EventForm({ event, onSave, saving = false }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    category: event?.category || 'Workshop',
    // The API returns UTC. Add five hours to show the same time in PKT.
    date: event?.date ? new Date(new Date(event.date).getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 16) : '',
    venue: event?.venue || '',
  })
  const [error, setError] = useState('')

  function handleChange(changeEvent) {
    setForm({ ...form, [changeEvent.target.name]: changeEvent.target.value })
    setError('')
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault()
    if (saving) return

    if (!form.title.trim()) {
      setError('Please enter an event title.')
      return
    }

    if (!form.description.trim()) {
      setError('Please enter an event description.')
      return
    }

    if (!form.category) {
      setError('Please choose an event category.')
      return
    }

    const eventDate = `${form.date}:00+05:00`
    const eventTime = new Date(eventDate).getTime()
    if (!form.date || Number.isNaN(eventTime)) {
      setError('Please enter a valid event date and time (PKT).')
      return
    }

    if (eventTime <= Date.now()) {
      setError('Please choose a future event date and time (PKT).')
      return
    }

    if (!form.venue.trim()) {
      setError('Please enter an event venue.')
      return
    }

    setError('')
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      date: eventDate,
      venue: form.venue.trim(),
    })
  }

  return (
    <form className="event-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="event-title">
        Event title
        <input id="event-title" name="title" type="text" value={form.title} onChange={handleChange} maxLength={150} required />
      </label>

      <label htmlFor="event-description">
        Description
        <textarea id="event-description" name="description" rows={4} value={form.description} onChange={handleChange} maxLength={5000} required />
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
        <input id="event-venue" name="venue" type="text" value={form.venue} onChange={handleChange} maxLength={200} required />
      </label>

      {error && <p className="event-form-error" role="alert">{error}</p>}

      <div className="event-form-actions">
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : event ? 'Save changes' : 'Create event'}</button>
        <Link to="/organizer">Cancel</Link>
      </div>
    </form>
  )
}

export default EventForm
