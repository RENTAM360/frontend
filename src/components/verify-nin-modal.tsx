"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSnackbar } from "notistack"
import { useVerifyBvnMutation, useVerifyNinMutation } from "@/lib/redux/api/bankApi"

interface AddBankModalProps {
  isOpen: boolean
  onClose: () => void
  verifyText: string
}
export function VerifyNinModal({ isOpen, onClose, verifyText }: AddBankModalProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [verifyNin, { isLoading: loadingNin }] = useVerifyNinMutation()
  const [verifyBvn, { isLoading: loadingBvn }] = useVerifyBvnMutation()

  // console.log(banks)
  const [formData, setFormData] = useState({
    value: "",
  })
  // const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ value: e.target.value })
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let res
      if (verifyText === "NIN") {
        res = await verifyNin({ nin: formData.value }).unwrap()
      } else if (verifyText === "BVN") {
        res = await verifyBvn({ bvn: formData.value }).unwrap()
      }
      console.log(res)

      if (res?.status === 200) {
        enqueueSnackbar(res.data.message || `${verifyText} verification successful!`, {
          variant: "success",
          autoHideDuration: 3000,
        })
        setFormData({ value: "" })
        onClose()
      } else {
        enqueueSnackbar(`${verifyText} verification failed`, { variant: "error" })
      }
    } catch (error: unknown) {
        const errMsg =
            (error as { data?: { message?: string } })?.data?.message ||
            (error instanceof Error ? error.message : `Failed to verify ${verifyText}`)

        enqueueSnackbar(errMsg, { variant: "error" })
        console.error(`Error verifying ${verifyText}:`, error)
        }
  }

  const isLoading = loadingNin || loadingBvn

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md font-sans p-6">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl text-black font-bold">Add {verifyText} Number</DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#5A5555"/>
              <path d="M9.16937 15.5801C8.97937 15.5801 8.78938 15.5101 8.63938 15.3601C8.34938 15.0701 8.34938 14.5901 8.63938 14.3001L14.2994 8.64011C14.5894 8.35011 15.0694 8.35011 15.3594 8.64011C15.6494 8.93011 15.6494 9.41011 15.3594 9.70011L9.69937 15.3601C9.55937 15.5101 9.35937 15.5801 9.16937 15.5801Z" fill="#5A5555"/>
              <path d="M14.8294 15.5801C14.6394 15.5801 14.4494 15.5101 14.2994 15.3601L8.63938 9.70011C8.34938 9.41011 8.34938 8.93011 8.63938 8.64011C8.92937 8.35011 9.40937 8.35011 9.69937 8.64011L15.3594 14.3001C15.6494 14.5901 15.6494 15.0701 15.3594 15.3601C15.2094 15.5101 15.0194 15.5801 14.8294 15.5801Z" fill="#5A5555"/>
            </svg>

          </button>
        </div>

        <p className="text-[#6B6B6B] text-xs">To keep your account secure and give you full access to all features, please verify your identity using your {verifyText}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="nin" className="block text-lg font-medium mb-2">
              {verifyText} Number
            </label>

            {/* Searchable Input */}
            <input
              type="text"
              name="nin"
              placeholder={`Enter your ${verifyText}`}
              value={formData.value}
              onChange={handleChange}
              className="w-full bg-[#F8F8FA] h-10 rounded-md  px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-base hover:bg-[#12B76A] text-white py-6 rounded-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
