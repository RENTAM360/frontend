"use client"

import { useState } from "react"
import { PageHeader } from "@/context/page-header-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronRight, Upload } from "lucide-react"
import { PaymentWalletSettings } from "@/components/payment-wallet-settings"
import { AdminManagementSettings } from "@/components/admin-management-settings"
import { NotificationSettings } from "@/components/notification-settings"
import { SecurityAccessSettings } from "@/components/security-access-settings"
import { PlatformPoliciesSettings } from "@/components/platform-policies-settings"

// Settings menu items
const settingsMenuItems = [
  {
    id: "general",
    title: "General Settings",
  },
  {
    id: "admin-management",
    title: "Admin Management",
  },
  {
    id: "payment-wallet",
    title: "Payment & Wallet",
  },
  {
    id: "notifications",
    title: "Notifications Settings",
  },
  {
    id: "security",
    title: "Security & Access Control",
  },
  {
    id: "platform-policies",
    title: "Platform Policies Management",
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general")
  const [platformName, setPlatformName] = useState("Rentam360")
  const [supportEmail, setSupportEmail] = useState("Contactrentam360.com")
  const [cardMethodEnabled, setCardMethodEnabled] = useState(true)
  const [transferMethodEnabled, setTransferMethodEnabled] = useState(true)

  const handleSave = () => {
    console.log("Settings saved")
    // Handle save logic here
  }

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            platformName={platformName}
            setPlatformName={setPlatformName}
            supportEmail={supportEmail}
            setSupportEmail={setSupportEmail}
            cardMethodEnabled={cardMethodEnabled}
            setCardMethodEnabled={setCardMethodEnabled}
            transferMethodEnabled={transferMethodEnabled}
            setTransferMethodEnabled={setTransferMethodEnabled}
            onSave={handleSave}
          />
        )
      case "admin-management":
        return <AdminManagementSettings />
      case "payment-wallet":
        return <PaymentWalletSettings />
      case "notifications":
        return <NotificationSettings />
      case "security":
        return <SecurityAccessSettings />
      case "platform-policies":
        return <PlatformPoliciesSettings />
      default:
        return (
          <GeneralSettings
            platformName={platformName}
            setPlatformName={setPlatformName}
            supportEmail={supportEmail}
            setSupportEmail={setSupportEmail}
            cardMethodEnabled={cardMethodEnabled}
            setCardMethodEnabled={setCardMethodEnabled}
            transferMethodEnabled={transferMethodEnabled}
            setTransferMethodEnabled={setTransferMethodEnabled}
            onSave={handleSave}
          />
        )
    }
  }

  return (
    <>
      <PageHeader>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </PageHeader>

      <div className="flex gap-6">
        {/* Settings Menu */}
        <div className="w-80 bg-white border rounded-lg border-[#EBEBEB]">
          {settingsMenuItems.map((item) => (
            <SettingsMenuItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-lg py-4">{renderContent()}</div>
      </div>
    </>
  )
}

// Settings menu item component
function SettingsMenuItem({ item, isActive, onClick }: { item: any; isActive: boolean; onClick: () => void }) {
  return (
    <div
      className={`flex items-center border-b border-[#EBEBEB] justify-between p-4 cursor-pointer transition-colors ${
        isActive ? "text-[#17b266] bg-[#F8FEFB]" : "text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="font-medium">{item.title}</span>
      <ChevronRight className={`w-5 h-5 ${ isActive ? "text-[#17b266]" : "text-gray-700" }`} />
    </div>
  )
}

// General Settings component
function GeneralSettings({
  platformName,
  setPlatformName,
  supportEmail,
  setSupportEmail,
  cardMethodEnabled,
  setCardMethodEnabled,
  transferMethodEnabled,
  setTransferMethodEnabled,
  onSave,
}: {
  platformName: string
  setPlatformName: (value: string) => void
  supportEmail: string
  setSupportEmail: (value: string) => void
  cardMethodEnabled: boolean
  setCardMethodEnabled: (value: boolean) => void
  transferMethodEnabled: boolean
  setTransferMethodEnabled: (value: boolean) => void
  onSave: () => void
}) {
  return (
    <div className="max-w-2xl mx-6">
      <h2 className="text-lg font-bold mb-8">General settings</h2>

      <div className="space-y-4">
        {/* Platform Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform name</label>
          <Input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full outline-none bg-[#F8F8FA] py-6 rounded-lg border-none"
          />
        </div>

        {/* Support Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Support Email Address</label>
          <Input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full outline-none bg-[#F8F8FA] py-6 rounded-lg border-none"
          />
        </div>

        {/* Default Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Default Currency</label>

          {/* Card Method */}
          <div className="flex items-center mb-2 bg-[#F8F8FA] px-3 rounded-lg justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Card method</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
              </div>
            </div>
            <ToggleSwitch enabled={cardMethodEnabled} onChange={setCardMethodEnabled} />
          </div>

          {/* Transfer Method */}
          <div className="flex items-center bg-[#F8F8FA] px-3 rounded-lg justify-between py-4">
            <span className="text-gray-700">Transfer method</span>
            <ToggleSwitch enabled={transferMethodEnabled} onChange={setTransferMethodEnabled} />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Logo Upload</label>
          <div className="flex">
            <div className="w-54 h-24 border-gray-300 rounded-lg flex items-center justify-center bg-[#F8F8FA] cursor-pointer hover:bg-gray-100 transition-colors">
              <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.125 33.757H43.625C45.5147 33.757 47.3269 33.0064 48.6631 31.6702C49.9993 30.334 50.75 28.5217 50.75 26.632C50.75 24.7424 49.9993 22.9301 48.6631 21.5939C47.3269 20.2577 45.5147 19.507 43.625 19.507C42.96 19.507 42.6275 19.507 42.3971 19.4595C41.6894 19.317 41.3521 19.1009 40.9341 18.5119C40.7964 18.3219 40.6016 17.8897 40.2145 17.0252C39.2784 14.933 37.7569 13.1564 35.8335 11.9099C33.9101 10.6633 31.667 10 29.375 10C27.083 10 24.8399 10.6633 22.9165 11.9099C20.9931 13.1564 19.4716 14.933 18.5355 17.0252C18.1484 17.8897 17.9536 18.3195 17.8159 18.5119C17.3979 19.1009 17.0606 19.3194 16.3529 19.4619C16.1201 19.507 15.79 19.507 15.125 19.507C13.2353 19.507 11.4231 20.2577 10.0869 21.5939C8.75067 22.9301 8 24.7424 8 26.632C8 28.5217 8.75067 30.334 10.0869 31.6702C11.4231 33.0064 13.2353 33.757 15.125 33.757Z" fill="#ADB3BC"/>
                <path d="M23.4375 30.1953L29.375 24.2578L23.4375 30.1953ZM29.375 24.2578L35.3125 30.1953L29.375 24.2578ZM29.375 24.2578V48.0078V24.2578Z" fill="#ADB3BC"/>
                <path d="M23.4375 30.1953L29.375 24.2578M29.375 24.2578L35.3125 30.1953M29.375 24.2578V48.0078" stroke="black" strokeLinecap="round"/>
              </svg>

            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-8">
          <Button
            onClick={onSave}
            className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-6 text-lg rounded-full"
          >
            Save
          </Button>
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
