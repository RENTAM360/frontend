"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserProfile, useUpdateProfileMutation } from "@/lib/redux/api/authApi"
import { enqueueSnackbar } from "notistack"

interface ProfileEditFormProps {
  profile?: UserProfile
  onCancel: () => void
}

export function ProfileEditForm({ profile, onCancel }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    address: profile?.address || "",
    country: profile?.country || "Nigeria",
    bio: profile?.bio || "",
  })

  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

     try {
      const res = await updateProfile(formData).unwrap()
      enqueueSnackbar(res.message || `profile updated successfully!`, {
          variant: "success",
          autoHideDuration: 3000,
        })
      console.log("Profile updated:", formData)
      onCancel()
    } catch (error) {
      enqueueSnackbar(`update failed`, { variant: "error" })
      console.error("Error updating profile:", error)
    }
   
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit profile</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-8">
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className=" outline-none bg-gray-50" required />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className=" outline-none bg-gray-50" required />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className=" outline-none bg-gray-50"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <Select value={formData.country} onValueChange={handleSelectChange}>
            <SelectTrigger className=" outline-none bg-gray-50">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {formData.country === "Nigeria" && (
                    <span className="flex gap-2 items-center">
                      <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_493_16241)">
                        <path d="M2.82472 3.45544C2.29208 3.45544 1.78126 3.66703 1.40463 4.04366C1.028 4.4203 0.816406 4.93112 0.816406 5.46375L0.816406 14.5011C0.816406 15.0338 1.028 15.5446 1.40463 15.9212C1.78126 16.2979 2.29208 16.5095 2.82472 16.5095H6.84133V3.45544H2.82472Z" fill="#009A49"/>
                        <path d="M6.83984 3.45544H12.8648V16.5095H6.83984V3.45544Z" fill="#EEEEEE"/>
                        <path d="M16.8838 3.45544H12.8672V16.5095H16.8838C17.4164 16.5095 17.9273 16.2979 18.3039 15.9212C18.6805 15.5446 18.8921 15.0338 18.8921 14.5011V5.46375C18.8921 4.93112 18.6805 4.4203 18.3039 4.04366C17.9273 3.66703 17.4164 3.45544 16.8838 3.45544Z" fill="#009A49"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_493_16241">
                        <rect width="18.0748" height="18.0748" fill="white" transform="translate(0.816406 0.945068)"/>
                        </clipPath>
                        </defs>
                    </svg>
                       Nigeria
                    </span>
                  )}
                  {formData.country !== "Nigeria" && formData.country}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="w-full" value="Nigeria">
                <span className="flex items-center">
                    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_493_16241)">
                        <path d="M2.82472 3.45544C2.29208 3.45544 1.78126 3.66703 1.40463 4.04366C1.028 4.4203 0.816406 4.93112 0.816406 5.46375L0.816406 14.5011C0.816406 15.0338 1.028 15.5446 1.40463 15.9212C1.78126 16.2979 2.29208 16.5095 2.82472 16.5095H6.84133V3.45544H2.82472Z" fill="#009A49"/>
                        <path d="M6.83984 3.45544H12.8648V16.5095H6.83984V3.45544Z" fill="#EEEEEE"/>
                        <path d="M16.8838 3.45544H12.8672V16.5095H16.8838C17.4164 16.5095 17.9273 16.2979 18.3039 15.9212C18.6805 15.5446 18.8921 15.0338 18.8921 14.5011V5.46375C18.8921 4.93112 18.6805 4.4203 18.3039 4.04366C17.9273 3.66703 17.4164 3.45544 16.8838 3.45544Z" fill="#009A49"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_493_16241">
                        <rect width="18.0748" height="18.0748" fill="white" transform="translate(0.816406 0.945068)"/>
                        </clipPath>
                        </defs>
                    </svg>
                  Nigeria
                </span>
              </SelectItem>
              <SelectItem value="Ghana">Ghana</SelectItem>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="South Africa">South Africa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="bg-gray-50 border-none rounded-none outline-none min-h-[150px]"
          />
        </div>

        <div className="pt-4 text-center">
          <Button
            type="submit"
            className="w-3/4 bg-primary mb-10 hover:bg-green-600 text-white py-6 rounded-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}
