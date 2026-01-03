"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/context/page-header-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { PaymentWalletSettings } from "@/components/payment-wallet-settings";
import { AdminManagementSettings } from "@/components/admin-management-settings";
import { NotificationSettings } from "@/components/notification-settings";
import { SecurityAccessSettings } from "@/components/security-access-settings";
import { PlatformPoliciesSettings } from "@/components/platform-policies-settings";
import {
  NewAdminRequest,
  useCreateAdminMutation,
  useGetAdminsQuery,
  useGetPlatformSettingsQuery,
  useUpdateGeneralSettingsMutation,
} from "@/lib/redux/api/adminApi";
import { useUploadEquipmentImagesMutation } from "@/lib/redux/api/equipmentApi";
import Image from "next/image";
import { enqueueSnackbar } from "notistack";
import { CategorySettings } from "@/components/category-settings";
import { AddAdminModal } from "@/components/add-admin-modal";

type SettingsMenuItemType = {
  id: string;
  title: string;
};

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
  {
    id: "categories",
    title: "Category Settings",
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const { data: platformSettings } = useGetPlatformSettingsQuery();
  const [updateGeneralSettings, { isLoading: isUpdating }] =
    useUpdateGeneralSettingsMutation();

  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [cardMethodEnabled, setCardMethodEnabled] = useState(true);
  const [transferMethodEnabled, setTransferMethodEnabled] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const { refetch: refetchAdmins } = useGetAdminsQuery({ page: 1, limit: 50 });
  const [createAdmin, { isLoading: isCreatingAdmin }] =
    useCreateAdminMutation();

  useEffect(() => {
    if (platformSettings) {
      const settings = platformSettings.data;
      setPlatformName(settings.platformName);
      setSupportEmail(settings.supportEmail);
      setCardMethodEnabled(settings.cardPaymentEnabled);
      setTransferMethodEnabled(settings.transferEnabled);
      setLogoUrl(settings.logoUrl);
    }
  }, [platformSettings]);

  const handleSaveAdmin = async (newAdmin: NewAdminRequest) => {
    try {
      await createAdmin(newAdmin).unwrap();
      setIsAddModalOpen(false);
      refetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await updateGeneralSettings({
        platformName,
        supportEmail,
        cardPaymentEnabled: cardMethodEnabled,
        transferEnabled: transferMethodEnabled,
        logoUrl,
      }).unwrap();
      enqueueSnackbar("Updated successfully!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Failed to update setting!", { variant: "error" });
    }
  };

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
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            onSave={handleSave}
            isSaving={isUpdating}
          />
        );
      case "admin-management":
        return (
          <AdminManagementSettings
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        );
      case "payment-wallet":
        return (
          <PaymentWalletSettings
            commission={platformSettings?.data?.adminCommissionPercentage}
          />
        );
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecurityAccessSettings />;
      case "platform-policies":
        return <PlatformPoliciesSettings />;
      case "categories":
        return <CategorySettings />;
      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </PageHeader>

      <div className="relative flex flex-col md:flex-row gap-6">
        {/* Menu Panel */}
        <div
          className={`absolute inset-0 bg-white z-20 transition-transform duration-300 md:relative md:z-auto md:w-80 md:translate-x-0 border rounded-lg border-[#EBEBEB] ${
            activeSection !== "menu"
              ? "translate-x-[-100%] md:translate-x-0"
              : "translate-x-0"
          }`}
        >
          <div className="md:hidden border-b px-4 py-3 flex items-center justify-between">
            <h2 className="font-semibold text-lg">Settings</h2>
          </div>

          {settingsMenuItems.map((item) => (
            <SettingsMenuItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </div>

        {/* Content Panel */}
        <div
          className={`fixed inset-0 bg-white z-30 transition-transform duration-300 md:relative md:z-auto md:flex-1 md:translate-x-0 rounded-lg ${
            activeSection === "menu"
              ? "translate-x-full md:translate-x-0"
              : "translate-x-0"
          }`}
        >
          {/* Back button for mobile */}
          <div className="md:hidden border-b px-4 py-3 flex items-center gap-2">
            <button
              onClick={() => setActiveSection("menu")}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="rotate-180 h-5 w-5 text-gray-700" />
            </button>
            <h2 className="font-semibold text-lg">
              {
                settingsMenuItems.find((item) => item.id === activeSection)
                  ?.title
              }
            </h2>
          </div>

          <div className="p-4 md:p-0">{renderContent()}</div>
        </div>
      </div>

      <AddAdminModal
        isOpen={isAddModalOpen}
        isLoading={isCreatingAdmin}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdmin}
      />
    </>
  );
}

// Settings menu item component
function SettingsMenuItem({
  item,
  isActive,
  onClick,
}: {
  item: SettingsMenuItemType;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex items-center border-b border-[#EBEBEB] justify-between p-4 cursor-pointer transition-colors ${
        isActive
          ? "text-[#17b266] bg-[#F8FEFB]"
          : "text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="font-medium">{item.title}</span>
      <ChevronRight
        className={`w-5 h-5 ${isActive ? "text-[#17b266]" : "text-gray-700"}`}
      />
    </div>
  );
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
  logoUrl,
  setLogoUrl,
  onSave,
  isSaving,
}: {
  platformName: string;
  setPlatformName: (value: string) => void;
  supportEmail: string;
  setSupportEmail: (value: string) => void;
  cardMethodEnabled: boolean;
  setCardMethodEnabled: (value: boolean) => void;
  transferMethodEnabled: boolean;
  setTransferMethodEnabled: (value: boolean) => void;
  logoUrl: string;
  setLogoUrl: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const [uploadEquipmentImages, { isLoading: isUploading }] =
    useUploadEquipmentImagesMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      try {
        const result = await uploadEquipmentImages([file]).unwrap();
        if (result.data && result.data.length > 0) {
          setLogoUrl(result.data[0]);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to upload logo");
      }
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-6">
      <h2 className="text-lg font-bold mb-8">General settings</h2>

      <div className="space-y-4">
        {/* Platform Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform name
          </label>
          <Input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full outline-none bg-[#F8F8FA] py-6 rounded-lg border-none"
          />
        </div>

        {/* Support Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Email Address
          </label>
          <Input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full outline-none bg-[#F8F8FA] py-6 rounded-lg border-none"
          />
        </div>

        {/* Default Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Default Currency
          </label>

          {/* Card Method */}
          <div className="flex items-center mb-2 bg-[#F8F8FA] px-3 rounded-lg justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Card method</span>
              {/* <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
              </div> */}
            </div>
            <ToggleSwitch
              enabled={cardMethodEnabled}
              onChange={setCardMethodEnabled}
            />
          </div>

          {/* Transfer Method */}
          <div className="flex items-center bg-[#F8F8FA] px-3 rounded-lg justify-between py-4">
            <span className="text-gray-700">Transfer method</span>
            <ToggleSwitch
              enabled={transferMethodEnabled}
              onChange={setTransferMethodEnabled}
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Logo Upload
          </label>
          <div className="flex">
            <div
              className="w-54 h-24 border-gray-300 rounded-lg flex items-center justify-center bg-[#F8F8FA] cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleLogoClick}
            >
              {logoUrl ? (
                <Image
                  width={200}
                  height={200}
                  src={logoUrl}
                  alt="Logo"
                  className="object-contain h-full w-full"
                />
              ) : (
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.125 33.757H43.625C45.5147 33.757 47.3269 33.0064 48.6631 31.6702C49.9993 30.334 50.75 28.5217 50.75 26.632C50.75 24.7424 49.9993 22.9301 48.6631 21.5939C47.3269 20.2577 45.5147 19.507 43.625 19.507C42.96 19.507 42.6275 19.507 42.3971 19.4595C41.6894 19.317 41.3521 19.1009 40.9341 18.5119C40.7964 18.3219 40.6016 17.8897 40.2145 17.0252C39.2784 14.933 37.7569 13.1564 35.8335 11.9099C33.9101 10.6633 31.667 10 29.375 10C27.083 10 24.8399 10.6633 22.9165 11.9099C20.9931 13.1564 19.4716 14.933 18.5355 17.0252C18.1484 17.8897 17.9536 18.3195 17.8159 18.5119C17.3979 19.1009 17.0606 19.3194 16.3529 19.4619C16.1201 19.507 15.79 19.507 15.125 19.507C13.2353 19.507 11.4231 20.2577 10.0869 21.5939C8.75067 22.9301 8 24.7424 8 26.632C8 28.5217 8.75067 30.334 10.0869 31.6702C11.4231 33.0064 13.2353 33.757 15.125 33.757Z"
                    fill="#ADB3BC"
                  />
                  <path
                    d="M23.4375 30.1953L29.375 24.2578L23.4375 30.1953ZM29.375 24.2578L35.3125 30.1953L29.375 24.2578ZM29.375 24.2578V48.0078V24.2578Z"
                    fill="#ADB3BC"
                  />
                  <path
                    d="M23.4375 30.1953L29.375 24.2578M29.375 24.2578L35.3125 30.1953M29.375 24.2578V48.0078"
                    stroke="black"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {isUploading && (
                <p className="text-sm text-gray-500">Uploading...</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-8">
          <Button
            onClick={onSave}
            disabled={isSaving || isUploading}
            className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-6 text-lg rounded-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Toggle Switch component
function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
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
  );
}
