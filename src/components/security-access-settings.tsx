"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SecurityAccessSettings() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }

    console.log("Saving password change")
    // Handle password change logic here
  }

  return (
    <div className="max-w-2xl mx-6">
      <h2 className="text-lg font-bold mb-8">Security & Access Control</h2>

      <div className="space-y-4">
        {/* Enter old password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter old password</label>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full bg-[#F8F8FA] py-6 rounded-lg outline-none border-none"
          />
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#F8F8FA] py-6 rounded-lg outline-none border-none"
          />
        </div>

        {/* Re-write password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Re-write password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#F8F8FA] py-6 rounded-lg outline-none border-none"
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
