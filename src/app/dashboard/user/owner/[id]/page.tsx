import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Phone, ChevronRight } from "lucide-react"
import { EquipmentCard } from "@/components/equipment-card"

async function getOwnerData(id: string) {
  // This would be replaced with your actual data fetching logic
  return {
    id,
    name: "Thankgod ogbonna",
    verified: true,
    rating: 4.5,
    totalReviews: 17,
    bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
    location: "7 Woji Port harcout",
    phone: "09124639133",
    profileImage: "/tg.svg",
    listedItems: [
      {
        id: "1",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "2",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "3",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "4",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "5",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "6",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
    ],
  }
}

export default async function OwnerProfilePage({ params }: { params: { id: string } }) {
  const owner = await getOwnerData(params.id)

  return (
    <div className="container font-sans mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Owner Profile Section */}
        <div className="w-full bg-white rounded-t-3xl pb-6 md:pb-0 rounded-b-3xl md:rounded-b-none md:mt-14 md:w-1/3">
          <div className="relative mb-6">
            <div className="relative w-full h-44 rounded-t-3xl rounded-b-[30px] overflow-hidden">
              <Image src="/profile-bg.svg" alt="Profile background" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-12 left-[37%] w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <Image
                src="/tg.svg"
                alt={owner.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-16 px-8">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-base text-center font-bold">{owner.name}</h1>
              {owner.verified && (
                <span className="text-xs text-primary bg-green-50 px-2 py-0.5 rounded">Verified</span>
              )}
            </div>

            <div className="flex items-center mt-2">
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
            </div>

            <p className="mt-4 text-muted-foreground text-[12px] leading-relaxed">{owner.bio}</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{owner.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary" />
                <span>{owner.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listed Items Section */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Listed items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 overflow-auto hide-scrollbar md:-mr-10 lg:grid-cols-3 gap-x-16 gap-4">
            {owner.listedItems.map((item) => (
              <EquipmentCard key={item.id} {...item} variant="default"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
