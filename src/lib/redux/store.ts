import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from "./slices/authSlice"
import { authApi } from "./api/authApi"
import savedItemsReducer from "./slices/savedItemsSlice"
import { equipmentApi } from "./api/equipmentApi"
// import { rentalApi } from "./api/rentalApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    savedItems: savedItemsReducer,
    [equipmentApi.reducerPath]: equipmentApi.reducer,
    // [rentalApi.reducerPath]: rentalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.timestamp", "meta.arg", "meta.baseQueryMeta"],
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore these paths in the state
        ignoredPaths: [
          "auth.user",
          "auth.token",
          `${authApi.reducerPath}.queries`,
          `${authApi.reducerPath}.mutations`,
          `${equipmentApi.reducerPath}.queries`,
          `${equipmentApi.reducerPath}.mutations`,
        //   `${rentalApi.reducerPath}.queries`,
        //   `${rentalApi.reducerPath}.mutations`,
        ],
      },
    }).concat(authApi.middleware, equipmentApi.middleware),
})

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
