"use client"

// import {  useLazyGoogleLoginQuery } from "@/lib/redux/api/authApi"
import Image from "next/image"

export const AuthButtons = () => {
    // const [triggerGoogleLogin] = useLazyGoogleLoginQuery()

    const handleGoogleLogin = () => {
      window.location.href = "https://api.rentam360.com/api/v1/dev/auth/google"
    }

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <button 
                className="flex items-center gap-2 border rounded px-4 py-2 w-full justify-center"
                onClick={handleGoogleLogin}
            >
            <Image src="/google-play-badge.svg" alt="Google" width={20} height={20} />
            <span>Google</span>
            </button>
            {/* <button className="flex items-center gap-2 border rounded px-4 py-2 w-full justify-center">
            <Image src="/app-store-badge.svg" alt="Apple" width={20} height={20} />
            <span>Apple</span>
            </button> */}
        </div>
    )
}