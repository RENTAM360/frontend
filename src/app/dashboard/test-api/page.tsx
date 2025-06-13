"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestApiPage() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testApiCall = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      console.log("🚀 Making API call to: http://13.247.232.234/api/v1/dev/equipment")

      const res = await fetch("http://13.247.232.234/api/v1/dev/equipment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers if needed
        },
      })

      console.log("📡 Response status:", res.status)
      console.log("📡 Response headers:", Object.fromEntries(res.headers.entries()))

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      console.log("✅ API Response:", data)
      console.log("📊 Response type:", typeof data)
      console.log("📊 Is array:", Array.isArray(data))

      if (Array.isArray(data)) {
        console.log("📊 Array length:", data.length)
        if (data.length > 0) {
          console.log("📊 First item:", data[0])
          console.log("📊 First item keys:", Object.keys(data[0]))
        }
      } else if (data && typeof data === "object") {
        console.log("📊 Object keys:", Object.keys(data))
        if (data.data && Array.isArray(data.data)) {
          console.log("📊 data.data length:", data.data.length)
          if (data.data.length > 0) {
            console.log("📊 First data item:", data.data[0])
            console.log("📊 First data item keys:", Object.keys(data.data[0]))
          }
        }
      }

      setResponse(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      console.error("❌ API Error:", errorMessage)
      console.error("❌ Full error:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const testWithDifferentMethods = async () => {
    console.log("🔄 Testing different request methods and headers...")

    // Test with different headers
    const testConfigs = [
      {
        name: "Basic GET",
        config: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      },
      {
        name: "GET with Accept header",
        config: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      },
      {
        name: "GET with User-Agent",
        config: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Rentam360-Web-App",
          },
        },
      },
    ]

    for (const test of testConfigs) {
      try {
        console.log(`🧪 Testing: ${test.name}`)
        const res = await fetch("http://13.247.232.234/api/v1/dev/equipment", test.config)
        console.log(`✅ ${test.name} - Status:`, res.status)

        if (res.ok) {
          const data = await res.json()
          console.log(`✅ ${test.name} - Data:`, data)
          break // If successful, stop testing
        }
      } catch (err) {
        console.error(`❌ ${test.name} - Error:`, err)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Testing Endpoint:</h2>
          <code className="text-sm bg-white p-2 rounded border">http://13.247.232.234/api/v1/dev/equipment</code>
        </div>

        <div className="flex gap-4">
          <Button onClick={testApiCall} disabled={loading} className="bg-green-500 hover:bg-green-600">
            {loading ? "Testing..." : "Test API Call"}
          </Button>

          <Button onClick={testWithDifferentMethods} disabled={loading} variant="outline">
            Test Different Methods
          </Button>
        </div>
      </div>

      {/* Results Display */}
      <div className="space-y-6">
        {loading && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-blue-800">🔄 Making API call... Check console for details</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">❌ Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="text-green-800 font-semibold mb-2">✅ Success! Response received:</h3>
            <div className="bg-white p-4 rounded border overflow-auto max-h-96">
              <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="text-yellow-800 font-semibold mb-2">📝 Instructions:</h3>
        <ol className="text-yellow-700 space-y-1 list-decimal list-inside">
          <li>Click "Test API Call" button</li>
          <li>Open your browser's Developer Tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Look for the logged API response data</li>
          <li>Copy the response structure to share with me</li>
        </ol>
      </div>

      {/* CORS Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-blue-800 font-semibold mb-2">🔒 CORS Note:</h3>
        <p className="text-blue-700 text-sm">
          If you see a CORS error, it means the API server needs to allow requests from this domain. The error will show
          in the console, but we can still see what the API structure should be.
        </p>
      </div>
    </div>
  )
}
