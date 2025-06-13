"use client"

import { useState } from "react"

export function NotificationSettings() {
  const [paymentReceived, setPaymentReceived] = useState(true)
  const [newRentalRequest, setNewRentalRequest] = useState(true)
  const [reportUpdates, setReportUpdates] = useState(true)

  return (
    <div className="max-w-2xl mx-6">
      <h2 className="text-lg font-bold mb-8">Notification Settings</h2>

      <div className="space-y-2">
        {/* Payment received */}
        <div className="flex items-center bg-[#F8F8FA] justify-between rounded-xl p-3">
          <span className="text-gray-900 text-xs font-medium">Payment received</span>
          <ToggleSwitch enabled={paymentReceived} onChange={setPaymentReceived} />
        </div>

        {/* New rental request */}
        <div className="flex items-center bg-[#F8F8FA] justify-between rounded-xl p-3">
          <span className="text-gray-900 text-xs font-medium">New rental request</span>
          <ToggleSwitch enabled={newRentalRequest} onChange={setNewRentalRequest} />
        </div>

        {/* Report updates */}
        <div className="flex items-center bg-[#F8F8FA] justify-between rounded-xl p-3">
          <span className="text-gray-900 text-xs font-medium">Report updates</span>
          <ToggleSwitch enabled={reportUpdates} onChange={setReportUpdates} />
        </div>
      </div>
    </div>
  )
}

// Toggle Switch component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#17b266]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}
