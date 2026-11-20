import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    sessionMessage: '',
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload
      state.sessionMessage = ''
    },
    logoutUser(state, action) {
      state.currentUser = null
      state.sessionMessage = action.payload || ''
    },
  },
})

export const { setCurrentUser, logoutUser } = authSlice.actions

export default authSlice.reducer
