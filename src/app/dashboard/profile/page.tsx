"use client"

import Image from "next/image"
import Link from "next/link"
import {Phone, ChevronRight, Info } from "lucide-react"
import { EquipmentCard } from "@/components/equipment-card"
import { getUserProfile } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMemo, useRef, useState } from "react"
import { ProfileEditForm } from "@/components/profile-edit-form"
import { WalletView } from "@/components/wallet-view"
import { SuccessModal } from "@/components/success-modal"
import { OtherUserProfile, useDeleteAccountMutation, useGetProfileQuery, useUpdateProfileMutation } from "@/lib/redux/api/authApi"
import { VerifyNinModal } from "@/components/verify-nin-modal"
import { useGetEquipmentsQuery, useUploadEquipmentImagesMutation } from "@/lib/redux/api/equipmentApi"
import { VerifyPhoneModal } from "@/components/verifyPhoneNumber"
import { enqueueSnackbar } from "notistack"
import { useLogout } from "@/app/utils/handleLogout"

type ViewMode = "items" | "edit" | "wallet"
type StageStatus = "gray" | "green" | "orange";

export default function ProfilePage() {
    const [viewMode, setViewMode] = useState<ViewMode>("items")
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const user = getUserProfile()
    const { data: profileData } = useGetProfileQuery()
    const [verifyType, setVerifyType] = useState<"NIN" | "BVN" | null>(null);
    const [showVerifyPhone, setShowVerifyPhone] = useState(false)
    const [uploadEquipmentImages] = useUploadEquipmentImagesMutation()
    const [updateProfile] = useUpdateProfileMutation()
    const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadTarget, setUploadTarget] = useState<"cover" | "avatar" | null>(null)
    const [uploadingTarget, setUploadingTarget] = useState<"cover" | "avatar" | null>(null)



    // console.log(profileData)
    const profile = profileData?.data?.user
    const userId = profile?._id

    const { data: userEquipments } = useGetEquipmentsQuery({ userId })
    // console.log(userEquipments)

    const accountStages = useMemo<{
      details: StageStatus;
      verification: StageStatus;
      bank: StageStatus;
    }>(() => {
    if (!profile) return { details: "gray", verification: "gray", bank: "gray" }

    // Check if all required profile fields are completed
    const isProfileComplete = !!(
      profile.firstName?.trim() &&
      profile.lastName?.trim() &&
      profile.address?.trim() &&
      profile.country?.trim() &&
      profile.bio?.trim()
    )

    // Check verification status (NIN and BVN)
    const isVerificationComplete = profile.isNinVerify && profile.isBvnVerify
    const isVerificationPending = (profile.isNinVerify || profile.isBvnVerify) && !isVerificationComplete

    return {
      details: isProfileComplete ? "green" : "gray",
      verification: isVerificationComplete ? "green" : isVerificationPending ? "orange" : "gray",
      bank: profile.account ? "green" : "gray",
    }
  }, [profile])

  const transactions = [
    // Rental transactions
    {
      id: "1",
      title: "Toyota Camry 2010",
      date: "06 march, 2025",
      amount: 100000,
      status: "debit" as const,
      type: "rental" as const,
    },
    {
      id: "2",
      title: "Firman SPG3000",
      date: "06 march, 2025",
      amount: 100000,
      status: "successful" as const,
      type: "rental" as const,
    },
    {
      id: "3",
      title: "Toyota highlander",
      date: "06 march, 2025",
      amount: 100000,
      status: "pending" as const,
      type: "rental" as const,
    },
    // Financial transactions
    {
      id: "4",
      title: "Withdraw",
      date: "06 march, 2025",
      amount: 100000,
      status: "withdrawal" as const,
      type: "transaction" as const,
    },
    {
      id: "5",
      title: "Deposit",
      date: "05 march, 2025",
      amount: 150000,
      status: "deposit" as const,
      type: "transaction" as const,
    },
  ]

   const handleDeleteAccount = async (userId: string) => {
    try {
      const response = await deleteAccount(userId).unwrap();
      enqueueSnackbar(response.message || "Account deleted successfully", { variant: "success" });

      handleLogout()
      console.log("Account deleted:", response);
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: string } }).data?.message === "string"
          ? (err as { data: { message: string } }).data.message
          : "Failed to delete account";

      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !uploadTarget) return

    try {
      setUploadingTarget(uploadTarget)
      enqueueSnackbar("Uploading image...", { variant: "info" })

      const file = e.target.files[0]
      const response = await uploadEquipmentImages([file]).unwrap()
      const uploadedUrl = response.data[0]
      console.log(uploadedUrl)
      console.log(uploadTarget)

      if (uploadTarget === "cover") {
        const res = await updateProfile({ coverPhoto: uploadedUrl }).unwrap()
        console.log(res)
      } else if (uploadTarget === "avatar") {
        await updateProfile({ avatar: uploadedUrl }).unwrap()
      }
      enqueueSnackbar("Profile updated successfully!", { variant: "success" })
    } catch (error) {
      console.error("Image upload failed:", error)
      enqueueSnackbar("Image upload failed. Please try again.", { variant: "error" })
    } finally {
      setUploadingTarget(null)
      setUploadTarget(null)
      if (fileInputRef.current) fileInputRef.current.value = "" 
    }
  }


  const capitalize = (str?: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const fullName = `${capitalize(profile?.firstName)} ${capitalize(profile?.lastName)}`;

  // const user = profileData?.data

  const getStageStyle = (status: "green" | "orange" | "gray") => {
    switch (status) {
      case "green":
        return "bg-primary"
      case "orange":
        return "bg-[#FEC84B]"
      case "gray":
      default:
        return "border border-[#DADADA]"
    }
  }

  const getStageIcon = (status: "green" | "orange" | "gray") => {
    if (status === "green") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.55156 18L3.85156 12.3L5.27656 10.875L9.55156 15.15L18.7266 5.97498L20.1516 7.39998L9.55156 18Z"
            fill="white"
          />
        </svg>
      )
    } else if (status === "orange") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
            fill="white"
          />
          <path
            d="M15.7106 15.93C15.5806 15.93 15.4506 15.9 15.3306 15.82L12.2306 13.97C11.4606 13.51 10.8906 12.5 10.8906 11.61V7.51001C10.8906 7.10001 11.2306 6.76001 11.6406 6.76001C12.0506 6.76001 12.3906 7.10001 12.3906 7.51001V11.61C12.3906 11.97 12.6906 12.5 13.0006 12.68L16.1006 14.53C16.4606 14.74 16.5706 15.2 16.3606 15.56C16.2106 15.8 15.9606 15.93 15.7106 15.93Z"
            fill="white"
          />
        </svg>
      )
    } else {
      return (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.6237 9.30207H2.3737C1.6137 9.30207 0.988281 8.67665 0.988281 7.91665V5.28831C0.988281 4.74998 1.36035 4.20373 1.8591 4.00582L8.98409 1.15583C9.28493 1.03708 9.71247 1.03708 10.0133 1.15583L17.1383 4.00582C17.6371 4.20373 18.0091 4.7579 18.0091 5.28831V7.91665C18.0091 8.67665 17.3837 9.30207 16.6237 9.30207ZM9.4987 2.24834C9.46703 2.24834 9.43538 2.2483 9.41955 2.25621L2.30243 5.10624C2.25493 5.12999 2.17578 5.2329 2.17578 5.28831V7.91665C2.17578 8.02748 2.26286 8.11457 2.3737 8.11457H16.6237C16.7345 8.11457 16.8216 8.02748 16.8216 7.91665V5.28831C16.8216 5.2329 16.7504 5.12999 16.695 5.10624L9.56997 2.25621C9.55414 2.2483 9.53036 2.24834 9.4987 2.24834Z"
            fill="#DADADA"
          />
          <path
            d="M17.4154 18.0104H1.58203C1.25745 18.0104 0.988281 17.7412 0.988281 17.4167V15.0417C0.988281 14.2817 1.6137 13.6562 2.3737 13.6562H16.6237C17.3837 13.6562 18.0091 14.2817 18.0091 15.0417V17.4167C18.0091 17.7412 17.7399 18.0104 17.4154 18.0104ZM2.17578 16.8229H16.8216V15.0417C16.8216 14.9308 16.7345 14.8437 16.6237 14.8437H2.3737C2.26286 14.8437 2.17578 14.9308 2.17578 15.0417V16.8229Z"
            fill="#DADADA"
          />
          <path
            d="M3.16797 14.8438C2.84339 14.8438 2.57422 14.5746 2.57422 14.25V8.70837C2.57422 8.38379 2.84339 8.11462 3.16797 8.11462C3.49255 8.11462 3.76172 8.38379 3.76172 8.70837V14.25C3.76172 14.5746 3.49255 14.8438 3.16797 14.8438Z"
            fill="#DADADA"
          />
          <path
            d="M6.33203 14.8438C6.00745 14.8438 5.73828 14.5746 5.73828 14.25V8.70837C5.73828 8.38379 6.00745 8.11462 6.33203 8.11462C6.65661 8.11462 6.92578 8.38379 6.92578 8.70837V14.25C6.92578 14.5746 6.65661 14.8438 6.33203 14.8438Z"
            fill="#DADADA"
          />
          <path
            d="M9.5 14.8438C9.17542 14.8438 8.90625 14.5746 8.90625 14.25V8.70837C8.90625 8.38379 9.17542 8.11462 9.5 8.11462C9.82458 8.11462 10.0938 8.38379 10.0938 8.70837V14.25C10.0938 14.5746 9.82458 14.8438 9.5 14.8438Z"
            fill="#DADADA"
          />
          <path
            d="M12.668 14.8438C12.3434 14.8438 12.0742 14.5746 12.0742 14.25V8.70837C12.0742 8.38379 12.3434 8.11462 12.668 8.11462C12.9926 8.11462 13.2617 8.38379 13.2617 8.70837V14.25C13.2617 14.5746 12.9926 14.8438 12.668 14.8438Z"
            fill="#DADADA"
          />
          <path
            d="M15.832 14.8438C15.5074 14.8438 15.2383 14.5746 15.2383 14.25V8.70837C15.2383 8.38379 15.5074 8.11462 15.832 8.11462C16.1566 8.11462 16.4258 8.38379 16.4258 8.70837V14.25C16.4258 14.5746 16.1566 14.8438 15.832 14.8438Z"
            fill="#DADADA"
          />
          <path
            d="M18.2096 18.0104H0.792969C0.468385 18.0104 0.199219 17.7412 0.199219 17.4166C0.199219 17.092 0.468385 16.8229 0.792969 16.8229H18.2096C18.5342 16.8229 18.8034 17.092 18.8034 17.4166C18.8034 17.7412 18.5342 18.0104 18.2096 18.0104Z"
            fill="#DADADA"
          />
          <path
            d="M9.5 7.32288C8.51833 7.32288 7.71875 6.52329 7.71875 5.54163C7.71875 4.55996 8.51833 3.76038 9.5 3.76038C10.4817 3.76038 11.2812 4.55996 11.2812 5.54163C11.2812 6.52329 10.4817 7.32288 9.5 7.32288ZM9.5 4.94788C9.17542 4.94788 8.90625 5.21704 8.90625 5.54163C8.90625 5.86621 9.17542 6.13538 9.5 6.13538C9.82458 6.13538 10.0938 5.86621 10.0938 5.54163C10.0938 5.21704 9.82458 4.94788 9.5 4.94788Z"
            fill="#DADADA"
          />
        </svg>
      )
    }
  }

  const handleLogout = useLogout()

  const feedbackCount = profile?.feedbacks?.length ?? 0;

  let reviewText: string;
  if (feedbackCount === 0) reviewText = "No reviews yet";
  else if (feedbackCount === 1) reviewText = "View the review";
  else reviewText = `View all ${feedbackCount} reviews`;

  return (
    <div className="container font-sans mx-auto px-4 py-8">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />

      <div className="flex flex-col md:flex-row">
        {/* Owner Profile Section */}
        <div className="w-full bg-white rounded-t-3xl md:w-1/3">
          <div className="relative mb-6">
            <div className="relative w-full h-44 rounded-t-3xl rounded-b-[30px] overflow-hidden">
              <Image
                src={profile?.coverPhoto || "/cover1.jpg"}
                alt="Profile background"
                fill
                className="object-cover"
              />
              {uploadingTarget === "cover" && (
                <div className="absolute inset-0 bg-black/40 hover:bg-black/70 cursor-pointer flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                onClick={() => {
                  setUploadTarget("cover")
                  fileInputRef.current?.click()
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 cursor-pointer text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h4l2-3h6l2 3h4v13H3V7z"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute -bottom-12 left-[37%] w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <Image
                src={profile?.avatar || "/user.svg"}
                alt={profile?.firstName || user.name || "User Avatar"}
                width={96}
                height={96}
                className="object-cover"
              />
              {uploadingTarget === "avatar" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                onClick={() => {
                  setUploadTarget("avatar")
                  fileInputRef.current?.click()
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h4l2-3h6l2 3h4v13H3V7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-16 px-8">
            <div className="flex flex-col items-center gap-2">
              {fullName || (profile as OtherUserProfile)?.businessName}
              {profile?.isVerify ? (
                <span className="text-xs text-primary bg-green-50 px-2 py-0.5 rounded">
                  Verified
                </span>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Unverified
                </span>
              )}
            </div>

            <div className="flex justify-center items-center mt-4">
              {/* <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(user.rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                  />
                ))}
              <span className="ml-2 font-semibold">{user.rating}</span>
              </div> */}
              <Link
                href={feedbackCount > 0 ? `/dashboard/user/owner/${user.id}/reviews` : "#"}
                className={`ml-4 flex items-center gap-2 text-sm ${
                  feedbackCount === 0
                    ? "text-gray-400 cursor-not-allowed pointer-events-none"
                    : "text-primary hover:underline"
                }`}
                aria-disabled={feedbackCount === 0}
              >
                {reviewText}
                <ChevronRight
                  className={feedbackCount === 0 ? "opacity-40" : "opacity-100"}
                />
              </Link>
            </div>

            {profile?.bio && <p className="mt-4 text-muted-foreground text-[12px] leading-relaxed">{profile?.bio}</p>}

            <div className="mt-6 space-y-6">
              {profile?.address && <div className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-[#F6FEF9] p-2">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00016 10.1964C6.40266 10.1964 5.09766 8.89893 5.09766 7.29393C5.09766 5.68893 6.40266 4.39893 8.00016 4.39893C9.59766 4.39893 10.9027 5.69643 10.9027 7.30143C10.9027 8.90643 9.59766 10.1964 8.00016 10.1964ZM8.00016 5.52393C7.02516 5.52393 6.22266 6.31893 6.22266 7.30143C6.22266 8.28393 7.01766 9.07893 8.00016 9.07893C8.98266 9.07893 9.77766 8.28393 9.77766 7.30143C9.77766 6.31893 8.97516 5.52393 8.00016 5.52393Z" fill="#12B76A"/>
                    <path d="M7.99928 16.6388C6.88928 16.6388 5.77178 16.2188 4.90178 15.3863C2.68928 13.2563 0.244278 9.85885 1.16678 5.81635C1.99928 2.14885 5.20178 0.506348 7.99928 0.506348C7.99928 0.506348 7.99928 0.506348 8.00678 0.506348C10.8043 0.506348 14.0068 2.14885 14.8393 5.82385C15.7543 9.86635 13.3093 13.2563 11.0968 15.3863C10.2268 16.2188 9.10928 16.6388 7.99928 16.6388ZM7.99928 1.63135C5.81678 1.63135 3.01178 2.79385 2.26928 6.06385C1.45928 9.59635 3.67928 12.6413 5.68928 14.5688C6.98678 15.8213 9.01928 15.8213 10.3168 14.5688C12.3193 12.6413 14.5393 9.59635 13.7443 6.06385C12.9943 2.79385 10.1818 1.63135 7.99928 1.63135Z" fill="#12B76A"/>
                  </svg>

                </div>
                <span>{profile?.address}</span>
              </div>}
              {profile?.email && <div className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-[#F6FEF9] p-2">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.95 4.184L8.637 9.412C8.45761 9.56063 8.23196 9.64196 7.999 9.64196C7.76604 9.64196 7.54039 9.56063 7.361 9.412L1.051 4.184C1.01714 4.28591 0.999922 4.39261 1 4.5V12.5C1 12.7652 1.10536 13.0196 1.29289 13.2071C1.48043 13.3946 1.73478 13.5 2 13.5H14C14.2652 13.5 14.5196 13.3946 14.7071 13.2071C14.8946 13.0196 15 12.7652 15 12.5V4.5C15.0004 4.39267 14.9835 4.28597 14.95 4.184ZM2 2.5H14C14.5304 2.5 15.0391 2.71071 15.4142 3.08579C15.7893 3.46086 16 3.96957 16 4.5V12.5C16 13.0304 15.7893 13.5391 15.4142 13.9142C15.0391 14.2893 14.5304 14.5 14 14.5H2C1.46957 14.5 0.960859 14.2893 0.585786 13.9142C0.210714 13.5391 0 13.0304 0 12.5V4.5C0 3.96957 0.210714 3.46086 0.585786 3.08579C0.960859 2.71071 1.46957 2.5 2 2.5ZM1.79 3.5L7.366 8.103C7.54459 8.2505 7.76884 8.33144 8.00046 8.33199C8.23209 8.33254 8.45672 8.25266 8.636 8.106L14.268 3.5H1.79Z" fill="#12B76A"/>
                  </svg>
                </div>
                <span>{profile?.email}</span>
              </div>}
              {profile?.phone && <div className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-[#F6FEF9] p-2"><Phone className="w-4 h-4 text-primary" /></div>
                <span>{profile?.phone}</span>
              </div>}
              <button
                  onClick={() => setViewMode(viewMode === "edit" ? "items" : "edit")}
                  className="flex items-center gap-2 text-primary text-sm hover:text-green-600"
                >
                  <div className="rounded-full bg-[#F6FEF9] p-2">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.69332 13.5134C3.28666 13.5134 2.90666 13.3734 2.63332 13.1134C2.28666 12.7868 2.11999 12.2934 2.17999 11.7601L2.42666 9.60011C2.47332 9.19345 2.71999 8.65345 3.00666 8.36011L8.47999 2.56678C9.84666 1.12011 11.2733 1.08011 12.72 2.44678C14.1667 3.81345 14.2067 5.24011 12.84 6.68678L7.36666 12.4801C7.08666 12.7801 6.56666 13.0601 6.15999 13.1268L4.01332 13.4934C3.89999 13.5001 3.79999 13.5134 3.69332 13.5134ZM10.62 2.44011C10.1067 2.44011 9.65999 2.76011 9.20666 3.24011L3.73332 9.04011C3.59999 9.18011 3.44666 9.51345 3.41999 9.70678L3.17332 11.8668C3.14666 12.0868 3.19999 12.2668 3.31999 12.3801C3.43999 12.4934 3.61999 12.5334 3.83999 12.5001L5.98666 12.1334C6.17999 12.1001 6.49999 11.9268 6.63332 11.7868L12.1067 5.99345C12.9333 5.11345 13.2333 4.30011 12.0267 3.16678C11.4933 2.65345 11.0333 2.44011 10.62 2.44011Z" fill="#12B76A"/>
                      <path d="M11.5609 7.79998C11.5476 7.79998 11.5276 7.79998 11.5143 7.79998C9.43428 7.59331 7.76094 6.01331 7.44094 3.94665C7.40094 3.67331 7.58761 3.41998 7.86094 3.37331C8.13427 3.33331 8.38761 3.51998 8.43427 3.79331C8.68761 5.40665 9.99427 6.64665 11.6209 6.80665C11.8943 6.83331 12.0943 7.07998 12.0676 7.35331C12.0343 7.60665 11.8143 7.79998 11.5609 7.79998Z" fill="#12B76A"/>
                      <path d="M14 15.6667H2C1.72667 15.6667 1.5 15.4401 1.5 15.1667C1.5 14.8934 1.72667 14.6667 2 14.6667H14C14.2733 14.6667 14.5 14.8934 14.5 15.1667C14.5 15.4401 14.2733 15.6667 14 15.6667Z" fill="#12B76A"/>
                    </svg>

                  </div>
                  {viewMode === "edit" ? "View listed items" : "Edit profile details"}
              </button>
              {!profile?.isVerify && <button
                  onClick={() => setVerifyType("NIN")}
                  className="flex items-center gap-2 text-primary text-sm hover:text-green-600"
                >
                  <div className="rounded-full bg-[#F6FEF9] p-2">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.00091 15.6733C7.27425 15.6733 6.55424 15.46 5.98758 15.04L3.12091 12.9C2.36091 12.3333 1.76758 11.1466 1.76758 10.2066V5.24663C1.76758 4.21996 2.52091 3.12663 3.48758 2.76663L6.81425 1.51996C7.47425 1.27329 8.51425 1.27329 9.17425 1.51996L12.5009 2.76663C13.4676 3.12663 14.2209 4.21996 14.2209 5.24663V10.2C14.2209 11.1466 13.6276 12.3266 12.8676 12.8933L10.0009 15.0333C9.44758 15.46 8.72758 15.6733 8.00091 15.6733ZM7.16758 2.45996L3.84091 3.70663C3.27424 3.91996 2.77424 4.63996 2.77424 5.25329V10.2066C2.77424 10.84 3.22091 11.7266 3.72091 12.1L6.58758 14.24C7.35425 14.8133 8.64758 14.8133 9.42091 14.24L12.2876 12.1C12.7942 11.72 13.2342 10.84 13.2342 10.2066V5.24663C13.2342 4.63996 12.7342 3.91996 12.1676 3.69996L8.84091 2.45329C8.38758 2.29329 7.61425 2.29329 7.16758 2.45996Z" fill="#12B76A"/>
                      <path d="M7.10682 9.98658C6.98016 9.98658 6.85349 9.93992 6.75349 9.83992L5.68016 8.76658C5.48682 8.57325 5.48682 8.25325 5.68016 8.05992C5.87349 7.86658 6.19349 7.86658 6.38682 8.05992L7.10682 8.77992L9.62016 6.26658C9.81349 6.07325 10.1335 6.07325 10.3268 6.26658C10.5202 6.45992 10.5202 6.77992 10.3268 6.97325L7.46016 9.83992C7.36016 9.93992 7.23349 9.98658 7.10682 9.98658Z" fill="#12B76A"/>
                    </svg>
                  </div>
                  NIN Verification
              </button>}
              { !profile?.isVerify && <button
                  onClick={() => setVerifyType("BVN")}
                  className="flex items-center gap-2 text-primary text-sm hover:text-green-600"
                >
                  <div className="rounded-full bg-[#F6FEF9] p-2">
                     <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.00091 15.6733C7.27425 15.6733 6.55424 15.46 5.98758 15.04L3.12091 12.9C2.36091 12.3333 1.76758 11.1466 1.76758 10.2066V5.24663C1.76758 4.21996 2.52091 3.12663 3.48758 2.76663L6.81425 1.51996C7.47425 1.27329 8.51425 1.27329 9.17425 1.51996L12.5009 2.76663C13.4676 3.12663 14.2209 4.21996 14.2209 5.24663V10.2C14.2209 11.1466 13.6276 12.3266 12.8676 12.8933L10.0009 15.0333C9.44758 15.46 8.72758 15.6733 8.00091 15.6733ZM7.16758 2.45996L3.84091 3.70663C3.27424 3.91996 2.77424 4.63996 2.77424 5.25329V10.2066C2.77424 10.84 3.22091 11.7266 3.72091 12.1L6.58758 14.24C7.35425 14.8133 8.64758 14.8133 9.42091 14.24L12.2876 12.1C12.7942 11.72 13.2342 10.84 13.2342 10.2066V5.24663C13.2342 4.63996 12.7342 3.91996 12.1676 3.69996L8.84091 2.45329C8.38758 2.29329 7.61425 2.29329 7.16758 2.45996Z" fill="#12B76A"/>
                      <path d="M7.10682 9.98658C6.98016 9.98658 6.85349 9.93992 6.75349 9.83992L5.68016 8.76658C5.48682 8.57325 5.48682 8.25325 5.68016 8.05992C5.87349 7.86658 6.19349 7.86658 6.38682 8.05992L7.10682 8.77992L9.62016 6.26658C9.81349 6.07325 10.1335 6.07325 10.3268 6.26658C10.5202 6.45992 10.5202 6.77992 10.3268 6.97325L7.46016 9.83992C7.36016 9.93992 7.23349 9.98658 7.10682 9.98658Z" fill="#12B76A"/>
                    </svg>
                  </div>
                  BVN Verification
              </button>}
              <button
                  onClick={() => setShowVerifyPhone(true)}
                  className="flex items-center gap-2 text-primary text-sm hover:text-green-600"
                >
                  <div className="rounded-full bg-[#F6FEF9] p-2">
                     <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0423 7.29158H7.29232V12.0416H5.70898V7.29158H0.958984V5.70825H5.70898V0.958252H7.29232V5.70825H12.0423V7.29158Z" fill="#12B76A"/>
                      </svg>
                  </div>
                  Add Number
              </button>
            </div>
          </div>

           {/* Account Card */}
          <div className="bg-white rounded-lg border border-[#97979726] m-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Payout account</h2>
              <Info className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-gray-600 mb-8">
              Provide your data and link bank account to receive payments for your items
            </p>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-3 place-content-center mb-8">
                <TabsTrigger
                  value="details"
                  className=""
                >
                  <div className="flex flex-col items-center">
                    <div 
                      className={`flex justify-center items-center h-8 w-8 rounded-full ${getStageStyle(accountStages.details)}`}
                    >
                        {getStageIcon(accountStages.details)}
                    </div>
                    <span className="text-xs">Your details</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="verification"
                  className=""
                >
                  <div className="flex flex-col items-center">
                    <div 
                      className={`flex justify-center items-center h-8 w-8 rounded-full ${getStageStyle(accountStages.verification)}`}
                    >
                        {getStageIcon(accountStages.verification)}
                    </div>
                    <span className="text-xs">Verification</span>
                  </div>
                </TabsTrigger>
                {/* data-[state=active]:bg-green-500 data-[state=active]:text-white */}
                <TabsTrigger value="bank" className="">
                  <div className="flex flex-col items-center">
                    <div 
                    className={`flex justify-center items-center h-8 w-8 rounded-full ${getStageStyle(accountStages.bank)}`}
                    >
                        {getStageIcon(accountStages.bank)}
                    </div>

                    <span className="text-xs">Bank account</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0">
                {accountStages.details === "green" ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700 text-sm">✓ Your profile details are complete and verified.</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      Please complete all required profile fields: first name, last name, address, country, and bio.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="verification" className="mt-0">
                {accountStages.verification === "green" ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700 text-sm">✓ Both NIN and BVN verification are complete.</p>
                  </div>
                ) : accountStages.verification === "orange" ? (
                  <div className="bg-[#F7D15F17] p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      Verification is in progress. Please complete both NIN and BVN verification.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      {accountStages.details === "green"
                        ? "Please complete NIN and BVN verification to proceed."
                        : "Complete your profile details first, then proceed with verification."}
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="bank" className="mt-0">
                {accountStages.bank === "green" ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700 text-sm">✓ Your bank account is linked and ready for payouts.</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      {accountStages.verification === "green"
                        ? "You can now add your bank account for payouts."
                        : "Complete verification first before linking your bank account."}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg  overflow-hidden">
            <button
              onClick={() => setViewMode(viewMode === "wallet" ? "items" : "wallet")}
              className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.828 15.1666H4.17464C2.51464 15.1666 1.16797 13.82 1.16797 12.16V7.6733C1.16797 6.0133 2.51464 4.66663 4.17464 4.66663H11.828C13.488 4.66663 14.8346 6.0133 14.8346 7.6733V8.6333C14.8346 8.90663 14.608 9.1333 14.3346 9.1333H12.988C12.7546 9.1333 12.5413 9.21996 12.388 9.37996L12.3813 9.38664C12.1946 9.56664 12.108 9.81328 12.128 10.0666C12.168 10.5066 12.588 10.8599 13.068 10.8599H14.3346C14.608 10.8599 14.8346 11.0866 14.8346 11.3599V12.1533C14.8346 13.8199 13.488 15.1666 11.828 15.1666ZM4.17464 5.66663C3.06797 5.66663 2.16797 6.56663 2.16797 7.6733V12.16C2.16797 13.2666 3.06797 14.1666 4.17464 14.1666H11.828C12.9346 14.1666 13.8346 13.2666 13.8346 12.16V11.8666H13.068C12.0613 11.8666 11.208 11.12 11.128 10.16C11.0746 9.61329 11.2746 9.07331 11.6746 8.67997C12.0213 8.32664 12.488 8.1333 12.988 8.1333H13.8346V7.6733C13.8346 6.56663 12.9346 5.66663 11.828 5.66663H4.17464Z" fill="#12B76A"/>
                    <path d="M1.66797 8.77338C1.39464 8.77338 1.16797 8.54671 1.16797 8.27338V5.22675C1.16797 4.23341 1.79464 3.33338 2.7213 2.98004L8.01464 0.980044C8.5613 0.773378 9.16797 0.846743 9.6413 1.18008C10.1213 1.51341 10.4013 2.05341 10.4013 2.63341V5.16673C10.4013 5.44006 10.1746 5.66673 9.9013 5.66673C9.62797 5.66673 9.4013 5.44006 9.4013 5.16673V2.63341C9.4013 2.38007 9.2813 2.14673 9.06797 2.00006C8.85464 1.8534 8.6013 1.82006 8.3613 1.91339L3.06797 3.91339C2.52797 4.12006 2.1613 4.64675 2.1613 5.22675V8.27338C2.16797 8.55338 1.9413 8.77338 1.66797 8.77338Z" fill="#12B76A"/>
                    <path d="M13.0657 11.8666C12.059 11.8666 11.2057 11.12 11.1257 10.16C11.0723 9.60662 11.2723 9.06663 11.6723 8.6733C12.0123 8.32663 12.479 8.1333 12.979 8.1333H14.3657C15.0257 8.1533 15.5323 8.67327 15.5323 9.31327V10.6866C15.5323 11.3266 15.0257 11.8466 14.3857 11.8666H13.0657ZM14.3523 9.1333H12.9857C12.7523 9.1333 12.539 9.21996 12.3857 9.37996C12.1923 9.56663 12.099 9.81995 12.1257 10.0733C12.1657 10.5133 12.5857 10.8666 13.0657 10.8666H14.3723C14.459 10.8666 14.539 10.7866 14.539 10.6866V9.31327C14.539 9.21327 14.459 9.13997 14.3523 9.1333Z" fill="#12B76A"/>
                    <path d="M9.33464 8.5H4.66797C4.39464 8.5 4.16797 8.27333 4.16797 8C4.16797 7.72667 4.39464 7.5 4.66797 7.5H9.33464C9.60797 7.5 9.83464 7.72667 9.83464 8C9.83464 8.27333 9.60797 8.5 9.33464 8.5Z" fill="#12B76A"/>
                </svg>

                <span>Wallet</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z" fill="#292D32"/>
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9987 15.1667H5.9987C2.3787 15.1667 0.832031 13.62 0.832031 10V6.00004C0.832031 2.38004 2.3787 0.833374 5.9987 0.833374H9.9987C13.6187 0.833374 15.1654 2.38004 15.1654 6.00004V10C15.1654 13.62 13.6187 15.1667 9.9987 15.1667ZM5.9987 1.83337C2.92536 1.83337 1.83203 2.92671 1.83203 6.00004V10C1.83203 13.0734 2.92536 14.1667 5.9987 14.1667H9.9987C13.072 14.1667 14.1654 13.0734 14.1654 10V6.00004C14.1654 2.92671 13.072 1.83337 9.9987 1.83337H5.9987Z" fill="#12B76A"/>
                    <path d="M11.9327 6.53337C11.9194 6.53337 11.8994 6.53337 11.886 6.53337C9.57936 6.30671 7.28603 6.21337 5.0127 6.4467L4.11936 6.53337C3.83936 6.56004 3.59936 6.36004 3.5727 6.08671C3.54603 5.81337 3.74603 5.5667 4.01936 5.54003L4.91269 5.45337C7.25269 5.22003 9.61269 5.3067 11.986 5.54003C12.2594 5.5667 12.4594 5.81337 12.4327 6.08671C12.406 6.34004 12.186 6.53337 11.9327 6.53337Z" fill="#12B76A"/>
                    <path d="M9.52763 6.0933C9.28763 6.0933 9.0743 5.91997 9.0343 5.67997L8.94097 5.1133C8.92764 5.01997 8.90096 4.8733 8.8743 4.83997C8.8743 4.83997 8.80764 4.79997 8.56764 4.79997H7.42097C7.1743 4.79997 7.10764 4.83997 7.10764 4.83997C7.0943 4.86663 7.06763 5.01331 7.0543 5.10664L6.96097 5.67997C6.9143 5.95331 6.6543 6.1333 6.38763 6.0933C6.1143 6.04664 5.9343 5.78664 5.9743 5.51997L6.06764 4.94664C6.14097 4.51997 6.26097 3.80664 7.42097 3.80664H8.56764C9.7343 3.80664 9.8543 4.5533 9.92097 4.9533L10.0143 5.51997C10.061 5.7933 9.8743 6.0533 9.60764 6.0933C9.58764 6.0933 9.5543 6.0933 9.52763 6.0933Z" fill="#12B76A"/>
                    <path d="M9.4013 12.2067H6.59463C4.90797 12.2067 4.83463 11.1934 4.78796 10.52L4.5013 6.11337C4.4813 5.84004 4.69463 5.60004 4.96796 5.58004C5.24796 5.56004 5.4813 5.77338 5.5013 6.04671L5.78796 10.4467C5.83463 11.1 5.8413 11.2 6.59463 11.2H9.4013C10.1546 11.2 10.1613 11.1 10.208 10.4467L10.4946 6.04671C10.5146 5.77338 10.7413 5.56004 11.028 5.58004C11.3013 5.60004 11.5146 5.83337 11.4946 6.11337L11.208 10.5134C11.1613 11.1934 11.0946 12.2067 9.4013 12.2067Z" fill="#12B76A"/>
                </svg>
                <span>Delete account permanently</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z" fill="#292D32"/>
              </svg>

            </button>
            <button onClick={handleLogout} className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.9987 15.1667C4.04536 15.1667 0.832031 11.9534 0.832031 8.00004C0.832031 4.04671 4.04536 0.833374 7.9987 0.833374C8.27203 0.833374 8.4987 1.06004 8.4987 1.33337C8.4987 1.60671 8.27203 1.83337 7.9987 1.83337C4.5987 1.83337 1.83203 4.60004 1.83203 8.00004C1.83203 11.4 4.5987 14.1667 7.9987 14.1667C11.3987 14.1667 14.1654 11.4 14.1654 8.00004C14.1654 7.72671 14.392 7.50004 14.6654 7.50004C14.9387 7.50004 15.1654 7.72671 15.1654 8.00004C15.1654 11.9534 11.952 15.1667 7.9987 15.1667Z" fill="#F04438"/>
                    <path d="M8.6663 7.83329C8.53964 7.83329 8.41297 7.78662 8.31297 7.68662C8.11964 7.49329 8.11964 7.17329 8.31297 6.97995L13.7796 1.51329C13.973 1.31995 14.293 1.31995 14.4863 1.51329C14.6796 1.70662 14.6796 2.02662 14.4863 2.21995L9.01964 7.68662C8.91964 7.78662 8.79297 7.83329 8.6663 7.83329Z" fill="#F04438"/>
                    <path d="M14.6653 5.05337C14.392 5.05337 14.1653 4.82671 14.1653 4.55337V1.83337H11.4453C11.172 1.83337 10.9453 1.60671 10.9453 1.33337C10.9453 1.06004 11.172 0.833374 11.4453 0.833374H14.6653C14.9386 0.833374 15.1653 1.06004 15.1653 1.33337V4.55337C15.1653 4.82671 14.9386 5.05337 14.6653 5.05337Z" fill="#F04438"/>
                </svg>
                <span>Log out</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z" fill="#292D32"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Listed Items or Edit Section */}
        <div className="w-full md:w-2/3 mx-4">

            {viewMode === "edit" && <ProfileEditForm profile={profile} onCancel={() => setViewMode("items")} />}

            {viewMode === "wallet" && <WalletView balance={100000} transactions={transactions} />}
            {viewMode === "items" &&
            <>
                <h2 className="text-2xl font-bold mb-6">Listed items</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 overflow-auto hide-scrollbar md:-mr-10 mx-auto max-w-[1600px] justify-center place-items-stretch scroll-smooth gap-2">
                    {userEquipments?.equipments?.map((item) => (
                    <EquipmentCard key={item.id} {...item} variant="profile" />
                    ))}
                </div>
            </>
          }
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <SuccessModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
        description="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data, listings, and rental history will be permanently removed."
        icon="warning"
        actionLabel={isLoading ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onAction={() => handleDeleteAccount(userId!)}
      />

      <VerifyNinModal
        isOpen={!!verifyType}
        onClose={() => setVerifyType(null)}
        verifyText={verifyType ?? ""}
      />

      <VerifyPhoneModal
        isOpen={showVerifyPhone}
        onClose={() => setShowVerifyPhone(false)}
      />
    </div>
  )
}
