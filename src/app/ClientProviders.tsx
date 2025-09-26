"use client";

import { Providers } from "./providers";
import { SnackbarProvider } from "notistack";
import GlobalToastHandler from "@/context/GlobalToastHandler";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/lib/redux/store";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Providers>
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <GlobalToastHandler />
        {children}
      </SnackbarProvider>
    </Providers>
    </PersistGate>
    
  );
}
