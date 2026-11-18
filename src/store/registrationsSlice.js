import { createSlice } from '@reduxjs/toolkit'

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { items: [] },
  reducers: {
    setRegistrations(state, action) {
      state.items = action.payload
    },
    saveRegistration(state, action) {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index === -1) state.items.push(action.payload)
      else state.items[index] = action.payload
    },
    removeRegistration(state, action) {
      state.items = state.items.filter((item) => item.eventId !== action.payload)
    },
  },
})

export const { setRegistrations, saveRegistration, removeRegistration } = registrationsSlice.actions
export default registrationsSlice.reducer
