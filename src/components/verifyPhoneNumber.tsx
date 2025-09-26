"use client"

import { useRef, useState } from "react"
import { useUpdatePhoneMutation, useVerifyPhoneMutation } from "@/lib/redux/api/authApi"
import { SuccessModal } from "@/components/success-modal"

interface VerifyPhoneModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VerifyPhoneModal({ isOpen, onClose }: VerifyPhoneModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", ""])
  const inputRefs = useRef<HTMLInputElement[]>([])

  const [updatePhone, { isLoading: isUpdating }] = useUpdatePhoneMutation()
  const [verifyPhone, { isLoading: isVerifying }] = useVerifyPhoneMutation()

  const formatPhone = (rawPhone: string) => {
    let formatted = rawPhone.trim()
    if (formatted.startsWith("0")) {
      formatted = "234" + formatted.slice(1)
    }
    return formatted
  }

  const handlePhoneSubmit = async () => {
    try {
      const formattedPhone = formatPhone(phone)
      await updatePhone({ phone: formattedPhone }).unwrap()
      setStep("otp")
    } catch (err) {
      console.error("Phone update failed", err)
    }
  }

  const handleOtpChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return // only digits

    const newOtp = [...otp]
    newOtp[idx] = value
    setOtp(newOtp)

    // Move to next input if digit entered
    if (value && idx < otp.length - 1) {
      inputRefs.current[idx + 1]?.focus()
    }

    // Auto-submit when last digit filled
    if (idx === otp.length - 1 && value) {
      handleOtpSubmit(newOtp)
    }
  }

  const handleOtpSubmit = async (overrideOtp?: string[]) => {
    try {
      const code = (overrideOtp || otp).join("")
      await verifyPhone({ code }).unwrap()
      setStep("success")
    } catch (err) {
      console.error("OTP verification failed", err)
    }
  }

  const handleClose = () => {
    setPhone("")
    setOtp(["", "", "", ""])
    setStep("phone")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {step === "phone" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm py-6 px-8">
            <h2 className="text-xl text-black font-bold mb-2">Add Phone Number</h2>
            <p className="text-xs text-[#6B6B6B] mb-4">
              Enter your phone number to get verified. We’ll send you a quick code to confirm it’s really you.
            </p>
            <label className="text-black mb-4" htmlFor="number">Phone Number</label>
            <input
              type="text"
              placeholder="Enter Number"
              name="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F8F8FA] rounded-md p-3 mt-2 mb-6"
            />
            <button
              onClick={handlePhoneSubmit}
              disabled={isUpdating || !phone}
              className="w-full bg-primary text-white py-3 rounded-full disabled:opacity-50"
            >
              {isUpdating ? "Sending..." : "Done"}
            </button>
          </div>
        </div>
      )}

      {step === "otp" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm py-6 px-8">
            <h2 className="text-lg font-bold mb-2">Verify OTP</h2>
            <p className="text-xs text-[#6B6B6B] mb-4">
              Enter the 4-digit code we sent to {phone}
            </p>
            <div className="flex justify-center my-10 gap-4 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    if (el) inputRefs.current[idx] = el
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-12 h-12 bg-[#F0F0F0] text-center border rounded-md text-lg"
                />
              ))}
            </div>
            <button
              onClick={() => handleOtpSubmit()}
              disabled={isVerifying || otp.some((d) => !d)}
              className="w-full bg-primary text-white py-3 mt-8 rounded-full disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <SuccessModal
          isOpen
          onClose={handleClose}
          title="Phone Verified!"
          description="Your phone number has been successfully verified."
          icon="success"
          actionLabel="Done"
          onAction={handleClose}
        />
      )}
    </>
  )
}
