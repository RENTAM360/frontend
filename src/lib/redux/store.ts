import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from "./slices/authSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage" 
import { baseApi } from "./api/baseApi"
import savedItemsReducer from "./slices/savedItemsSlice"

const persistConfig = {
  key: "auth",
  storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    savedItems: savedItemsReducer,
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
          `${baseApi.reducerPath}.queries`,
          `${baseApi.reducerPath}.mutations`,
        ],
      },
    }).concat(baseApi.middleware),
})

export const persistor = persistStore(store)

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
