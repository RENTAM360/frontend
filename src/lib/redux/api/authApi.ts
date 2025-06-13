import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  gender: string
  dob: string
}

export interface ForgotPasswordCredentials {
  email: string
}

export interface ResetPasswordCredentials {
  token: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  data: string
}

interface ForgotPasswordResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || "",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.data

      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: "/auth/signup-web",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordCredentials>({
      query: (data) => ({
        url: "/auth/forget-password-web",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordCredentials>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query<AuthResponse["user"], void>({
      query: () => "/me",
      providesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetUserQuery, 
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation, 
} = authApi
