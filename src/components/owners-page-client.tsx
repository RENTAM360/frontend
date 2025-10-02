"use client"

import Image from "next/image"
// import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { EquipmentCard } from "@/components/equipment-card"
import { useGetEquipmentsQuery } from "@/lib/redux/api/equipmentApi"
import { useGetOtherUserProfileQuery } from "@/lib/redux/api/authApi"
import { AnimatedLogo } from "./loading-logo"

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

  const { data: userEquipments, isLoading: isLoadingUserEquipments } = useGetEquipmentsQuery({ userId })

  console.log(userEquipments)


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

  return (
    <div className="container font-sans mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Owner Profile Section */}
        <div className="w-full bg-white rounded-t-3xl pb-6 md:pb-4 rounded-b-3xl md:rounded-b-none md:mt-14 md:w-1/3">
          <div className="relative mb-6">
            <div className="relative w-full h-44 rounded-t-3xl rounded-b-[30px] overflow-hidden">
              <Image src="/profile-bg.svg" alt="Profile background" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-12 left-[37%] w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <Image
                src={ownerProfile?.data.avatar}
                alt={`${ownerProfile?.data.firstName} ${ownerProfile?.data.lastName}`}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-16 px-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-base text-center font-bold">{ownerProfile?.data.firstName} {ownerProfile?.data.lastName}</h1>
              {ownerProfile?.data.isVerify && (
                <span className="text-xs text-primary bg-green-50 px-2 py-0.5 rounded">Verified</span>
              )}
            </div>

            {/* <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(owner.rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="ml-2 font-semibold">{owner.rating}</span>
              <Link href={`/dashboard/user/owner/${owner.id}/reviews`} className="ml-4 flex items-center gap-2 text-primary text-sm">
                All {owner.totalReviews} reviews <ChevronRight />
              </Link>
            </div> */}

            {ownerProfile?.data.bio ? (
              <p className="mt-4 text-black text-[12px] leading-relaxed">{ownerProfile?.data.bio}</p>
            ) : (
              <p className="mt-4 text-black text-[12px] leading-relaxed">No bio data yet.</p>
            )}

            <div className="mt-6 space-y-3">
              {ownerProfile?.data.address ? (
                <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{ownerProfile?.data.address}</span>
              </div>
              ): (
                null
              )}
              {ownerProfile?.data.phone ? (
                <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary" />
                <span>{ownerProfile?.data.phone}</span>
              </div>
              ) : (
                null
              )}
            </div>
          </div>
        </div>

        {/* Listed Items Section */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Listed items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar md:-mr-10 lg:grid-cols-3 gap-x-16 gap-4">
            {userEquipments?.equipments?.map((item) => (
              <EquipmentCard key={item.id} {...item} variant="default"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
