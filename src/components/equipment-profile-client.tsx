"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGetEquipmentByIdQuery, useUpdateEquipmentAvailabilityMutation } from "@/lib/redux/api/equipmentApi"
import Link from "next/link"
import { AnimatedLogo } from "./loading-logo"
import { enqueueSnackbar } from "notistack"

interface EquipmentIdProps {
  equipmentId: string
}

export default function EquipmentProfileClient({ equipmentId }: EquipmentIdProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()

  const { data: equipmentData, isLoading, error, isError } = useGetEquipmentByIdQuery(equipmentId)
  const [updateAvailability, { isLoading: isUpdatingAvailability }] = useUpdateEquipmentAvailabilityMutation()

  const isAvailable = equipmentData?.availability ?? true

  const handleAvailabilityToggle = async () => {
    if (!equipmentData) return
    const nextAvailability = !isAvailable
    try {
      await updateAvailability({ equipmentId, availability: nextAvailability }).unwrap()
      enqueueSnackbar(
        nextAvailability ? "Equipment is now available for rent." : "Equipment is now unavailable.",
        { variant: "success" }
      )
    } catch {
      enqueueSnackbar("Failed to update availability. Please try again.", { variant: "error" })
    }
  }

  // console.log("📊 Query state:", {
  //   data: equipmentData,
  //   isLoading,
  //   error,
  //   isError,
  //   equipmentId,
  // })

  // Loading state
  if (isLoading) {
    return (
      <AnimatedLogo />
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading equipment</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm text-left overflow-auto mb-4">
            {JSON.stringify(error, null, 2)}
          </pre>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // If no data, return null
  if (!equipmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No equipment data found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 font-sans md:mx-[212px] pt-4 md:mt-10">
      <header className="text-[23px] flex items-center justify-between gap-3 font-[700]">
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
          Item Detail
        </div>
        <Link href={`/dashboard/profile/equipment/${equipmentId}/edit`} className="text-[#12B76A] cursor-pointer font-normal text-[23px]">Edit</Link>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Image Gallery */}
        <div className="w-full bg-white p-4 rounded-lg lg:flex-2">
          <div className="relative aspect-[4/3] md:h-[370px] w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={equipmentData.media[selectedImage] || equipmentData.imageUrl || "/placeholder.svg"}
              alt={equipmentData.name}
              fill
              className="object-cover"
              priority
            />
          </div>

        
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {equipmentData.media.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? "border-[#12B76A]" : "border-transparent"
                  }`}
                >
                  <Image src={image || "/placeholder.svg"} alt={`View ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            <div className="md:flex mt-3 gap-4 items-center">
              <p className="font-bold text-2xl text-[#000000]">{equipmentData.name}</p>
              <div className="">
                <span className="text-lg font-medium text-primary">₦{equipmentData.pricePerDay.toLocaleString()}</span>
                <span className="text-xs text-[#979797] ml-2">Per day</span>
              </div>
            </div>
          
            <div className="flex items-start gap-2 text-[#979797] mt-6">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.7142 9.34384C6.34503 9.34384 5.22656 8.2318 5.22656 6.85621C5.22656 5.48061 6.34503 4.375 7.7142 4.375C9.08336 4.375 10.2018 5.48704 10.2018 6.86263C10.2018 8.23822 9.08336 9.34384 7.7142 9.34384ZM7.7142 5.3392C6.87856 5.3392 6.19076 6.02057 6.19076 6.86263C6.19076 7.7047 6.87213 8.38607 7.7142 8.38607C8.55626 8.38607 9.23763 7.7047 9.23763 6.86263C9.23763 6.02057 8.54983 5.3392 7.7142 5.3392Z" fill="#979797"/>
                    <path d="M7.7148 14.8654C6.76346 14.8654 5.80568 14.5055 5.06004 13.792C3.16378 11.9664 1.06825 9.05453 1.8589 5.58984C2.5724 2.44655 5.31716 1.03882 7.7148 1.03882C7.7148 1.03882 7.7148 1.03882 7.72123 1.03882C10.1189 1.03882 12.8636 2.44655 13.5771 5.59627C14.3613 9.06095 12.2658 11.9664 10.3696 13.792C9.62391 14.5055 8.66614 14.8654 7.7148 14.8654ZM7.7148 2.00302C5.84425 2.00302 3.44018 2.99936 2.80381 5.80196C2.10959 8.82955 4.01227 11.4393 5.73498 13.0913C6.84702 14.1648 8.58901 14.1648 9.70105 13.0913C11.4173 11.4393 13.32 8.82955 12.6386 5.80196C11.9958 2.99936 9.58535 2.00302 7.7148 2.00302Z" fill="#979797"/>
                </svg>

              <span className="text-lg text-[13.22px]">{equipmentData.address}</span>
            </div>

            <div className="mt-2 text-[12px]">
                <h2 className="text-xl font-medium">Description</h2>
                <p className="mt-2 text-[#979797] whitespace-pre-line">{equipmentData.description}</p>

                <div className="mt-6 justify-center md:justify-normal flex gap-4">
                <div className="flex bg-[#F6FEF9] items-center gap-1 md:gap-2 rounded-md text-[10px] border border-[#12B76A] px-2 md:px-4 py-2 text-[#12B76A]">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.0404 7.12501C15.0407 6.17097 14.7948 5.233 14.3263 4.4019C13.8579 3.57079 13.1828 2.8747 12.3664 2.381C11.5501 1.8873 10.6201 1.61272 9.66647 1.58384C8.71287 1.55496 7.76796 1.77275 6.92322 2.21614C6.07847 2.65952 5.3625 3.31349 4.84461 4.11472C4.32672 4.91595 4.02445 5.83732 3.96707 6.78963C3.90968 7.74193 4.09912 8.69293 4.51704 9.55055C4.93497 10.4082 5.56723 11.1434 6.35262 11.685L3.95703 15.8333L5.74303 15.907L6.69937 17.4167L9.44328 12.6635L9.4987 12.6667C9.52641 12.6683 9.53512 12.6643 9.55412 12.6635L12.298 17.4167L13.2734 15.9394L15.0404 15.8333L12.6448 11.685C13.3839 11.1761 13.9882 10.4951 14.4055 9.70073C14.8228 8.90633 15.0407 8.02236 15.0404 7.12501ZM5.54037 7.12501C5.54037 6.34212 5.77252 5.57682 6.20746 4.92588C6.64241 4.27493 7.26062 3.76758 7.98391 3.46798C8.7072 3.16839 9.50309 3.09 10.2709 3.24273C11.0388 3.39547 11.7441 3.77246 12.2977 4.32604C12.8512 4.87963 13.2282 5.58493 13.381 6.35278C13.5337 7.12062 13.4553 7.91651 13.1557 8.6398C12.8561 9.36309 12.3488 9.98129 11.6978 10.4162C11.0469 10.8512 10.2816 11.0833 9.4987 11.0833C8.44888 11.0833 7.44207 10.6663 6.69973 9.92397C5.9574 9.18164 5.54037 8.17482 5.54037 7.12501Z"
                        fill="#12B76A"
                    />
                    <path
                        d="M9.5 9.5C10.8117 9.5 11.875 8.43668 11.875 7.125C11.875 5.81332 10.8117 4.75 9.5 4.75C8.18832 4.75 7.125 5.81332 7.125 7.125C7.125 8.43668 8.18832 9.5 9.5 9.5Z"
                        fill="#12B76A"
                    />
                    </svg>
                    <span className="whitespace-nowrap">Guaranteed</span>
                </div>
                <div className="flex bg-[#F6FEF9] items-center gap-1 md:gap-2 rounded-md text-[10px] border border-[#12B76A] px-2 md:px-4 py-2 text-[#12B76A]">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.1875 5.04688C1.1875 4.2275 1.8525 3.5625 2.67188 3.5625H13.9531C14.7725 3.5625 15.4375 4.2275 15.4375 5.04688V11.5781C15.4375 12.3975 14.7725 13.0625 13.9531 13.0625H2.67188C1.8525 13.0625 1.1875 12.3975 1.1875 11.5781V5.04688ZM4.75 5.34375V4.75H3.5625V5.34375C3.5625 5.50122 3.49994 5.65224 3.38859 5.76359C3.27724 5.87494 3.12622 5.9375 2.96875 5.9375H2.375V7.125H2.96875C3.44117 7.125 3.89423 6.93733 4.22828 6.60328C4.56233 6.26923 4.75 5.81617 4.75 5.34375ZM10.6875 8.3125C10.6875 7.68261 10.4373 7.07852 9.99188 6.63312C9.54648 6.18772 8.94239 5.9375 8.3125 5.9375C7.68261 5.9375 7.07852 6.18772 6.63312 6.63312C6.18772 7.07852 5.9375 7.68261 5.9375 8.3125C5.9375 8.94239 6.18772 9.54648 6.63312 9.99188C7.07852 10.4373 7.68261 10.6875 8.3125 10.6875C8.94239 10.6875 9.54648 10.4373 9.99188 9.99188C10.4373 9.54648 10.6875 8.94239 10.6875 8.3125ZM13.0625 4.75H11.875V5.34375C11.875 5.81617 12.0627 6.26923 12.3967 6.60328C12.7308 6.93733 13.1838 7.125 13.6562 7.125H14.25V5.9375H13.6562C13.4988 5.9375 13.3478 5.87494 13.2364 5.76359C13.1251 5.65224 13.0625 5.50122 13.0625 5.34375V4.75ZM4.75 11.2812C4.75 10.8088 4.56233 10.3558 4.22828 10.0217C3.89423 9.68767 3.44117 9.5 2.96875 9.5H2.375V10.6875H2.96875C3.12622 10.6875 3.27724 10.7501 3.38859 10.8614C3.49994 10.9728 3.5625 11.1238 3.5625 11.2812V11.875H4.75V11.2812ZM13.0625 11.875V11.2812C13.0625 11.1238 13.1251 10.9728 13.2364 10.8614C13.3478 10.7501 13.4988 10.6875 13.6562 10.6875H14.25V9.5H13.6562C13.1838 9.5 12.7308 9.68767 12.3967 10.0217C12.0627 10.3558 11.875 10.8088 11.875 11.2812V11.875H13.0625ZM5.34375 15.4375C4.96757 15.4376 4.60101 15.3187 4.29659 15.0977C3.99218 14.8767 3.76555 14.565 3.64919 14.2072C3.81385 14.2357 3.98288 14.25 4.15625 14.25H13.9531C14.6617 14.25 15.3414 13.9685 15.8424 13.4674C16.3435 12.9664 16.625 12.2867 16.625 11.5781V6.03844C16.9724 6.16127 17.2732 6.38885 17.4859 6.68979C17.6986 6.99074 17.8127 7.35024 17.8125 7.71875V11.5781C17.8125 12.0849 17.7127 12.5868 17.5187 13.055C17.3248 13.5233 17.0405 13.9487 16.6821 14.3071C16.3237 14.6655 15.8983 14.9498 15.43 15.1437C14.9618 15.3377 14.4599 15.4375 13.9531 15.4375H5.34375Z"
                        fill="#12B76A"
                    />
                    </svg>
                    <span className="whitespace-nowrap">Money back</span>
                </div>
                </div>

                <div className="mt-4 flex items-center gap-6">
                  <p className="text-[10px] md:text-sm text-[#000000]">
                    Switch off to make your product unavailable.
                  </p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAvailable}
                    disabled={isUpdatingAvailability}
                    onClick={handleAvailabilityToggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 ${
                      isAvailable ? "bg-[#12B76A]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        isAvailable ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
