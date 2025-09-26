"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { useGetProfileQuery } from "@/lib/redux/api/authApi"
import { MessagingProvider } from "@/context/messaging-context"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const userToken = useAppSelector((state) => state.auth.data)
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !userToken,
  })

  if (!userToken) return <>{children}</>
  if (isLoading) return <div>Loading app...</div>
  if (!profile?.data) return <div>Failed to load user</div>

  return (
    <MessagingProvider
      currentUserId={profile.data._id}
      authToken={userToken}
    >
      {children}
    </MessagingProvider>
  )
}
