"use client"

import React, { useEffect, useMemo } from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ChevronRight, Search, X, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { SuccessModal } from "@/components/success-modal"
import Image from "next/image"
import { Category, useAddEquipmentMutation, useGetCategoriesQuery, useUploadEquipmentImagesMutation, useGetAddressSuggestionsQuery  } from "@/lib/redux/api/equipmentApi"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { useGetProfileQuery } from "@/lib/redux/api/authApi"
import Link from "next/link"

// interface Category {
//   id: string
//   name: string
// }

interface PhotoFile {
  id: string
  file: File
  preview: string
}

export default function RentPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const [price, setPrice] = useState("50000")
  const [location, setLocation] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [addEquipment] = useAddEquipmentMutation()
  const [uploadImages] = useUploadEquipmentImagesMutation()
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const { data: profileData } = useGetProfileQuery()
  const { data: addressData } = useGetAddressSuggestionsQuery(location, {
    skip: !location || location.length < 3,
  })
  const { data: categoriesData, isLoading } = useGetCategoriesQuery()
  const categories = categoriesData?.data || []

  const profile = profileData?.data?.user

  const eligibilityCheck = useMemo(() => {
    if (!profile) {
      return {
        canAddItems: false,
        missingRequirements: ["Profile data not loaded"],
      }
    }

    const missingRequirements: string[] = []

    const isProfileComplete = !!(
      profile.firstName?.trim() &&
      profile.lastName?.trim() &&
      profile.address?.trim() &&
      profile.country?.trim() &&
      profile.bio?.trim()
    )
    if (!isProfileComplete) {
      missingRequirements.push("Complete your profile details (first name, last name, address, country, and bio)")
    }

    if (!profile.isNinVerify) {
      missingRequirements.push("Verify your NIN")
    }

    if (!profile.isBvnVerify) {
      missingRequirements.push("Verify your BVN")
    }

    if (!profile.account) {
      missingRequirements.push("Link your bank account")
    }

    return {
      canAddItems: missingRequirements.length === 0,
      missingRequirements,
    }
  }, [profile])

 useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddPhoto = () => {
    
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      const totalPhotos = photos.length + newFiles.length

      if (totalPhotos > 6) {
        alert("You can only upload a maximum of 6 photos")
        return
      }

      const newPhotos = newFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }))

      setPhotos([...photos, ...newPhotos])

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemovePhoto = (id: string) => {
    // Find the photo to remove
    const photoToRemove = photos.find((photo) => photo.id === id)

    // Revoke the object URL to avoid memory leaks
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview)
    }

    // Remove the photo from the state
    setPhotos(photos.filter((photo) => photo.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eligibilityCheck.canAddItems) {
      enqueueSnackbar("Please complete your profile verification before adding items", { variant: "error" })
      return
    }

    if (!selectedCategory) {
      alert("Please select a category")
      return
    }

    if (photos.length === 0) {
      alert("Please add at least one photo")
      return
    }

    setIsSubmitting(true)

    try {
     const files: File[] = photos.map((photo) => photo.file)
      const uploadRes = await uploadImages(files).unwrap()
      const imageUrls = uploadRes.data
      // console.log(imageUrls)

      const res = await addEquipment({
        name: name,
        description: title,
        pricePerDay: Number(price),
        category: selectedCategory._id,
        media: imageUrls,
        address: selectedLocation || location,
      }).unwrap()

      console.log(res)
      setShowSuccessModal(true)
    } catch (error) {
    console.error("Error adding item:", error)

    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof (error as { data?: unknown }).data === "object" &&
          typeof (error as { data: { message?: unknown } }).data.message === "string"
          ? (error as { data: { message: string } }).data.message
          : "Something went wrong"

    enqueueSnackbar(message, { variant: "error" })
  } finally {
      setIsSubmitting(false)
    }
  }

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        URL.revokeObjectURL(photo.preview)
      })
    }
  }, [photos])

  const suggestions = addressData?.data ?? [];

  return (
    <div className="container font-sans mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Add new item</h1>

      {!eligibilityCheck.canAddItems && (
        <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-[#92400E] mb-2">
                Complete your profile to add items
              </h3>
              <p className="text-sm text-[#78350F] mb-3">
                To list items for rent, you need to complete the following:
              </p>
              <ul className="list-disc list-inside text-sm text-[#78350F] space-y-1 mb-4">
                {eligibilityCheck.missingRequirements.map((req: string, idx: number) => {
                  return (
                    <li key={idx}>{req}</li>
                  )
                })}
              </ul>
              <Link href="/dashboard/profile">
                <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-white rounded-lg p-6 ${!eligibilityCheck.canAddItems ? "opacity-50 pointer-events-none" : ""}`}>
        <p className="text-[#5A5555] text-xs mb-6">
          Upload some photos of your item, so people can see the details. Try to spot all features
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#F8F8FA] py-6 rounded-lg border-none"
                required
              />
          </div>
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="w-full flex items-center justify-between bg-[#F8F8FA] rounded-lg p-3 text-left"
            >
              <span className="text-[#5a5555]">{selectedCategory ? selectedCategory.name : "Enter category"}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Add photo</label>
            <p className="text-xs text-[#5A5555] mb-2">Add at least 6 photos for this category</p>            

            <div className="flex flex-wrap gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={photo.preview || "/placeholder.svg"}
                    alt="Item photo"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}

              {photos.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="w-24 h-24 flex items-center justify-center bg-[#ECFDF3] rounded-lg"
                >
                  <Plus className="w-6 h-6 text-primary" />
                </button>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[#000000] mb-1">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-8 py-6 rounded-lg bg-[#F8F8FA] border-none"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="relative">
            <label htmlFor="location" className="block text-sm font-medium text-black mb-1">
              Location
            </label>
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowSuggestions(true);
              }}
              className="bg-[#F8F8FA] py-6 rounded-lg border-none"
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white shadow-lg border rounded-lg mt-1 max-h-60 overflow-y-auto">
                {addressData?.data.map((addr, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(addr)
                      setLocation(addr)
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {addr}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
              Description
            </label>
            <Textarea
              id="title"
              placeholder="Enter product description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#F8F8FA] border-none min-h-[150px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-green-600 text-white py-6 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Done"}
          </Button>
        </form>
      </div>

      {/* Category Selection Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="sm:max-w-xl font-sans">
            <VisuallyHidden>
                <DialogTitle>This is the category modal for adding items</DialogTitle>
            </VisuallyHidden>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Find category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 placeholder:font-light bg-[#F8F8FA] rounded-lig py-5 border border-[#EBEBEB]"
              />
            </div>
          </div>

          <div className="max-h-[400px] hide-scrollbar overflow-y-auto">
            {isLoading ? (
              <p>Loading items...</p>
            ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category._id}
                    className="p-4 border mb-3 rounded-lg border-[#F0F0F0] hover:bg-[#F8F8FA] border-none cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowCategoryModal(false)
                    }}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        selectedCategory?._id === category._id ? "border-primary bg-white" : "border-gray-300 bg-white"
                      }`}
                    ></div>
                  </div>
                ))
            )}
          </div>

          <div className="p-4">
            <Button
              onClick={() => setShowCategoryModal(false)}
              className="w-full bg-primary hover:bg-green-600 text-white py-6 rounded-full"
            >
              {isSubmitting ? "Applying..." : "Apply"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          // Reset form
          setSelectedCategory(null)
          // Clean up object URLs before removing photos
          photos.forEach((photo) => {
            URL.revokeObjectURL(photo.preview)
          })
          setPhotos([])
          setPrice("")
          setLocation("")
          setTitle("")
        }}
        onConfirm={() => {
          router.push("/dashboard/profile")
        }}
        title="Your item is now live on the platform and ready for rent. Sit back, and get ready to earn while others rent what you own."
      />
    </div>
  )
}
