"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ChevronRight, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { SuccessModal } from "@/components/success-modal"
import Image from "next/image"

interface Category {
  id: string
  name: string
}

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
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories: Category[] = [
    { id: "electronics", name: "Electronics" },
    { id: "commercial", name: "Commercial equipments" },
    { id: "property", name: "Property" },
    { id: "vehicles", name: "Vehicles" },
    { id: "building", name: "Building materials" },
    { id: "tools", name: "Hand tools" },
    { id: "cameras", name: "Photo and video cameras" },
  ]

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddPhoto = () => {
    // Trigger the hidden file input
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

      // Create preview URLs for the new files
      const newPhotos = newFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }))

      setPhotos([...photos, ...newPhotos])

      // Reset the file input so the same file can be selected again if needed
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
      // In a real implementation, you would upload the photos and form data here
      // For example:
      // const formData = new FormData()
      // formData.append('category', selectedCategory.id)
      // formData.append('price', price)
      // formData.append('location', location)
      // formData.append('title', title)
      // photos.forEach(photo => {
      //   formData.append('photos', photo.file)
      // })
      // await fetch('/api/items', { method: 'POST', body: formData })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Failed to add item. Please try again.")
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
  }, [])

  return (
    <div className="container font-sans mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Add new item</h1>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600 mb-6">
          Upload some photos of your item, so people can see the details. Try to spot all features
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 text-left"
            >
              <span className="text-gray-500">{selectedCategory ? selectedCategory.name : "Enter category"}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add photo</label>
            <p className="text-sm text-gray-500 mb-2">Add at least 6 photos for this category</p>

            <div className="flex flex-wrap gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={photo.preview || "/placeholder.svg"}
                    alt="Equipment photo"
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
                  className="w-24 h-24 flex items-center justify-center bg-green-50 rounded-lg border-2 border-dashed border-green-200"
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
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-8 bg-gray-50"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-50"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Textarea
              id="title"
              placeholder="Enter product description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 min-h-[150px]"
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
                <DialogTitle>This is the category modal for adding equipments</DialogTitle>
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
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="p-4 border mb-3 rounded-lg border-[#F0F0F0] hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                onClick={() => {
                  setSelectedCategory(category)
                  setShowCategoryModal(false)
                }}
              >
                <span className="text-sm font-medium">{category.name}</span>
                <div
                  className={`w-5 h-5 rounded-full border ${
                    selectedCategory?.id === category.id ? "border-primary bg-white" : "border-gray-300 bg-white"
                  }`}
                ></div>
              </div>
            ))}
          </div>

          <div className="p-4">
            <Button
              onClick={() => setShowCategoryModal(false)}
              className="w-full bg-primary hover:bg-green-600 text-white py-6 rounded-full"
            >
              Apply
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
          setPrice("50000")
          setLocation("")
          setTitle("")
        }}
        title="Your item is now live on the platform and ready for rent. Sit back, and get ready to earn while others rent what you own"
      />
    </div>
  )
}
