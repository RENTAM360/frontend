"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface AddCategoryModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export function AddCategoryModal({ isOpen, isLoading, onClose, onSave }: AddCategoryModalProps) {

    const [categoryName, setCategoryName] = useState("")

    const handleSubmit = () => {
        if (!categoryName.trim()) return
        onSave(categoryName)
        setCategoryName("")
    }
  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="w-full text-sm py-6 rounded-lg bg-[#F8F8FA]"
          />

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-6 text-lg rounded-full"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
