"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useUpdatePasswordMutation } from "@/lib/redux/api/authApi"
import { enqueueSnackbar } from "notistack"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      enqueueSnackbar("Please fill in all fields", { variant: "error" })
      return
    }

    if (newPassword !== confirmPassword) {
      enqueueSnackbar("New passwords do not match", { variant: "error" })
      return
    }

    if (newPassword.length < 6) {
      enqueueSnackbar("New password must be at least 6 characters", { variant: "error" })
      return
    }

    if (oldPassword === newPassword) {
      enqueueSnackbar("New password must be different from old password", { variant: "error" })
      return
    }

    try {
      const response = await updatePassword({
        old_passord: oldPassword,  // Backend expects "old_passord" (typo)
        new_password: newPassword,
      }).unwrap()

      if (response.status === 200) {
        enqueueSnackbar(response.message || "Password updated successfully", {
          variant: "success",
        })
        // Reset form
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        onClose()
      }
    } catch (error: unknown) {
      const errMsg =
        (error as { data?: { message?: string } })?.data?.message ||
        (error instanceof Error ? error.message : "Failed to update password")

      enqueueSnackbar(errMsg, { variant: "error" })
      console.error("Error updating password:", error)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md font-sans p-6">
        <div className="flex justify-between items-center mb-6">
          <DialogTitle className="text-xl text-black font-bold">Change Password</DialogTitle>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                fill="#5A5555"
              />
              <path
                d="M9.16937 15.5801C8.97937 15.5801 8.78938 15.5101 8.63938 15.3601C8.34938 15.0701 8.34938 14.5901 8.63938 14.3001L14.2994 8.64011C14.5894 8.35011 15.0694 8.35011 15.3594 8.64011C15.6494 8.93011 15.6494 9.41011 15.3594 9.70011L9.69937 15.3601C9.55937 15.5101 9.35937 15.5801 9.16937 15.5801Z"
                fill="#5A5555"
              />
              <path
                d="M14.8294 15.5801C14.6394 15.5801 14.4494 15.5101 14.2994 15.3601L8.63938 9.70011C8.34938 9.41011 8.34938 8.93011 8.63938 8.64011C8.92937 8.35011 9.40937 8.35011 9.69937 8.64011L15.3594 14.3001C15.6494 14.5901 15.6494 15.0701 15.3594 15.3601C15.2094 15.5101 15.0194 15.5801 14.8294 15.5801Z"
                fill="#5A5555"
              />
            </svg>
          </button>
        </div>

        <p className="text-[#6B6B6B] text-xs mb-6">
          To keep your account secure, please enter your current password and choose a new one.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="relative">
            <label htmlFor="oldPassword" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              placeholder="Enter your current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-[#F8F8FA] h-12 rounded-md px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#F8F8FA] h-12 rounded-md px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#F8F8FA] h-12 rounded-md px-4 text-base focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-base hover:bg-[#12B76A] text-white py-6 rounded-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

