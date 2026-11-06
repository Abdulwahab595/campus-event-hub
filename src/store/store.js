import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './eventsSlice'
import authReducer from './authSlice'
import registrationsReducer from './registrationsSlice'
import { loadDemoData, saveDemoData } from './demoStorage'

const store = configureStore({
  reducer: {
    events: eventsReducer,
    auth: authReducer,
    registrations: registrationsReducer,
  },
  preloadedState: loadDemoData(),
})

saveDemoData(store.getState())
store.subscribe(() => saveDemoData(store.getState()))

export default store
