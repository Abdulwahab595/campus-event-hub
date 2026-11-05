import { createSlice } from '@reduxjs/toolkit'

// Frontend demo only. Use dummy passwords; this state is lost on a page reload.
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    users: [],
    pendingEmail: '',
    currentUser: null,
  },
  reducers: {
    registerUser(state, action) {
      const existingUser = state.users.find((user) => user.email === action.payload.email)
      if (existingUser) return

      state.users.push({
        ...action.payload,
        id: action.payload.email,
        isVerified: false,
      })
      state.pendingEmail = action.payload.email
      state.currentUser = null
    },
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload
    },
    verifyEmail(state, action) {
      const user = state.users.find((user) => user.email === action.payload.email)
      if (user && !user.isVerified && user.verificationCode === action.payload.code) {
        user.isVerified = true
        user.verificationCode = ''
      }
    },
    resendVerificationCode(state, action) {
      const user = state.users.find((user) => user.email === action.payload.email)
      if (user && !user.isVerified) {
        user.verificationCode = action.payload.code
      }
    },
    loginUser(state, action) {
      const user = state.users.find((user) => user.email === action.payload.email)
      if (user && user.isVerified && user.password === action.payload.password) {
        state.currentUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        }
      }
    },
    logoutUser(state) {
      state.currentUser = null
    },
  },
})

export function createDemoCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export const {
  registerUser,
  setPendingEmail,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  logoutUser,
} = authSlice.actions

export default authSlice.reducer
