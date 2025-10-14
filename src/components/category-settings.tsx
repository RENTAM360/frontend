"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { AddCategoryModal } from "@/components/add-category-modal"
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  Category,
} from "@/lib/redux/api/equipmentApi"
import { enqueueSnackbar } from "notistack"

export function CategorySettings() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false)
  const { data, refetch } = useGetCategoriesQuery()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const categories: Category[] = data?.data || []

  const handleSelectCategory = (catId: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, catId] : prev.filter((id) => id !== catId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedCategories(checked ? categories.map((c) => c._id) : [])
  }

  const handleSaveCategory = async (name: string) => {
    try {
      await createCategory({ name }).unwrap()
      enqueueSnackbar("Category added successfully", {variant: "success"})
      setIsAddCatModalOpen(false)
      refetch()
    } catch (err) {
      enqueueSnackbar("Error creating category", {variant: "error"})
      console.error("Error creating category:", err)
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedCategories.map((id) => deleteCategory(id).unwrap()))
      enqueueSnackbar("Category deleted successfully", {variant: "success"})
      setSelectedCategories([])
      refetch()
    } catch (err) {
      enqueueSnackbar("Error deleting category", {variant: "error"})
      console.error("Error deleting categories:", err)
    }
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center mx-6 justify-between mb-8">
        <h2 className="text-lg font-bold">Equipment Categories</h2>
        <Button onClick={() => setIsAddCatModalOpen(true)} className="bg-[#17b266] hover:bg-[#149655] text-white px-6 py-2 rounded-lg">
          Add category
        </Button>
      </div>

      {/* Admin Table */}
      <div className="bg-white overflow-x-auto">
        <div className="min-w-[700px]">
           {/* Table Header */}
          <div className="grid grid-cols-12 gap-12 p-6 border-b bg-[#FBFBFB] border-gray-100">
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={selectedCategories.length === categories.length && categories.length > 0}
                onCheckedChange={handleSelectAll}
                className="border-gray-300"
              />
            </div>
            <div className="col-span-3 text-gray-500 text-sm font-medium">Category Name</div>
          </div>

          {/* Table Rows */}
          {categories.map((cat) => (
            <div key={cat._id} className="grid grid-cols-12 gap-12 p-6 border-b border-gray-50 hover:bg-gray-50">
              <div className="col-span-1 flex items-center">
                <Checkbox
                  checked={selectedCategories.includes(cat._id)}
                  onCheckedChange={(checked) =>
                    handleSelectCategory(cat._id, checked as boolean)
                  }
                  className="border-gray-300"
                />
              </div>
              <div className="col-span-8 flex items-center text-xs whitespace-nowrap font-medium">
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex justify-center mt-8">
        <Button
          className="bg-[#17b266] hover:bg-[#149655] text-white px-6 py-2 rounded-lg flex items-center gap-2"
          disabled={selectedCategories.length === 0}
          onClick={handleDeleteSelected}
        >
          <Trash2 className="w-4 h-4" />
          {selectedCategories.length} selected
        </Button>
      </div>

      {/* Add Admin Modal */}
      <AddCategoryModal isOpen={isAddCatModalOpen} isLoading={isCreating} onClose={() => setIsAddCatModalOpen(false)} onSave={handleSaveCategory} />
    </div>
  )
}
