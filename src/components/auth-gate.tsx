"use client"

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useGetProfileQuery } from "@/lib/redux/api/authApi"
import { MessagingProvider } from "@/context/messaging-context"
import { AnimatedLogo } from "./loading-logo"
import { useEffect } from "react"
import { clearCredentials } from "@/lib/redux/slices/authSlice"
import { persistor } from "@/lib/redux/store"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const userToken = useAppSelector((state) => state.auth.data)
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !userToken,
  })

  useEffect(() => {
    if (!error) return
    const redirectToLogin = async () => {
      try {
        await fetch("/api/logout", { method: "POST" })
      } catch {
        // Ignore; we still clear and redirect
      } finally {
        dispatch(clearCredentials())
        document.cookie = "auth_token=; path=/; max-age=0"
        document.cookie = "role=; path=/; max-age=0"
        await persistor.purge()
        window.location.href = "/login"
      }
    }
    redirectToLogin()
  }, [error, dispatch])

  if (isLoading) return <AnimatedLogo />
  if (error) return <AnimatedLogo />
  
  // Convert null to undefined for type compatibility
  const normalizeToUndefined = <T,>(value: T | null | undefined): T | undefined => {
    return value === null ? undefined : value
  }
  
  // Always wrap in MessagingProvider, even if no token (provider will handle missing data)
  return (
    <MessagingProvider
      currentUserId={normalizeToUndefined(profile?.data?.user?._id)}
      authToken={normalizeToUndefined(userToken)}
    >
      {children}
    </MessagingProvider>
  )
}
