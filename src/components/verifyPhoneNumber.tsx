"use client"

import { useRef, useState } from "react"
import { useUpdatePhoneMutation, useVerifyPhoneMutation } from "@/lib/redux/api/authApi"
import { SuccessModal } from "@/components/success-modal"
import { enqueueSnackbar } from "notistack"

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
      const getErrorMessage = (err: unknown): string => {
        if (typeof err === "string") return err;
        if (err instanceof Error) return err.message;

        if (typeof err === "object" && err !== null) {
          const maybeError = err as { data?: { message?: string } };
          if (maybeError.data?.message) return maybeError.data.message;
        }

        return "Phone update failed";
      };
      enqueueSnackbar(getErrorMessage(err), {variant: "error"})
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
      const getErrorMessage = (err: unknown): string => {
        if (typeof err === "string") return err;
        if (err instanceof Error) return err.message;

        if (typeof err === "object" && err !== null) {
          const maybeError = err as { data?: { message?: string } };
          if (maybeError.data?.message) return maybeError.data.message;
        }

        return "OTP verification failed";
      };

      enqueueSnackbar(getErrorMessage(err), {variant: "error"})
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
          <div className="bg-white relative rounded-lg shadow-lg w-full max-w-sm py-6 px-8">
            <div className="">
              <h2 className="text-xl text-black font-bold mb-4">Add Phone Number</h2>
              <button onClick={onClose} className="text-gray-500 absolute right-6 top-6 hover:text-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#5A5555"/>
                  <path d="M9.16937 15.5801C8.97937 15.5801 8.78938 15.5101 8.63938 15.3601C8.34938 15.0701 8.34938 14.5901 8.63938 14.3001L14.2994 8.64011C14.5894 8.35011 15.0694 8.35011 15.3594 8.64011C15.6494 8.93011 15.6494 9.41011 15.3594 9.70011L9.69937 15.3601C9.55937 15.5101 9.35937 15.5801 9.16937 15.5801Z" fill="#5A5555"/>
                  <path d="M14.8294 15.5801C14.6394 15.5801 14.4494 15.5101 14.2994 15.3601L8.63938 9.70011C8.34938 9.41011 8.34938 8.93011 8.63938 8.64011C8.92937 8.35011 9.40937 8.35011 9.69937 8.64011L15.3594 14.3001C15.6494 14.5901 15.6494 15.0701 15.3594 15.3601C15.2094 15.5101 15.0194 15.5801 14.8294 15.5801Z" fill="#5A5555"/>
                </svg>

              </button>
            </div>
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
          <div className="bg-white relative rounded-lg shadow-lg w-full max-w-sm py-6 px-8">
            <div>

              <h2 className="text-lg text-black font-bold mb-4">Verify OTP</h2>
              <button onClick={onClose} className="text-gray-500 absolute right-6 top-6 hover:text-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#5A5555"/>
                  <path d="M9.16937 15.5801C8.97937 15.5801 8.78938 15.5101 8.63938 15.3601C8.34938 15.0701 8.34938 14.5901 8.63938 14.3001L14.2994 8.64011C14.5894 8.35011 15.0694 8.35011 15.3594 8.64011C15.6494 8.93011 15.6494 9.41011 15.3594 9.70011L9.69937 15.3601C9.55937 15.5101 9.35937 15.5801 9.16937 15.5801Z" fill="#5A5555"/>
                  <path d="M14.8294 15.5801C14.6394 15.5801 14.4494 15.5101 14.2994 15.3601L8.63938 9.70011C8.34938 9.41011 8.34938 8.93011 8.63938 8.64011C8.92937 8.35011 9.40937 8.35011 9.69937 8.64011L15.3594 14.3001C15.6494 14.5901 15.6494 15.0701 15.3594 15.3601C15.2094 15.5101 15.0194 15.5801 14.8294 15.5801Z" fill="#5A5555"/>
                </svg>

              </button>
            </div>
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
