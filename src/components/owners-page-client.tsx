"use client"

import Image from "next/image"
// import Link from "next/link"
import { ChevronRight, MapPin, Phone } from "lucide-react"
import { EquipmentCard } from "@/components/equipment-card"
import { useGetEquipmentsQuery } from "@/lib/redux/api/equipmentApi"
import { useGetOtherUserProfileQuery, useGetProfileQuery } from "@/lib/redux/api/authApi"
import { AnimatedLogo } from "./loading-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// async function getOwnerData(id: string) {
//   // This would be replaced with your actual data fetching logic
//   return {
//     id,
//     name: "Thankgod ogbonna",
//     verified: true,
//     rating: 4.5,
//     totalReviews: 17,
//     bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
//     location: "7 Woji Port harcout",
//     phone: "09124639133",
//     profileImage: "/tg.svg",
//     listedItems: [
//       {
//         id: "1",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "2",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "3",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "4",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "5",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "6",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//     ],
//   }
// }

interface EquipmentIdProps {
  userId: string
}

export default function OwnerProfileClient({ userId }: EquipmentIdProps) {
  const router = useRouter()

  const { data: userEquipments, isLoading: isLoadingUserEquipments } = useGetEquipmentsQuery({ userId })

  const { data: profileData, isLoading: profileDataLoading } = useGetProfileQuery()

  const LoggedInuserId = profileData?.data?.user?._id

  useEffect(() => {
    if (!profileDataLoading && LoggedInuserId && LoggedInuserId === userId) {
      router.replace("/dashboard/profile")
    }
  }, [LoggedInuserId, userId, profileDataLoading, router])


  const { data: ownerProfile, isLoading: profileLoading } = useGetOtherUserProfileQuery(userId!, {
    skip: !userId,
  })

   console.log(ownerProfile)

  if (isLoadingUserEquipments || profileLoading) {
    return <AnimatedLogo />
  }

  if (!userEquipments || !ownerProfile) {
    return <p>Owner not found.</p>
  }

  const feedbackCount = ownerProfile?.data?.user.feedbacks?.length ?? 0;

  let reviewText: string;
  if (feedbackCount === 0) reviewText = "No reviews yet";
  else if (feedbackCount === 1) reviewText = "View the review";
  else reviewText = `View all ${feedbackCount} reviews`;


  return (
    <div className="container relative font-sans mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* Owner Profile Section */}
        <div className="w-full max-h-screen bg-white sticky rounded-t-3xl pb-6 md:pb-4 rounded-b-3xl md:rounded-b-none md:mt-14 md:w-1/3">
          <div className="relative mb-6">
            <div className="relative w-full h-44 rounded-t-3xl rounded-b-[30px] overflow-hidden">
              <Image src={ownerProfile?.data.user.coverPhoto || "/cover1.jpg"} alt="Profile background" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-12 left-[37%] w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <Image
                src={ownerProfile?.data.user.avatar || "/user.svg"}
                alt={`${ownerProfile?.data.user.firstName} ${ownerProfile?.data.user.lastName}`}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-16 px-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-base text-center font-bold">{ownerProfile?.data.user.firstName} {ownerProfile?.data.user.lastName}</h1>
              {ownerProfile?.data.user.isVerify && (
                <span className="text-xs text-primary bg-green-50 px-2 py-0.5 rounded">Verified</span>
              )}
            </div>

            <div className="flex justify-center items-center mt-2">
              {/* <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(owner.rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="ml-2 font-semibold">{owner.rating}</span> */}
              <Link
                href={feedbackCount > 0 ? `/dashboard/user/owner/${ownerProfile?.data.user._id}/reviews` : "#"}
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

            {ownerProfile?.data.user.bio ? (
              <p className="mt-4 text-black text-[12px] leading-relaxed">{ownerProfile?.data.user.bio}</p>
            ) : (
              <p className="mt-4 text-black text-[12px] leading-relaxed">No bio data yet.</p>
            )}

            <div className="mt-6 space-y-3">
              {ownerProfile?.data.user.address ? (
                <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{ownerProfile?.data.user.address}</span>
              </div>
              ): (
                null
              )}
              {ownerProfile?.data.user.phone ? (
                <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary" />
                <span>{ownerProfile?.data.user.phone}</span>
              </div>
              ) : (
                null
              )}
            </div>
          </div>
        </div>

        {/* Listed Items Section */}
        <div className="w-full md:w-2/3 mx-4">
          <h2 className="text-2xl font-bold mb-6">Listed items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 overflow-auto hide-scrollbar md:-mr-10 mx-auto max-w-[1600px] justify-center place-items-stretch scroll-smooth gap-2">
            {userEquipments?.equipments?.map((item) => (
              <EquipmentCard key={item.id} {...item} variant="default"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
