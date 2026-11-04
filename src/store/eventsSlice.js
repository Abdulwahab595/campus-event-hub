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
  reducers: {},
})

export default eventsSlice.reducer
