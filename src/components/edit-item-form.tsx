import { useState, useRef } from "react"
import Image from "next/image"
import { X, Plus, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { SuccessModal } from "./success-modal"
import {
  type TransformedEquipmentDetail,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
  useUploadEquipmentImagesMutation,
  useGetCategoriesQuery,
} from "@/lib/redux/api/equipmentApi"
import { useRouter } from "next/navigation"

interface EditItemFormProps {
  initialData: TransformedEquipmentDetail
}

type Photo = {
  id: number
  url?: string | null
  file?: File | null
  preview?: string | null
}

type Category = {
  _id: string
  name: string
}

const normalizePhotos = (media: string[]): Photo[] =>
  media.map((url, index) => ({
    id: index + 1,
    url,
    file: null,
    preview: null,
  }))

export default function EditItemForm({ initialData }: EditItemFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  console.log(initialData)
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialData?.categoryId && initialData?.category
      ? { _id: initialData.categoryId, name: initialData.category }
      : null
  )
  const [photos, setPhotos] = useState<Photo[]>(normalizePhotos(initialData?.media || []))
  const [price, setPrice] = useState(initialData?.pricePerDay ? initialData.pricePerDay.toString() : "")
  const [location, setLocation] = useState(
     initialData?.address || ""
  )
  const [description, setDescription] = useState(initialData?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: categoriesData, isLoading } = useGetCategoriesQuery()
  const categories = categoriesData?.data || []
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map((file) => ({
        id: Date.now() + Math.random(),
        file,
        preview: URL.createObjectURL(file),
        url: null,
      }))
      setPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  const handleRemovePhoto = (id: number) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id))
  }

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteEquipment(initialData.id).unwrap();
      router.push("/dashboard/profile");
    } catch (error) {
      console.error("Failed to delete equipment:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };


 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const mediaUrls: string[] = []
      const newFiles = photos.filter(photo => photo.file).map(photo => photo.file!)
      const existingUrls = photos.filter(photo => photo.url).map(photo => photo.url!)

    // Upload new images if any
    if (newFiles.length > 0) {
      const uploadResult = await uploadImages(newFiles).unwrap()
      if (uploadResult.data && uploadResult.data.length > 0) {
        mediaUrls.push(...uploadResult.data)
      }
    }
     mediaUrls.push(...existingUrls)

      const updateData = {
        name,
        description,
        pricePerDay: Number.parseFloat(price),
        category: selectedCategory?._id,
        media: mediaUrls,
        address: location,
      }

      await updateEquipment({
        id: initialData.id,
        data: updateData,
      }).unwrap()

      setShowSuccessModal(true)
    } catch (error) {
      console.error("Failed to update equipment:", error)
      alert("Failed to update item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [updateEquipment] = useUpdateEquipmentMutation()
  const [deleteEquipment] = useDeleteEquipmentMutation()
  const [uploadImages] = useUploadEquipmentImagesMutation()

  return (
    <div className="container font-sans mx-auto px-4 py-8 max-w-3xl" >
      <header className="text-[23px] flex items-center justify-between gap-3 mb-4 font-[700]">
        <div className="flex justify-center items-center gap-3">
          <svg
          className="cursor-pointer"
          onClick={() => router.back()}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
            <path
              d="M9.57141 18.8201C9.38141 18.8201 9.19141 18.7501 9.04141 18.6001L2.97141 12.5301C2.68141 12.2401 2.68141 11.7601 2.97141 11.4701L9.04141 5.40012C9.33141 5.11012 9.81141 5.11012 10.1014 5.40012C10.3914 5.69012 10.3914 6.17012 10.1014 6.46012L4.56141 12.0001L10.1014 17.5401C10.3914 17.8301 10.3914 18.3101 10.1014 18.6001C9.96141 18.7501 9.76141 18.8201 9.57141 18.8201Z"
              fill="#292D32"
            />
            <path
              d="M20.5019 12.75H3.67188C3.26188 12.75 2.92188 12.41 2.92188 12C2.92188 11.59 3.26188 11.25 3.67188 11.25H20.5019C20.9119 11.25 21.2519 11.59 21.2519 12C21.2519 12.41 20.9119 12.75 20.5019 12.75Z"
              fill="#292D32"
            />
          </svg>
          Edit Item
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isSubmitting}
          className="text-[#F04438] cursor-pointer font-normal hover:underline disabled:opacity-50"
        >
          {isSubmitting ? "Deleting..." : "Delete"}
        </button>
      </header>

      <div className="bg-white rounded-lg p-6">
        <p className="text-[#5A5555] text-xs mb-6">
          Update your item details below. Make sure to keep photos and description clear.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" >
          {/* Photos */}
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative w-28 h-28 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={photo.preview || photo.url || "/placeholder.svg"}
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

              <button
                type="button"
                onClick={handleAddPhoto}
                className="w-28 h-28 flex items-center justify-center bg-[#ECFDF3] rounded-lg"
              >
                <Plus className="w-6 h-6 text-primary" />
              </button>

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

          {/* Title */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Title
            </label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#F8F8FA] py-6 rounded-lg border-none"
              required
            />
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
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-black mb-1">
              Location
            </label>
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              <span className="text-[#5a5555]">
                {selectedCategory ? selectedCategory.name : "Enter category"}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#F8F8FA] border-none min-h-[150px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-green-600 text-white py-6 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Done"}
          </Button>
        </form>
      </div>

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="sm:max-w-xl font-sans">  
            <DialogTitle className="sr-only">Edit category</DialogTitle>   
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Find category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 placeholder:font-light bg-[#F8F8FA] rounded-lg py-5 border border-[#EBEBEB]"
              />
            </div>
          </div>
          <div className="max-h-[400px] hide-scrollbar overflow-y-auto">
            {isLoading ? (
              <p>Loading equipments...</p>
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
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-sm font-sans text-center">
          <DialogTitle className="sr-only">Delete Item</DialogTitle>
          <div className="flex flex-col items-center space-y-4">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.5 3C15.025 3 4 14.025 4 27.5C4 40.975 15.025 52 28.5 52C41.975 52 53 40.975 53 27.5C53 14.025 41.975 3 28.5 3ZM26.575 13.5H30.425V32.75H26.575V13.5ZM28.5 43.25C27.1 43.25 25.875 42.025 25.875 40.625C25.875 39.225 27.1 38 28.5 38C29.9 38 31.125 39.225 31.125 40.625C31.125 42.025 29.9 43.25 28.5 43.25Z" fill="#FA812F"/>
            </svg>

            <h2 className="text-lg font-semibold">Delete</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this item? This action is permanent and cannot be undone.
            </p>
            <div className="w-full space-y-3">
              <Button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-green-600 text-white py-4 rounded-full"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-4 outline-none border-none bg-[#E8F8F1] text-[#12B76A] rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Your item has been updated successfully."
      />
    </div>
  )
}
