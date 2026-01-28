import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { authApi } from "../api/authApi"
import type { AuthResponse } from "../api/authApi"

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

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

const isBrowser = typeof window !== "undefined"

if (isBrowser) {
  const token = getCookie("auth_token")
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
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      state.data = action.payload.data.data
      if (isBrowser) {
        document.cookie =  `auth_token=${encodeURIComponent(
          action.payload.data.data
        )}; path=/; max-age=604800; secure; samesite=strict`
      }
    },
    clearCredentials: (state) => {
      state.user = null
      state.data = null
       if (isBrowser) {
        document.cookie = "auth_token=; path=/; max-age=0"
      }
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
        state.data = payload.data.data
        state.error = null
        state.loading = false
        state.successMessage = "Login Successful"
        if (isBrowser) {
        document.cookie =  `auth_token=${encodeURIComponent(
          payload.data.data
        )}; path=/; max-age=604800; secure; samesite=strict`
      }
      })
      // Handle login error
      .addMatcher(authApi.endpoints.login.matchRejected, (state, { error }) => {
        state.error = error.message || "Failed to login"
        state.loading = false
      })
      // Handle register success
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.data = payload.data.data
        state.error = null
        state.loading = false
        state.successMessage = "Registration successful"
      })
      // Handle register error
      .addMatcher(authApi.endpoints.register.matchRejected, (state, { error }) => {
        state.error = error.message || "Failed to register"
        state.loading = false
      })
      // Handle resend signup email
      .addMatcher(authApi.endpoints.resendSignupEmail.matchFulfilled, (state) => {
        state.successMessage = "Confirmation email resent! Please check your inbox.";
      })
      // resendSignupEmail error
      .addMatcher(authApi.endpoints.resendSignupEmail.matchRejected, (state, action) => {
        const apiError = action.payload as { data?: { message?: string } };
        state.error = apiError?.data?.message || "Failed to resend email. Try again.";
      })
      // Handle logout success
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null
        state.data = null
        state.loading = false
        state.successMessage = "Logged out successfully"
        state.error = null
        if (isBrowser) {
          document.cookie = "auth_token=; path=/; max-age=0"
        }
      })
  },
})

export const { clearError, setCredentials, setSuccess, clearMessages, clearCredentials, setError } = authSlice.actions
export default authSlice.reducer
