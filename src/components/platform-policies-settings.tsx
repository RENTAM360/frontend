"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function PlatformPoliciesSettings() {
  const [privacyPolicies, setPrivacyPolicies] = useState("")

  const handleSave = () => {
    console.log("Saving privacy policies:", privacyPolicies)
    // Handle save logic here
  }

  return (
    <div className="max-w-4xl mx-6">
      <h2 className="text-lg font-bold mb-8">Platform Policies Management</h2>

      <div className="space-y-4">
        {/* Update privacy policies */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-4">Update privacy policies</label>
          <Textarea
            value={privacyPolicies}
            onChange={(e) => setPrivacyPolicies(e.target.value)}
            className="w-full h-40 bg-gray-50 border border-gray-200 rounded-lg p-4 resize-none"
            placeholder="Enter privacy policies content here..."
          />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-6 text-lg rounded-full"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
