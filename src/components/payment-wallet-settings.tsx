"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function PaymentWalletSettings() {
  const [commissionPercentage, setCommissionPercentage] = useState("")

  const handleSave = () => {
    console.log("Saving commission percentage:", commissionPercentage)
    // Handle save logic here
  }

  return (
    <div className="max-w-2xl mx-6">
      <h2 className="text-lg font-bold mb-8">Payment & Wallet Settings</h2>

      <div className="space-y-8">
        {/* Transaction Fee Settings */}
        <div>
          <h3 className="text-sm font-medium mb-4">Transaction Fee Settings</h3>
          <Input
            type="text"
            placeholder="set admin commission percentage"
            value={commissionPercentage}
            onChange={(e) => setCommissionPercentage(e.target.value)}
            className="w-full text-xs outline-none py-6 rounded-lg border-none bg-[#F8F8FA]"
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
