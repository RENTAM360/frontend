"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { SuccessModal } from "@/components/success-modal"
import { useGetWalletAccountsQuery, useWithdrawMutation } from "@/lib/redux/api/walletApi"
import { useSnackbar } from "notistack"
import { AnimatedLogo } from "./loading-logo"

interface WithdrawViewProps {
  onCancel: () => void
  balance: number
}

export function WithdrawView({ onCancel, balance }: WithdrawViewProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { data: accountsResponse, isLoading: isLoadingAccounts } = useGetWalletAccountsQuery()
  const [withdraw, { isLoading: isSubmitting }] = useWithdrawMutation()

  const bankAccounts = accountsResponse?.data || []

  // Set default account if available
  useEffect(() => {
    if (bankAccounts.length > 0 && !selectedAccountId) {
      const defaultAccount = bankAccounts.find((acc) => acc.default) || bankAccounts[0]
      if (defaultAccount._id) {
        setSelectedAccountId(defaultAccount._id)
      }
    }
  }, [bankAccounts, selectedAccountId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAccountId) {
      enqueueSnackbar("Please select a bank account", { variant: "error" })
      return
    }

    const withdrawAmount = Number(amount)
    if (withdrawAmount <= 0) {
      enqueueSnackbar("Please enter a valid amount", { variant: "error" })
      return
    }

    if (withdrawAmount > balance) {
      enqueueSnackbar("Insufficient balance", { variant: "error" })
      return
    }

    try {
      await withdraw({
        amount: withdrawAmount,
        accountId: selectedAccountId,
      }).unwrap()
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error("Error processing withdrawal:", error)
      enqueueSnackbar(error?.data?.message || "Failed to process withdrawal", { variant: "error" })
    }
  }

  if (isLoadingAccounts) {
    return <AnimatedLogo />
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
          {bankAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bank accounts found. Please add a bank account first.</p>
            </div>
          ) : (
            bankAccounts.map((account) => {
              const accountId = account._id || account.accountNumber
              return (
                <div
                  key={accountId}
                  className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer ${
                    selectedAccountId === accountId ? "border-primary bg-white" : "border-gray-200 bg-gray-50"
                  }`}
                  onClick={() => setSelectedAccountId(accountId)}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center mr-4">
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-600">{account.bank.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{account.bank}</h3>
                      <p className="text-gray-500">
                        {account.accountNumber}
                        {account.default && <span className="ml-2 text-xs text-primary">(Default)</span>}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedAccountId === accountId ? "border-primary bg-primary" : "border-gray-300 bg-white"
                    }`}
                  ></div>
                </div>
              )
            })
          )}
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
            disabled={!amount || Number(amount) <= 0 || Number(amount) > balance || isSubmitting || !selectedAccountId || bankAccounts.length === 0}
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
