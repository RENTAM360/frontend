"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { SuccessModal } from "@/components/success-modal"

interface BankAccount {
  id: string
  bank: string
  accountNumber: string
  accountName: string
  logo: string
}

interface WithdrawViewProps {
  onCancel: () => void
  balance: number
}

export function WithdrawView({ onCancel, balance }: WithdrawViewProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>("gtb")
  const [amount, setAmount] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const bankAccounts: BankAccount[] = [
    {
      id: "gtb",
      bank: "GTB",
      accountNumber: "7077900016",
      accountName: "solomon Abuh",
      logo: "/gtb.svg",
    },
    {
      id: "fcmb",
      bank: "FCMB",
      accountNumber: "7077900016",
      accountName: "solomon Abuh",
      logo: "/fcmb.svg",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error processing withdrawal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-2xl font-medium">Make Withdrawal</h2>
      </div>
      <h2 className="text-sm mb-6 font-medium">Ready to withdraw? Just enter the amount you&apos;d like to take out.</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bank Account Selection */}
        <div className="space-y-4">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer ${
                selectedAccount === account.id ? "border-primary bg-white" : "border-gray-200 bg-gray-50"
              }`}
              onClick={() => setSelectedAccount(account.id)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center mr-4">
                  <Image
                    src={account.logo || "/placeholder.svg"}
                    alt={account.bank}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{account.bank}</h3>
                  <p className="text-gray-500">
                    {account.accountNumber}, {account.accountName}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedAccount === account.id ? "border-primary bg-primary" : "border-gray-300 bg-white"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-xl font-medium mb-2">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-50 h-16 text-lg"
            required
            min={1}
            max={balance}
          />
        </div>

        <div className="flex justify-center mb-10 gap-4">
          {/* <Button
            type="button"
            onClick={onCancel}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-6 rounded-full text-lg"
          >
            Cancel
          </Button> */}
          <Button
            type="submit"
            className="w-2/3 bg-primary hover:bg-green-600 text-white py-6 rounded-full text-lg"
            disabled={!amount || Number(amount) <= 0 || Number(amount) > balance || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Continue"}
          </Button>
        </div>
      </form>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          onCancel()
        }}
        title="Success! Your Withdrawal of"
        amount={amount ? Number(amount) : 0}
        description="has been completed successfully"
      />
    </div>
  )
}
