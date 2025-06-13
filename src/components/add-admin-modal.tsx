"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

type AdminRole = "Super Admin" | "Content Admin" | "Finance Admin" | "Support Admin"

interface AddAdminModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (adminData: {
    fullName: string
    email: string
    password: string
    role: AdminRole | ""
  }) => void
}

export function AddAdminModal({ isOpen, onClose, onSave }: AddAdminModalProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<AdminRole | "">("")
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

  const roles: AdminRole[] = ["Super Admin", "Content Admin", "Finance Admin", "Support Admin"]

  const handleSave = () => {
    onSave({
      fullName,
      email,
      password,
      role,
    })
    resetForm()
  }

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setRole("")
    setIsRoleDropdownOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative max-h-[90vh] hide-scrollbar overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose()
            resetForm()
          }}
          className="absolute top-6 right-6 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-2">Add Admin Users</h2>
        <p className="text-gray-500 mb-8">
          Fill in the form to add new admin users and empower your crew to take charge
        </p>

        {/* Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full outline-none border-none rounded-lg bg-gray-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none border-none rounded-lg bg-gray-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none border-none rounded-lg bg-gray-50"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <div className="relative">
              <button
                type="button"
                className="w-full bg-gray-50 p-3 text-left rounded-md flex justify-between items-center"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              >
                <span className={role ? "text-gray-900" : "text-gray-500"}>{role || "Select Option"}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {roles.map((roleOption) => (
                      <button
                        key={roleOption}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-gray-100"
                        onClick={() => {
                          setRole(roleOption)
                          setIsRoleDropdownOpen(false)
                        }}
                      >
                        {roleOption}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <Button
              onClick={handleSave}
              className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-3 text-lg rounded-full"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
