"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, AlertTriangle } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  icon?: "success" | "warning"
  amount?: number
  actionLabel?: string
  cancelLabel?: string
  onAction?: () => void
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  icon = "success",
  amount,
  actionLabel = "Done",
  cancelLabel,
  onAction,
}: SuccessModalProps) {
  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md font-sans p-0 overflow-hidden">
        <div className="flex flex-col items-center justify-center p-6 pt-10 pb-10">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${
              icon === "success"
                ? "bg-gray-200"
                : "bg-orange-500 text-white"
            }`}
          >
            {icon === "success" ? (
              <Check className="w-12 h-12 text-white" />
            ) : (
              <AlertTriangle className="w-12 h-12" />
            )}
          </div>

          <div className="text-center text-[#5A5555] text-[17px] mb-10">
            {amount ? (
              <DialogTitle className="max-w-60 mb-2">
                {title} <span className="font-bold">₦{amount.toLocaleString()}</span>{" "}
                {description}
              </DialogTitle>
            ) : (
              <>
                <DialogTitle className="font-normal leading-6 text-gray-700 max-w-md mx-auto">{title}</DialogTitle>
                {description && <p className="text-gray-600 mt-2">{description}</p>}
              </>
            )}
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={handleAction}
              className="w-full bg-primary text-base hover:bg-green-600 text-white py-6 rounded-full"
            >
              {actionLabel}
            </Button>
            
            {cancelLabel && (
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full bg-green-50 text-base hover:bg-green-100 text-primary border-0 py-6 rounded-full"
              >
                {cancelLabel}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
