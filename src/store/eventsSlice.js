import { createSlice } from '@reduxjs/toolkit'

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [
      {
        id: 'event-1',
        title: 'Web Development Workshop',
        description: 'An introductory workshop on building web applications.',
        category: 'Workshop',
        date: '2026-11-12T14:00:00+05:00',
        venue: 'Computer Lab 2',
        organizerId: 'organizer-1',
      },
      {
        id: 'event-2',
        title: 'Campus Tech Talk',
        description: 'A discussion about technology and student projects.',
        category: 'Seminar',
        date: '2026-11-14T11:00:00+05:00',
        venue: 'Main Auditorium',
        organizerId: 'organizer-1',
      },
    ],
  },
  reducers: {
    createEvent(state, action) {
      const event = action.payload
      if (!event.id || !event.organizerId || state.items.some((item) => item.id === event.id)) return
      state.items.push(event)
    },
    updateEvent(state, action) {
      const updated = action.payload
      const event = state.items.find((item) => item.id === updated.id && item.organizerId === updated.organizerId)
      if (!event) return

      event.title = updated.title
      event.description = updated.description
      event.category = updated.category
      event.date = updated.date
      event.venue = updated.venue
    },
    deleteEvent(state, action) {
      const { id, organizerId } = action.payload
      state.items = state.items.filter((event) => event.id !== id || event.organizerId !== organizerId)
    },
  },
})

export const { createEvent, updateEvent, deleteEvent } = eventsSlice.actions
export default eventsSlice.reducer
