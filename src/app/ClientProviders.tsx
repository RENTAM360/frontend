"use client";

import { Providers } from "./providers";
import { SnackbarProvider } from "notistack";
import GlobalToastHandler from "@/context/GlobalToastHandler";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SnackbarProvider maxSnack={3}>
        <GlobalToastHandler />
        {children}
      </SnackbarProvider>
    </Providers>
  );
}
