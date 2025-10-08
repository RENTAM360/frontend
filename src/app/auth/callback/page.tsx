"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setCredentials, clearError } from "@/lib/redux/slices/authSlice"
import { AnimatedLogo } from "@/components/loading-logo"

export default function AuthCallback() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) {
      setError("No token found")
      setLoading(false)
      return
    }

    dispatch(clearError())
    dispatch(setCredentials({ user: null, data: token }))
    sessionStorage.setItem("auth_token", token)
    router.replace("/dashboard")
  }, [dispatch, router])

  return (
    <main className="flex items-center justify-center min-h-screen font-sans">
      <div className="text-center">
        {loading ? <AnimatedLogo /> : <p className="text-red-600">{error}</p>}
      </div>
    </main>
  )
}
