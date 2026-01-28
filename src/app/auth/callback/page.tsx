"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials, clearError } from "@/lib/redux/slices/authSlice";
import { AnimatedLogo } from "@/components/loading-logo";

export default function AuthCallback() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(errorParam || "Google sign-in failed. Please try again later.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    const finalizeLogin = async () => {
      try {
       
        dispatch(clearError());
        dispatch(
          setCredentials({
            user: null,
            data: { data: token },
          })
        );

        await fetch("/api/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      } catch (err) {
        console.error("Session sync failed", err);
        setError("Failed to establish session. Please try again.");
      }
    };

    finalizeLogin();
    router.replace("/dashboard");
  }, [dispatch, router]);

  return (
    <main className="flex items-center justify-center min-h-screen font-sans">
      <div className="text-center">
        {loading ? (
          <AnimatedLogo />
        ) : (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl shadow-sm">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Go Back to Login
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
