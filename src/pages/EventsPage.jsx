import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiRequest } from '../api'
import { setEvents } from '../store/eventsSlice'
import EventCard from '../components/EventCard'
import './EventsPage.css'

function EventsPage() {
  const dispatch = useDispatch()
  const events = useSelector((state) => state.events.items)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const categories = ['Workshop', 'Seminar', 'Sports', 'Other']

  useEffect(() => {
    let active = true
    async function loadEvents() {
      setLoading(true)
      setError('')
      try {
        const { events } = await apiRequest('/api/events')
        if (active) dispatch(setEvents(events))
      } catch (error) {
        if (active) setError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadEvents()
    return () => { active = false }
  }, [dispatch, refresh])

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.trim().toLowerCase())
    const matchesCategory = !category || event.category === category
    const eventDate = new Date(event.date).toLocaleDateString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Karachi',
    })
    return matchesSearch && matchesCategory && (!date || eventDate === date)
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
          <input id="event-search" type="search" placeholder="Enter an event title" value={search} onChange={(event) => setSearch(event.target.value)} />
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

      <h2>Available events</h2>
      {loading ? <p role="status">Loading events...</p> : error ? (
        <div>
          <p className="form-error" role="alert">{error}</p>
          <button type="button" onClick={() => setRefresh(refresh + 1)}>Try again</button>
        </div>
      ) : events.length === 0 ? <p>No events available yet.</p> : filteredEvents.length === 0 ? (
        <p role="status">No events match your search and filters.</p>
      ) : (
        <div className="event-list">
          {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </section>
  )
}

export default EventsPage
