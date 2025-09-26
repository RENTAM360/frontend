"use client"

import { Provider } from "react-redux"
import { store, persistor } from "@/lib/redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { SnackbarProvider } from "notistack"
import GlobalToastHandler from "@/context/GlobalToastHandler"
import { AuthGate } from "@/components/auth-gate"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <GlobalToastHandler />
          <AuthGate>{children}</AuthGate>
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  )
}
