"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAddBankMutation, useGetBanksQuery, useResolveBankMutation } from "@/lib/redux/api/bankApi"
import { useSnackbar } from "notistack"

interface AddBankModalProps {
  isOpen: boolean
  onClose: () => void
  onAddBank: (data: {
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
  }) => void

}
export function AddBankModal({ isOpen, onClose, onAddBank }: AddBankModalProps) {
  const { enqueueSnackbar } = useSnackbar()
  const { data: banksResponse } = useGetBanksQuery(undefined, { skip: !isOpen })
  const [resolveBank] = useResolveBankMutation()
  const [addBank, { isLoading: isSubmitting }] = useAddBankMutation()
  const [bankSearch, setBankSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  const banks = useMemo(() => banksResponse?.data?.data ?? [], [banksResponse])

  


  // console.log(banks)
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
  })
  // const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "bankCode") {
      const selectedBank = banks.find((b) => b.code === value)
      setFormData((prev) => ({
        ...prev,
        bankCode: value,
        bankName: selectedBank?.name || "",
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  useEffect(() => {
    if (formData.accountNumber.length === 10 && formData.bankCode) {
      const selectedBank = banksResponse?.data?.data?.find(
        (b) => b.code === formData.bankCode
      )
      resolveBank({
        bank: formData.bankCode,
        accountNumber: formData.accountNumber,
        bankName: selectedBank?.name || "",
      })
        .unwrap()
        .then((data) => {
         setFormData((prev) => ({
            ...prev,
            accountName: data.data.account_name,
          }))
        })
        .catch((err) => {
          console.error("Resolve failed:", err)
          setFormData((prev) => ({ ...prev, accountName: "" }))
        })
    }
  }, [formData.accountNumber, formData.bankCode, banksResponse, resolveBank])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addBank({
        bank: formData.bankCode,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
      }).unwrap()

      enqueueSnackbar("Bank account added successfully!", { 
        variant: "success",
        autoHideDuration: 3000,
      })

      onAddBank(formData)
      setFormData({ accountName: "", accountNumber: "", bankCode: "", bankName: "" })
      onClose()
    } catch (error) {
      enqueueSnackbar("Failed to add bank account", { 
        variant: "error",
      })
      console.error("Error adding bank:", error)
    }
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsSubmitting(true)

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     onAddBank(formData)
  //     setFormData({ accountName: "", accountNumber: "", bankName: "" })
  //     onClose()
  //   } catch (error) {
  //     console.error("Error adding bank account:", error)
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md font-sans p-6">
        <div className="flex justify-between items-center mb-6">
          <DialogTitle className="text-xl text-black font-bold">Add bank account</DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#5A5555"/>
              <path d="M9.16937 15.5801C8.97937 15.5801 8.78938 15.5101 8.63938 15.3601C8.34938 15.0701 8.34938 14.5901 8.63938 14.3001L14.2994 8.64011C14.5894 8.35011 15.0694 8.35011 15.3594 8.64011C15.6494 8.93011 15.6494 9.41011 15.3594 9.70011L9.69937 15.3601C9.55937 15.5101 9.35937 15.5801 9.16937 15.5801Z" fill="#5A5555"/>
              <path d="M14.8294 15.5801C14.6394 15.5801 14.4494 15.5101 14.2994 15.3601L8.63938 9.70011C8.34938 9.41011 8.34938 8.93011 8.63938 8.64011C8.92937 8.35011 9.40937 8.35011 9.69937 8.64011L15.3594 14.3001C15.6494 14.5901 15.6494 15.0701 15.3594 15.3601C15.2094 15.5101 15.0194 15.5801 14.8294 15.5801Z" fill="#5A5555"/>
            </svg>

          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="bankCode" className="block text-lg font-medium mb-2">
              Bank
            </label>

            {/* Searchable Input */}
            <input
              type="text"
              placeholder="Search banks..."
              value={bankSearch || formData.bankName}
              onChange={(e) => {
                setBankSearch(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-[#F8F8FA] h-10 rounded-md  px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
            />

            {/* Dropdown */}
            {showDropdown && (
              <ul className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-1">
                {banks
                  .filter((bank) =>
                    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
                  )
                  .map((bank) => (
                    <li
                      key={bank.code}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          bankCode: bank.code,
                          bankName: bank.name,
                        }))
                        setBankSearch(bank.name)
                        setShowDropdown(false)
                      }}
                      className="cursor-pointer px-4 py-3 text-base hover:bg-gray-100 transition-colors"
                    >
                      {bank.name}
                    </li>
                  ))}

                {/* No Results */}
                {banks.filter((bank) =>
                  bank.name.toLowerCase().includes(bankSearch.toLowerCase())
                ).length === 0 && (
                  <li className="px-4 py-3 text-gray-500">No bank found</li>
                )}
              </ul>
            )}
          </div>
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
              className="bg-[#F8F8FA] border-none rounded-md h-10"
              required
              readOnly
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
              className="bg-[#F8F8FA] border-none rounded-md h-10"
              maxLength={10}
              required
            />
          </div>

          {/* <div>
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
          </div> */}

          <Button
            type="submit"
            className="w-full bg-primary text-base hover:bg-[#12B76A] text-white py-6 rounded-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Done"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
