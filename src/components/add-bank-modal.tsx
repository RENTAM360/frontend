"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface AddBankModalProps {
  isOpen: boolean
  onClose: () => void
  onAddBank: (data: { accountName: string; accountNumber: string; bankName: string }) => void
}

export function AddBankModal({ isOpen, onClose, onAddBank }: AddBankModalProps) {
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onAddBank(formData)
      setFormData({ accountName: "", accountNumber: "", bankName: "" })
      onClose()
    } catch (error) {
      console.error("Error adding bank account:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md font-sans p-6">
        <div className="flex justify-between items-center mb-6">
          <DialogTitle className="text-2xl font-bold">Add bank account</DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accountName" className="block text-lg font-medium mb-2">
              Account name
            </label>
            <Input
              id="accountName"
              name="accountName"
              placeholder="Enter your name"
              value={formData.accountName}
              onChange={handleChange}
              className="bg-gray-50 h-14"
              required
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-lg font-medium mb-2">
              Account number
            </label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleChange}
              className="bg-gray-50 h-14"
              required
            />
          </div>

          <div>
            <label htmlFor="bankName" className="block text-lg font-medium mb-2">
              Bank name
            </label>
            <Input
              id="bankName"
              name="bankName"
              placeholder="Enter bank name"
              value={formData.bankName}
              onChange={handleChange}
              className="bg-gray-50 h-14"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-base hover:bg-green-600 text-white py-6 rounded-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Done"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
