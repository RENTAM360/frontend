"use client"

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useGetProfileQuery } from "@/lib/redux/api/authApi"
import { MessagingProvider } from "@/context/messaging-context"
import { AnimatedLogo } from "./loading-logo"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { clearCredentials } from "@/lib/redux/slices/authSlice"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userToken = useAppSelector((state) => state.auth.data)
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !userToken,
  })

  useEffect(() => {
    const fetchError = error as FetchBaseQueryError | undefined
    console.log(fetchError)
    if(fetchError?.status === 401) {
      dispatch(clearCredentials())
      router.push("/login")
    }
  })

  if (isLoading) return <AnimatedLogo />
  if (error) return null;
  
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
