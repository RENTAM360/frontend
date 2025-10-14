"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGetEquipmentByIdQuery } from "@/lib/redux/api/equipmentApi"
import Link from "next/link"
import Map from "@/components/map"
import { useEffect, useState } from "react"
import { getAddress } from "./address-converter"

const mockEquipmentData = {
  id: "1",
  title: "Toyota Camry for Rent – Smooth, Stylish, and Reliable!",
  description:
    "Looking for a comfortable and fuel-efficient ride? Our Toyota Camry is the perfect choice! Whether it's for a business trip, weekend getaway, or city cruising, this sedan offers:",
  features: [
    {
      icon: "🚗",
      text: "Smooth Performance – Powerful engine with excellent fuel efficiency.",
    },
    {
      icon: "👔",
      text: "Spacious & Comfortable – Premium interior with ample legroom.",
    },
    {
      icon: "🎮",
      text: "Modern Features – Bluetooth, touchscreen display, and premium sound system.",
    },
    {
      icon: "🛡️",
      text: "Safe & Reliable – Advanced safety features for a worry-free drive.",
    },
  ],
  callToAction: "Rent this stylish Camry today and enjoy a seamless driving experience! Book now!",
  guarantees: [
    {
      icon: (
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
      ),
      text: "Guaranteed Car",
    },
    {
      icon: (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.1875 5.04688C1.1875 4.2275 1.8525 3.5625 2.67188 3.5625H13.9531C14.7725 3.5625 15.4375 4.2275 15.4375 5.04688V11.5781C15.4375 12.3975 14.7725 13.0625 13.9531 13.0625H2.67188C1.8525 13.0625 1.1875 12.3975 1.1875 11.5781V5.04688ZM4.75 5.34375V4.75H3.5625V5.34375C3.5625 5.50122 3.49994 5.65224 3.38859 5.76359C3.27724 5.87494 3.12622 5.9375 2.96875 5.9375H2.375V7.125H2.96875C3.44117 7.125 3.89423 6.93733 4.22828 6.60328C4.56233 6.26923 4.75 5.81617 4.75 5.34375ZM10.6875 8.3125C10.6875 7.68261 10.4373 7.07852 9.99188 6.63312C9.54648 6.18772 8.94239 5.9375 8.3125 5.9375C7.68261 5.9375 7.07852 6.18772 6.63312 6.63312C6.18772 7.07852 5.9375 7.68261 5.9375 8.3125C5.9375 8.94239 6.18772 9.54648 6.63312 9.99188C7.07852 10.4373 7.68261 10.6875 8.3125 10.6875C8.94239 10.6875 9.54648 10.4373 9.99188 9.99188C10.4373 9.54648 10.6875 8.94239 10.6875 8.3125ZM13.0625 4.75H11.875V5.34375C11.875 5.81617 12.0627 6.26923 12.3967 6.60328C12.7308 6.93733 13.1838 7.125 13.6562 7.125H14.25V5.9375H13.6562C13.4988 5.9375 13.3478 5.87494 13.2364 5.76359C13.1251 5.65224 13.0625 5.50122 13.0625 5.34375V4.75ZM4.75 11.2812C4.75 10.8088 4.56233 10.3558 4.22828 10.0217C3.89423 9.68767 3.44117 9.5 2.96875 9.5H2.375V10.6875H2.96875C3.12622 10.6875 3.27724 10.7501 3.38859 10.8614C3.49994 10.9728 3.5625 11.1238 3.5625 11.2812V11.875H4.75V11.2812ZM13.0625 11.875V11.2812C13.0625 11.1238 13.1251 10.9728 13.2364 10.8614C13.3478 10.7501 13.4988 10.6875 13.6562 10.6875H14.25V9.5H13.6562C13.1838 9.5 12.7308 9.68767 12.3967 10.0217C12.0627 10.3558 11.875 10.8088 11.875 11.2812V11.875H13.0625ZM5.34375 15.4375C4.96757 15.4376 4.60101 15.3187 4.29659 15.0977C3.99218 14.8767 3.76555 14.565 3.64919 14.2072C3.81385 14.2357 3.98288 14.25 4.15625 14.25H13.9531C14.6617 14.25 15.3414 13.9685 15.8424 13.4674C16.3435 12.9664 16.625 12.2867 16.625 11.5781V6.03844C16.9724 6.16127 17.2732 6.38885 17.4859 6.68979C17.6986 6.99074 17.8127 7.35024 17.8125 7.71875V11.5781C17.8125 12.0849 17.7127 12.5868 17.5187 13.055C17.3248 13.5233 17.0405 13.9487 16.6821 14.3071C16.3237 14.6655 15.8983 14.9498 15.43 15.1437C14.9618 15.3377 14.4599 15.4375 13.9531 15.4375H5.34375Z"
            fill="#12B76A"
          />
        </svg>
      ),
      text: "Money back Guarantee",
    },
  ],
  images: ["/excavator.svg", "/generator.svg", "/keyboard.svg", "/toyota-black.svg", "/toyota-red.svg"],
  price: 50000,
  location: "Rivers, Port harcourt, 7 woji road",
  phoneNumber: "08107355412",
  category: "Vehicles",
  rating: 4.5,
  owner: {
    id: "1",
    name: "Thankgod Ogbonna",
    image: "/tg.svg",
    verified: true,
  },
  feedback: [
    {
      id: "feedback1",
      user: {
        id: "user1",
        name: "David Okwudiri",
        image: "/david.svg",
      },
      text: "Good guy... helped follow up with installation",
      rating: "positive", // positive, neutral, negative
      timeAgo: "2 d",
      likes: 0,
      replies: 1,
    },
    // More feedback items would go here
  ],
  totalFeedback: 24,
}

interface LocationPageProps {
 equipmentId: string
}

export default function EquipmentLocationClient({ equipmentId }: LocationPageProps) {
  const router = useRouter()
  const [address, setAddress] = useState("");

  const { data: equipmentData, isLoading, isError } = useGetEquipmentByIdQuery(equipmentId)
  console.log(equipmentData?.media)

  const handleBookNow = () => {
    window.location.href = `/dashboard/checkout?id=${equipmentId}`
  }

    useEffect(() => {
        const fetchAddress = async () => {
        if (!equipmentData?.location?.coordinates?.coordinates) return;

        // Your coordinates are stored [lon, lat]
        const [lon, lat] = equipmentData.location.coordinates.coordinates;
        const addr = await getAddress(lat, lon); 
        setAddress(addr);
        };

        fetchAddress();
    }, [equipmentData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12B76A] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading location...</h2>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading location</h2>
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
          <h2 className="text-xl font-semibold">No location data found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans pt-4 md:mt-10">
      <header className="text-[23px] flex items-center gap-3 font-[700]">
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
        Location
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Large Map */}
        <div className="w-full bg-white p-4 rounded-lg lg:flex-2">
          <div className="relative h-[500px] z-0 w-full rounded-lg">
            {typeof window !== "undefined" && (
                <Map imageUrl={equipmentData.media[0]} title={equipmentData.title} lat={equipmentData.location.coordinates.coordinates[1]} long={equipmentData.location.coordinates.coordinates[0]}/>
            )}
            {/* {typeof window !== "undefined" && (
              <MapContainer
                center={[
                  equipmentData.location.coordinates.coordinates[1],
                  equipmentData.location.coordinates.coordinates[0],
                ]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    equipmentData.location.coordinates.coordinates[1],
                    equipmentData.location.coordinates.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">{equipmentData.title}</h3>
                      <p className="text-sm text-gray-600">Equipment Location</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            )} */}
          </div>
        </div>

        {/* Right side - Same Details as Equipment Page */}
        <div className="w-full lg:flex-1 rounded-lg">
          {/* Top Block - Location and Price */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-start gap-2 text-[#979797] mb-4">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.7142 9.34384C6.34503 9.34384 5.22656 8.2318 5.22656 6.85621C5.22656 5.48061 6.34503 4.375 7.7142 4.375C9.08336 4.375 10.2018 5.48704 10.2018 6.86263C10.2018 8.23822 9.08336 9.34384 7.7142 9.34384ZM7.7142 5.3392C6.87856 5.3392 6.19076 6.02057 6.19076 6.86263C6.19076 7.7047 6.87213 8.38607 7.7142 8.38607C8.55626 8.38607 9.23763 7.7047 9.23763 6.86263C9.23763 6.02057 8.54983 5.3392 7.7142 5.3392Z"
                  fill="#979797"
                />
                <path
                  d="M7.7148 14.8654C6.76346 14.8654 5.80568 14.5055 5.06004 13.792C3.16378 11.9664 1.06825 9.05453 1.8589 5.58984C2.5724 2.44655 5.31716 1.03882 7.7148 1.03882C7.7148 1.03882 7.7148 1.03882 7.72123 1.03882C10.1189 1.03882 12.8636 2.44655 13.5771 5.59627C14.3613 9.06095 12.2658 11.9664 10.3696 13.792C9.62391 14.5055 8.66614 14.8654 7.7148 14.8654ZM7.7148 2.00302C5.84425 2.00302 3.44018 2.99936 2.80381 5.80196C2.10959 8.82955 4.01227 11.4393 5.73498 13.0913C6.84702 14.1648 8.58901 14.1648 9.70105 13.0913C11.4173 11.4393 13.32 8.82955 12.6386 5.80196C11.9958 2.99936 9.58535 2.00302 7.7148 2.00302Z"
                  fill="#979797"
                />
              </svg>

              <span className="text-lg text-[13.22px]">
                {address || "Loading address..."}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-[31.85px] font-medium text-primary">
                ₦{equipmentData.pricePerDay.toLocaleString()}
              </span>
              <span className="text-base text-[#979797] ml-2">Per a day</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${equipmentData.owner.phone}`}
                className="flex-1 text-base flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-white font-medium hover:bg-green-600"
              >
                {equipmentData.owner.phone}
              </a>
              <button className="flex-1 whitespace-nowrap text-base flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-3 text-primary font-medium hover:bg-green-50">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.5 15.75H5.25V19.3209L9.71338 15.75H14C14.9651 15.75 15.75 14.9651 15.75 14V7C15.75 6.03487 14.9651 5.25 14 5.25H3.5C2.53487 5.25 1.75 6.03487 1.75 7V14C1.75 14.9651 2.53487 15.75 3.5 15.75Z"
                    fill="#12B76A"
                  />
                  <path
                    d="M17.5 1.75H7C6.03487 1.75 5.25 2.53487 5.25 3.5H15.75C16.7151 3.5 17.5 4.28487 17.5 5.25V12.25C18.4651 12.25 19.25 11.4651 19.25 10.5V3.5C19.25 2.53487 18.4651 1.75 17.5 1.75Z"
                    fill="#12B76A"
                  />
                </svg>
                Message rental
              </button>
            </div>
          </div>

          {/* Middle Block - Renter Information and Feedback */}
          <div className="bg-white rounded-lg mb-6">
            <Link
              href={`/dashboard/user/owner/${equipmentData.owner.id}`}
              className="flex items-center justify-between px-6 py-2 border-[#F0F0F0] border-b"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={mockEquipmentData.owner.image || "/placeholder.svg?height=64&width=64&query=person"}
                    alt={equipmentData.owner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium">{equipmentData.owner.name}</h3>
                  {equipmentData.owner.verified && (
                    <span className="inline-block rounded-full bg-[#E8F8F1] px-3 py-1 text-[12px] text-green-600">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            {/* Feedback Header */}
            <div className="flex items-center justify-between p-6">
              <h3 className="text-[12.03px] text-[#979797]">Latest feedback on Renter</h3>
              <Link
                href={`/dashboard/user/owner/${equipmentData.owner.id}/reviews`}
                className="flex items-center text-[12.03px] text-primary"
              >
                View all {mockEquipmentData.totalFeedback}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 ml-1"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            {/* Feedback Item */}
            {mockEquipmentData.feedback.length > 0 && (
              <div className="p-4 m-4 rounded-lg bg-[#F2F4F7]">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full flex-shrink-0">
                      <Image
                        src={
                          mockEquipmentData.feedback[0].user.image ||
                          "/placeholder.svg?height=48&width=48&query=person" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={mockEquipmentData.feedback[0].user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-[500] text-[14.04px]">{mockEquipmentData.feedback[0].user.name}</h4>
                      <p className="mt-1 text-[12.03px]">{mockEquipmentData.feedback[0].text}</p>
                    </div>
                  </div>
                  <div className="text-primary">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.9287 8.29651C16.9287 6.16921 16.0836 4.12904 14.5794 2.62481C13.0752 1.12058 11.035 0.275513 8.90772 0.275513C6.78042 0.275513 4.74024 1.12058 3.23601 2.62481C1.73179 4.12904 0.886719 6.16921 0.886719 8.29651C0.886719 10.4238 1.73179 12.464 3.23601 13.9682C4.74024 15.4724 6.78042 16.3175 8.90772 16.3175C11.035 16.3175 13.0752 15.4724 14.5794 13.9682C16.0836 12.464 16.9287 10.4238 16.9287 8.29651ZM1.88934 8.29651C1.88934 7.37484 2.07088 6.4622 2.42359 5.61069C2.77629 4.75919 3.29326 3.98549 3.94498 3.33377C4.59669 2.68205 5.37039 2.16509 6.2219 1.81238C7.07341 1.45967 7.98605 1.27814 8.90772 1.27814C9.82938 1.27814 10.742 1.45967 11.5935 1.81238C12.445 2.16509 13.2187 2.68205 13.8705 3.33377C14.5222 3.98549 15.0391 4.75919 15.3918 5.61069C15.7446 6.4622 15.9261 7.37484 15.9261 8.29651C15.9261 10.1579 15.1867 11.943 13.8705 13.2592C12.5543 14.5754 10.7691 15.3149 8.90772 15.3149C7.04633 15.3149 5.26118 14.5754 3.94498 13.2592C2.62878 11.943 1.88934 10.1579 1.88934 8.29651ZM12.4169 6.79257C12.4169 6.52666 12.3113 6.27164 12.1232 6.08361C11.9352 5.89558 11.6802 5.78995 11.4143 5.78995C11.1484 5.78995 10.8933 5.89558 10.7053 6.08361C10.5173 6.27164 10.4117 6.52666 10.4117 6.79257C10.4117 7.05849 10.5173 7.31351 10.7053 7.50154C10.8933 7.68956 11.1484 7.7952 11.4143 7.7952C11.6802 7.7952 11.9352 7.68956 12.1232 7.50154C12.3113 7.31351 12.4169 7.05849 12.4169 6.79257ZM7.40378 6.79257C7.40378 6.52666 7.29815 6.27164 7.11012 6.08361C6.92209 5.89558 6.66707 5.78995 6.40115 5.78995C6.13524 5.78995 5.88022 5.89558 5.69219 6.08361C5.50416 6.27164 5.39853 6.52666 5.39853 6.79257C5.39853 7.05849 5.50416 7.31351 5.69219 7.50154C5.88022 7.68956 6.13524 7.7952 6.40115 7.7952C6.66707 7.7952 6.92209 7.68956 7.11012 7.50154C7.29815 7.31351 7.40378 7.05849 7.40378 6.79257ZM5.78855 10.8181C5.74714 10.7669 5.69605 10.7243 5.63819 10.6929C5.58033 10.6614 5.51684 10.6416 5.45135 10.6347C5.38585 10.6277 5.31963 10.6338 5.25646 10.6524C5.1933 10.6711 5.13442 10.702 5.0832 10.7434C5.03199 10.7848 4.98943 10.8359 4.95795 10.8938C4.92648 10.9516 4.90671 11.0151 4.89977 11.0806C4.89284 11.1461 4.89887 11.2123 4.91753 11.2755C4.93618 11.3387 4.9671 11.3975 5.00851 11.4488C5.47857 12.03 6.07269 12.4988 6.74736 12.8208C7.42202 13.1428 8.16016 13.3098 8.90772 13.3096C10.4818 13.3096 11.8885 12.5827 12.8069 11.4488C12.8484 11.3975 12.8794 11.3387 12.8981 11.2755C12.9168 11.2123 12.9229 11.146 12.916 11.0805C12.9091 11.0149 12.8894 10.9514 12.8579 10.8935C12.8265 10.8355 12.7839 10.7844 12.7327 10.7429C12.6815 10.7014 12.6226 10.6705 12.5594 10.6517C12.4962 10.633 12.43 10.6269 12.3644 10.6338C12.2989 10.6407 12.2353 10.6604 12.1774 10.6919C12.1195 10.7233 12.0684 10.7659 12.0269 10.8171C11.651 11.2823 11.1758 11.6576 10.6361 11.9154C10.0964 12.1732 9.50583 12.307 8.90772 12.307C8.30969 12.3071 7.71921 12.1734 7.17951 11.9158C6.63981 11.6582 6.16456 11.2831 5.78855 10.8181Z"
                        fill="#12B76A"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Leave Feedback */}
            <div className="pl-6">
              <div className="mt-2 flex items-center gap-4 text-gray-500">
                <span className="text-[#979797] text-xs">{mockEquipmentData.feedback[0].timeAgo}</span>
                <button className="hover:text-gray-700 font-bold text-xs text-[#979797]">Like</button>
                <button className="hover:text-gray-700 font-bold text-xs text-[#979797]">Reply</button>
                <div className="flex items-center text-xs text-primary">
                  <div className="w-[11.03px] mr-2 flex justify-center items-center bg-primary rounded-full h-[11.03px]">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_479_10254)">
                        <path
                          d="M7.02726 3.37322C7.02726 3.21811 6.96564 3.06934 6.85596 2.95966C6.74627 2.84998 6.59751 2.78836 6.44239 2.78836H4.59422L4.87496 1.45194C4.88081 1.4227 4.88373 1.39053 4.88373 1.35836C4.88373 1.23847 4.83402 1.12734 4.75506 1.04839L4.44508 0.741333L2.52088 2.66554C2.41268 2.77374 2.34834 2.91995 2.34834 3.08079V6.00511C2.34834 6.16023 2.40996 6.30899 2.51965 6.41867C2.62933 6.52836 2.77809 6.58998 2.93321 6.58998H5.5651C5.80782 6.58998 6.01544 6.44376 6.10317 6.23321L6.98632 4.17156C7.01264 4.1043 7.02726 4.03412 7.02726 3.95809V3.37322ZM0.59375 6.58998H1.76348V3.08079H0.59375V6.58998Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_479_10254">
                          <rect
                            width="7.01837"
                            height="7.01837"
                            fill="white"
                            transform="translate(0.300781 0.448853)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  {mockEquipmentData.feedback[0].replies}
                </div>
              </div>
              <button className="flex items-center pb-4 my-4 gap-2 w-full text-left hover:bg-gray-50">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.53314 6.59741C4.57826 6.30164 4.87303 6.02091 5.28912 6.02091C5.70521 6.02091 5.99998 6.30164 6.0451 6.59741C6.05275 6.66437 6.07383 6.72909 6.10706 6.78771C6.14029 6.84633 6.18501 6.89765 6.23852 6.9386C6.29204 6.97955 6.35327 7.00929 6.41854 7.02604C6.48381 7.0428 6.55179 7.04622 6.61841 7.0361C6.68504 7.02599 6.74894 7.00254 6.80629 6.96717C6.86365 6.9318 6.91329 6.88523 6.95224 6.83024C6.99119 6.77525 7.01866 6.71298 7.033 6.64713C7.04734 6.58129 7.04825 6.51323 7.03569 6.44702C6.90836 5.60983 6.14736 5.01828 5.28912 5.01828C4.43087 5.01828 3.66988 5.60983 3.54255 6.44702C3.52998 6.51323 3.5309 6.58129 3.54524 6.64713C3.55958 6.71298 3.58704 6.77525 3.62599 6.83024C3.66494 6.88523 3.71458 6.9318 3.77194 6.96717C3.8293 7.00254 3.8932 7.02599 3.95982 7.0361C4.02645 7.04622 4.09443 7.0428 4.1597 7.02604C4.22497 7.00929 4.28619 6.97955 4.33971 6.9386C4.39323 6.89765 4.43794 6.84633 4.47118 6.78771C4.50441 6.72909 4.52548 6.66437 4.53314 6.59741ZM10.8036 6.02091C10.3875 6.02091 10.0937 6.30164 10.0476 6.59741C10.0234 6.7249 9.95071 6.83804 9.84482 6.91305C9.73893 6.98805 9.60809 7.01908 9.4798 6.9996C9.35151 6.98012 9.23577 6.91166 9.15692 6.80861C9.07806 6.70555 9.04224 6.57594 9.05698 6.44702C9.18431 5.60983 9.94531 5.01828 10.8036 5.01828C11.6618 5.01828 12.4228 5.60983 12.5501 6.44702C12.5649 6.57594 12.529 6.70555 12.4502 6.80861C12.3713 6.91166 12.2556 6.98012 12.1273 6.9996C11.999 7.01908 11.8682 6.98805 11.7623 6.91305C11.6564 6.83804 11.5837 6.7249 11.5595 6.59741C11.5134 6.30164 11.2196 6.02091 10.8036 6.02091ZM3.53152 8.52747C3.46159 8.52755 3.39246 8.54226 3.32855 8.57065C3.26465 8.59905 3.2074 8.6405 3.16047 8.69234C3.11354 8.74417 3.07797 8.80526 3.05606 8.87166C3.03414 8.93806 3.02636 9.00832 3.03321 9.07791C3.27184 11.5273 5.19487 13.5406 8.04333 13.5406C10.8918 13.5406 12.8158 11.5273 13.0544 9.07791C13.0613 9.00823 13.0535 8.9379 13.0315 8.87142C13.0095 8.80495 12.9739 8.74382 12.9269 8.69196C12.8798 8.64011 12.8224 8.59868 12.7584 8.57035C12.6944 8.54202 12.6251 8.52741 12.5551 8.52747H3.53152ZM8.04333 12.538C5.95687 12.538 4.5181 11.2315 4.12106 9.53009H11.9666C11.5686 11.2315 10.1308 12.538 8.04333 12.538ZM8.04834 0.50647C5.92104 0.50647 3.88087 1.35154 2.37664 2.85577C0.872411 4.35999 0.0273438 6.40017 0.0273438 8.52747C0.0273438 10.6548 0.872411 12.6949 2.37664 14.1992C3.88087 15.7034 5.92104 16.5485 8.04834 16.5485C10.1756 16.5485 12.2158 15.7034 13.72 14.1992C15.2243 12.6949 16.0693 10.6548 16.0693 8.52747C16.0693 6.40017 15.2243 4.35999 13.72 2.85577C12.2158 1.35154 10.1756 0.50647 8.04834 0.50647ZM1.02997 8.52747C1.02997 7.6058 1.2115 6.69316 1.56421 5.84165C1.91692 4.99014 2.43389 4.21644 3.0856 3.56473C3.73732 2.91301 4.51102 2.39604 5.36253 2.04334C6.21403 1.69063 7.12668 1.50909 8.04834 1.50909C8.97001 1.50909 9.88265 1.69063 10.7342 2.04334C11.5857 2.39604 12.3594 2.91301 13.0111 3.56473C13.6628 4.21644 14.1798 4.99014 14.5325 5.84165C14.8852 6.69316 15.0667 7.6058 15.0667 8.52747C15.0667 10.3889 14.3273 12.174 13.0111 13.4902C11.6949 14.8064 9.90973 15.5458 8.04834 15.5458C6.18695 15.5458 4.4018 14.8064 3.0856 13.4902C1.7694 12.174 1.02997 10.3889 1.02997 8.52747Z"
                    fill="#FF5F00"
                  />
                </svg>

                <span className="text-black text-[12.03px]">Leave feedback about the renter</span>
              </button>
            </div>
          </div>

          {/* Bottom Block - Book Now Button */}
          <div className="bg-white rounded-lg p-6">
            <button
              onClick={handleBookNow}
              className="w-full rounded-full bg-primary py-3 text-center text-base font-medium text-white hover:bg-green-600 transition-colors"
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
