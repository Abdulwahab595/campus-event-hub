import { createSlice } from '@reduxjs/toolkit'

const eventsSlice = createSlice({
  name: 'events',
  initialState: { items: [] },
  reducers: {
    setEvents(state, action) {
      state.items = action.payload
    },
    saveEvent(state, action) {
      const index = state.items.findIndex((event) => event.id === action.payload.id)
      if (index === -1) state.items.push(action.payload)
      else state.items[index] = action.payload
    },
    deleteEvent(state, action) {
      state.items = state.items.filter((event) => event.id !== action.payload)
    },
  },
})

export const { setEvents, saveEvent, deleteEvent } = eventsSlice.actions
export default eventsSlice.reducer
