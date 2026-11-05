import { useState } from 'react'
import { useSelector } from 'react-redux'
import EventCard from '../components/EventCard'
import './EventsPage.css'

function EventsPage() {
  const events = useSelector((state) => state.events.items)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const categories = [...new Set(events.map((event) => event.category))]

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.trim().toLowerCase())
    const matchesCategory = !category || event.category === category
    const eventDate = new Date(event.date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Karachi',
    })
    const matchesDate = !date || eventDate === date

    return matchesSearch && matchesCategory && matchesDate
  })

  function clearFilters() {
    setSearch('')
    setCategory('')
    setDate('')
  }

  return (
    <section className="page-panel">
      <h1>Campus Events</h1>
      <p>Explore workshops, seminars and activities at your university.</p>

      <div className="event-filters">
        <label htmlFor="event-search">
          Search by title
          <input
            id="event-search"
            type="search"
            placeholder="Enter an event title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label htmlFor="event-category">
          Category
          <select id="event-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label htmlFor="event-date">
          Event date (PKT)
          <input id="event-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <button type="button" onClick={clearFilters}>Clear filters</button>
      </div>

      <h2>Upcoming events</h2>
      {events.length === 0 ? (
        <p>No events available yet.</p>
      ) : filteredEvents.length === 0 ? (
        <p role="status">No events match your search and filters.</p>
      ) : (
        <div className="event-list">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}

export default EventsPage
