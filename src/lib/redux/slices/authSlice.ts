import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { authApi } from "../api/authApi"
import type { AuthResponse } from "../api/authApi"

interface AuthState {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    gender?: string
    dob?: Date
  } | null
  data: string | null
  error: string | null
  loading: boolean
  successMessage: string | null
}

const initialState: AuthState = {
  user: null,
  data: null,
  error: null,
  loading: false,
  successMessage: null
}

if (typeof window !== "undefined") {
  const token = localStorage.getItem("auth_token")
  if (token) {
    initialState.data = token
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user
      state.data = action.payload.data
      localStorage.setItem("auth_token", action.payload.data)
    },
    clearCredentials: (state) => {
      state.user = null
      state.data = null
      localStorage.removeItem("auth_token")
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      // PENDING MATCHERS
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true
          state.error = null
          state.successMessage = null
        }
      )
      // Handle login success
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.data = payload.data
        state.error = null
        state.loading = false
        state.successMessage = "Login Successful"
        localStorage.setItem("auth_token", payload.data)
      })
      // Handle login error
      .addMatcher(authApi.endpoints.login.matchRejected, (state, { error }) => {
        state.error = error.message || "Failed to login"
        state.loading = false
      })
      // Handle register success
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.data = payload.data
        state.error = null
        state.loading = false
        state.successMessage = "Registration successful"
        localStorage.setItem("auth_token", payload.data)
      })
      // Handle register error
      .addMatcher(authApi.endpoints.register.matchRejected, (state, { error }) => {
        state.error = error.message || "Failed to register"
        state.loading = false
      })
      // Handle get user success
      .addMatcher(authApi.endpoints.getUser.matchFulfilled, (state, { payload }) => {
        state.user = payload
        state.error = null
        state.loading = false
      })
      // Handle get user error
      .addMatcher(authApi.endpoints.getUser.matchRejected, (state, { error }) => {
        state.error = error.message || "Failed to get user"
        state.user = null
        state.data = null
        state.loading = false
        localStorage.removeItem("auth_token")
      })
      // Handle logout success
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null
        state.data = null
        state.loading = false
        state.successMessage = "Logged out successfully"
        state.error = null
        localStorage.removeItem("auth_token")
      })
  },
})

export const { clearError, setCredentials, setSuccess, clearMessages, clearCredentials, setError } = authSlice.actions
export default authSlice.reducer
