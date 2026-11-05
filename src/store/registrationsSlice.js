import { createSlice } from '@reduxjs/toolkit'

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: {
    items: [],
  },
  reducers: {
    registerForEvent(state, action) {
      const { eventId, studentId } = action.payload
      if (!eventId || !studentId) return

      const alreadyRegistered = state.items.some(
        (item) => item.eventId === eventId && item.studentId === studentId,
      )
      if (alreadyRegistered) return

      state.items.push({
        id: `${studentId}:${eventId}`,
        eventId,
        studentId,
      })
    },
  },
})

export const { registerForEvent } = registrationsSlice.actions
export default registrationsSlice.reducer
