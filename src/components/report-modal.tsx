"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { enqueueSnackbar } from "notistack"
import { useReportUserMutation } from "@/lib/redux/api/equipmentApi"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportedUserId: string
  reportedUserName: string
  equipmentId: string
}

const REPORT_REASONS = [
  "Item not as described",
  "Equipment is damaged or not functional",
  "Item was damaged or not working",
  "Equipment was unsafe to use",
  "Payment issues or fraud",
  "Price manipulation",
  "Refund not received",
  "Damaged equipment",
  "Other reason? (Please describe)",
]

export function ReportModal({ isOpen, onClose, reportedUserId, reportedUserName, equipmentId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [reportUser, { isLoading }] = useReportUserMutation()

  const handleReport = async () => {
        if (!selectedReason) {
            enqueueSnackbar("Please select a reason for reporting", { variant: "error" })
        return
        }

        try {
            const reason = selectedReason === "Other reason" && description.trim() ? description.trim() : selectedReason
            const response = await reportUser({
            equipmentId,
            reportedId: reportedUserId,
            report: { reason },
            }).unwrap()
            enqueueSnackbar(response.message || "Your concerns have been recorded", { variant: "success" })

            onClose()
            setSelectedReason("")
            setDescription("")
        } catch (error) {
            enqueueSnackbar(error instanceof Error ? error.message : "Failed to submit report", { variant: "error" })
            console.error("❌ Report failed:", error)
        }
    }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setSelectedReason("")
      setDescription("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <svg width="24" height="24" viewBox="0 0 24 24" onClick={handleClose} className="absolute right-4 top-4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#5A5555"/>
            <path d="M9.16937 15.58C8.97937 15.58 8.78938 15.51 8.63938 15.36C8.34938 15.07 8.34938 14.59 8.63938 14.3L14.2994 8.63999C14.5894 8.34999 15.0694 8.34999 15.3594 8.63999C15.6494 8.92999 15.6494 9.40998 15.3594 9.69998L9.69937 15.36C9.55937 15.51 9.35937 15.58 9.16937 15.58Z" fill="#5A5555"/>
            <path d="M14.8294 15.58C14.6394 15.58 14.4494 15.51 14.2994 15.36L8.63938 9.69998C8.34938 9.40998 8.34938 8.92999 8.63938 8.63999C8.92937 8.34999 9.40937 8.34999 9.69937 8.63999L15.3594 14.3C15.6494 14.59 15.6494 15.07 15.3594 15.36C15.2094 15.51 15.0194 15.58 14.8294 15.58Z" fill="#5A5555"/>
        </svg>

        <DialogHeader>
          <DialogTitle className="font-sans text-center text-black my-4">Report {reportedUserName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 font-sans">
          <div>
            <label className="text-sm font-medium mb-2 text-black block">Report reason</label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="bg-[#F8F8FA]">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReason === "Other reason? (Please describe)" && (
            <div>
              <Textarea
                placeholder="Please describe your issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {/* <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1 bg-transparent">
              Cancel
            </Button> */}
            <Button onClick={handleReport} disabled={isLoading || !selectedReason} className="flex-1 py-5 rounded-full">
              {isLoading ? "Sending..." : "Send Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
