import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './eventsSlice'
import authReducer from './authSlice'
import registrationsReducer from './registrationsSlice'

const store = configureStore({
  reducer: {
    events: eventsReducer,
    auth: authReducer,
    registrations: registrationsReducer,
  },
})

export default store
