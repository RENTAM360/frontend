"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Plus } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DialogTitle } from "@radix-ui/react-dialog"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  ownerId: string
  onSubmit: (data: { feedback: string; images: File[] }) => Promise<void>
}

// ownerId

export function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      const totalImages = images.length + newFiles.length

      if (totalImages <= 6) {
        // Maximum 6 images
        setImages([...images, ...newFiles])

        // Create preview URLs for the new images
        const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
        setPreviewUrls([...previewUrls, ...newPreviewUrls])
      } else {
        alert("You can upload a maximum of 6 images")
      }
    }
  }

  const removeImage = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])

    // Remove the image and its preview
    setImages(images.filter((_, i) => i !== index))
    setPreviewUrls(previewUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please write your feedback before submitting")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ feedback, images })
      // Reset form after successful submission
      setFeedback("")
      setImages([])
      setPreviewUrls([])
      onClose()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] font-sans p-0 overflow-hidden">
        <div className="relative p-6">
          <button onClick={onClose} className="absolute right-6 top-6 rounded-full border border-gray-300 p-1">
            <X className="h-4 w-4 text-gray-500" />
          </button>

          <DialogTitle className="text-xl font-medium text-center text-primary mb-8">How was your experience?</DialogTitle>

          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please write detailed feedback"
            className="min-h-[133px] text-base p-4 resize-none border-gray-200 rounded-lg"
          />

          <div className="mt-6">
            <div className="flex items-center gap-4 mb-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-white rounded-full border border-gray-300 w-5 h-5 flex items-center justify-center"
                  >
                    {/* <X className="h-3 w-3 text-gray-500" /> */}
                  </button>
                </div>
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center"
              >
                <Plus className="h-6 w-6 text-primary" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-[14px]">Attach a photo (optional)</span>
              <span className="text-gray-400 text-[12px]">You can upload {6 - images.length} images more</span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-8 py-6 text-base bg-primary hover:bg-green-600 text-white rounded-full"
          >
            {isSubmitting ? "Sending..." : "Send feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
