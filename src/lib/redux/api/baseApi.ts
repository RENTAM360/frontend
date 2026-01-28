import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

const NEXT_PUBLIC_AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL as string;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: NEXT_PUBLIC_AUTH_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const token = state.auth.data

      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }

      if (!headers.get("Content-Type")) {
        headers.set("Accept", "application/json")
      }

      return headers
    },
  }),
  tagTypes: ["User", "Equipment","Bookmarks", "Booking", "Transaction", "Transactions", "Review", "Feedback", "Message", "Conversation", "Notifications", "Wallet"],
  endpoints: () => ({}),
})
