"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUpdatePaymentSettingsMutation } from "@/lib/redux/api/adminApi"
import { enqueueSnackbar } from "notistack"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface PaymentWalletSettingsProps {
  commission?: number
}

export function PaymentWalletSettings({ commission }: PaymentWalletSettingsProps) {
  const [commissionPercentage, setCommissionPercentage] = useState<number | undefined>(commission)
  const [updatePaymentSettings, { isLoading }] = useUpdatePaymentSettingsMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setCommissionPercentage(value === "" ? undefined : Number(value))
}


  const handleSave = async () => {
    if (!commissionPercentage || isNaN(Number(commissionPercentage))) {
      enqueueSnackbar({variant: "error", message: "Please enter a valid number!"})
      return
    }

    try {
      const res = await updatePaymentSettings({
        adminCommissionPercentage: Number(commissionPercentage),
      }).unwrap()

      enqueueSnackbar({ variant: "success", message: res.message || "Payment settings updated successfully." })
      setCommissionPercentage(0)
    } catch (error) {
      const err = error as FetchBaseQueryError
      enqueueSnackbar({
        variant: "error",
        message:
        "status" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? (err.data.message as string)
          : "Failed to update payment settings.",
        })
      }
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
            onChange={handleChange}
            className="w-full text-xs outline-none py-6 rounded-lg border-none bg-[#F8F8FA]"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-6 text-lg rounded-full"
          >
           {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
