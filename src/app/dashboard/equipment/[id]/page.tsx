"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation'

// Sample data for the Toyota Camry
const equipmentData = {
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
      icon: (<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.0404 7.12501C15.0407 6.17097 14.7948 5.233 14.3263 4.4019C13.8579 3.57079 13.1828 2.8747 12.3664 2.381C11.5501 1.8873 10.6201 1.61272 9.66647 1.58384C8.71287 1.55496 7.76796 1.77275 6.92322 2.21614C6.07847 2.65952 5.3625 3.31349 4.84461 4.11472C4.32672 4.91595 4.02445 5.83732 3.96707 6.78963C3.90968 7.74193 4.09912 8.69293 4.51704 9.55055C4.93497 10.4082 5.56723 11.1434 6.35262 11.685L3.95703 15.8333L5.74303 15.907L6.69937 17.4167L9.44328 12.6635L9.4987 12.6667C9.52641 12.6683 9.53512 12.6643 9.55412 12.6635L12.298 17.4167L13.2734 15.9394L15.0404 15.8333L12.6448 11.685C13.3839 11.1761 13.9882 10.4951 14.4055 9.70073C14.8228 8.90633 15.0407 8.02236 15.0404 7.12501ZM5.54037 7.12501C5.54037 6.34212 5.77252 5.57682 6.20746 4.92588C6.64241 4.27493 7.26062 3.76758 7.98391 3.46798C8.7072 3.16839 9.50309 3.09 10.2709 3.24273C11.0388 3.39547 11.7441 3.77246 12.2977 4.32604C12.8512 4.87963 13.2282 5.58493 13.381 6.35278C13.5337 7.12062 13.4553 7.91651 13.1557 8.6398C12.8561 9.36309 12.3488 9.98129 11.6978 10.4162C11.0469 10.8512 10.2816 11.0833 9.4987 11.0833C8.44888 11.0833 7.44207 10.6663 6.69973 9.92397C5.9574 9.18164 5.54037 8.17482 5.54037 7.12501Z" fill="#12B76A"/>
        <path d="M9.5 9.5C10.8117 9.5 11.875 8.43668 11.875 7.125C11.875 5.81332 10.8117 4.75 9.5 4.75C8.18832 4.75 7.125 5.81332 7.125 7.125C7.125 8.43668 8.18832 9.5 9.5 9.5Z" fill="#12B76A"/>
        </svg>),
      text: "Guaranteed Car",
    },
    {
        icon: (<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.1875 5.04688C1.1875 4.2275 1.8525 3.5625 2.67188 3.5625H13.9531C14.7725 3.5625 15.4375 4.2275 15.4375 5.04688V11.5781C15.4375 12.3975 14.7725 13.0625 13.9531 13.0625H2.67188C1.8525 13.0625 1.1875 12.3975 1.1875 11.5781V5.04688ZM4.75 5.34375V4.75H3.5625V5.34375C3.5625 5.50122 3.49994 5.65224 3.38859 5.76359C3.27724 5.87494 3.12622 5.9375 2.96875 5.9375H2.375V7.125H2.96875C3.44117 7.125 3.89423 6.93733 4.22828 6.60328C4.56233 6.26923 4.75 5.81617 4.75 5.34375ZM10.6875 8.3125C10.6875 7.68261 10.4373 7.07852 9.99188 6.63312C9.54648 6.18772 8.94239 5.9375 8.3125 5.9375C7.68261 5.9375 7.07852 6.18772 6.63312 6.63312C6.18772 7.07852 5.9375 7.68261 5.9375 8.3125C5.9375 8.94239 6.18772 9.54648 6.63312 9.99188C7.07852 10.4373 7.68261 10.6875 8.3125 10.6875C8.94239 10.6875 9.54648 10.4373 9.99188 9.99188C10.4373 9.54648 10.6875 8.94239 10.6875 8.3125ZM13.0625 4.75H11.875V5.34375C11.875 5.81617 12.0627 6.26923 12.3967 6.60328C12.7308 6.93733 13.1838 7.125 13.6562 7.125H14.25V5.9375H13.6562C13.4988 5.9375 13.3478 5.87494 13.2364 5.76359C13.1251 5.65224 13.0625 5.50122 13.0625 5.34375V4.75ZM4.75 11.2812C4.75 10.8088 4.56233 10.3558 4.22828 10.0217C3.89423 9.68767 3.44117 9.5 2.96875 9.5H2.375V10.6875H2.96875C3.12622 10.6875 3.27724 10.7501 3.38859 10.8614C3.49994 10.9728 3.5625 11.1238 3.5625 11.2812V11.875H4.75V11.2812ZM13.0625 11.875V11.2812C13.0625 11.1238 13.1251 10.9728 13.2364 10.8614C13.3478 10.7501 13.4988 10.6875 13.6562 10.6875H14.25V9.5H13.6562C13.1838 9.5 12.7308 9.68767 12.3967 10.0217C12.0627 10.3558 11.875 10.8088 11.875 11.2812V11.875H13.0625ZM5.34375 15.4375C4.96757 15.4376 4.60101 15.3187 4.29659 15.0977C3.99218 14.8767 3.76555 14.565 3.64919 14.2072C3.81385 14.2357 3.98288 14.25 4.15625 14.25H13.9531C14.6617 14.25 15.3414 13.9685 15.8424 13.4674C16.3435 12.9664 16.625 12.2867 16.625 11.5781V6.03844C16.9724 6.16127 17.2732 6.38885 17.4859 6.68979C17.6986 6.99074 17.8127 7.35024 17.8125 7.71875V11.5781C17.8125 12.0849 17.7127 12.5868 17.5187 13.055C17.3248 13.5233 17.0405 13.9487 16.6821 14.3071C16.3237 14.6655 15.8983 14.9498 15.43 15.1437C14.9618 15.3377 14.4599 15.4375 13.9531 15.4375H5.34375Z" fill="#12B76A"/>
          </svg>),
        text: "Money back Guarantee",
      },
  ],
  images: [
    "/excavator.svg",
    "/generator.svg",
    "/keyboard.svg",
    "/toyota-black.svg",
    "/toyota-red.svg",
  ],
  price: 50000,
  location: "Rivers, Port harcourt, 7 woji road",
  phoneNumber: "08107355412",
  category: "Vehicles",
  rating: 4.5,
  owner: {
    id: "owner1",
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

export default function EquipmentDetailsPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  // const [startDate, setStartDate] = useState<Date | null>(null)
  // const [endDate, setEndDate] = useState<Date | null>(null)
  const router = useRouter()

  const handleBookNow = () => {
     window.location.href = `/dashboard/checkout?id=${params.id}`
  }

  const openDirections = () => {
    // Since we don't have coordinates, we'll use the address as a search query
    const encodedAddress = encodeURIComponent(equipmentData.location)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-8 font-sans mt-10">
        <header className="text-[23px] flex items-center gap-3 font-[700]">
          <svg className="cursor-pointer" onClick={() => router.back()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.57141 18.8201C9.38141 18.8201 9.19141 18.7501 9.04141 18.6001L2.97141 12.5301C2.68141 12.2401 2.68141 11.7601 2.97141 11.4701L9.04141 5.40012C9.33141 5.11012 9.81141 5.11012 10.1014 5.40012C10.3914 5.69012 10.3914 6.17012 10.1014 6.46012L4.56141 12.0001L10.1014 17.5401C10.3914 17.8301 10.3914 18.3101 10.1014 18.6001C9.96141 18.7501 9.76141 18.8201 9.57141 18.8201Z" fill="#292D32"/>
          <path d="M20.5019 12.75H3.67188C3.26188 12.75 2.92188 12.41 2.92188 12C2.92188 11.59 3.26188 11.25 3.67188 11.25H20.5019C20.9119 11.25 21.2519 11.59 21.2519 12C21.2519 12.41 20.9119 12.75 20.5019 12.75Z" fill="#292D32"/>
          </svg>
          Car Detail
        </header>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Image Gallery */}
        <div className="w-full bg-white p-4 rounded-lg lg:flex-2">
          <div className="relative aspect-[4/3] h-[370px] w-full overflow-hidden rounded-lg mb-4">
            <Image
              src={equipmentData.images[selectedImage] || "/placeholder.svg"}
              alt={equipmentData.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {equipmentData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={image || "/placeholder.svg"} alt={`View ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-8 text-[12px]">
            <h2 className="text-xl font-bold">Description</h2>
            <p className="mt-2 text-[#979797]">{equipmentData.title}</p>
            <p className="mt-2 text-[#979797]">{equipmentData.description}</p>
            <ol className="mt-4 space-y-2 list-decimal pl-5">
              <li>
                <ul className="space-y-2 text-[#979797]">
                  {equipmentData.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-4 text-[#979797] ">{equipmentData.callToAction}</li>
            </ol>

            <div className="mt-6 flex flex-wrap gap-4">
              {equipmentData.guarantees.map((guarantee, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-green-600"
                >
                    <span>{guarantee.icon}</span>
                  <span>{guarantee.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Details and Booking */}
        <div className="w-full lg:flex-1 rounded-lg">
          {/* Top Block - Location and Price */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-start gap-2 text-[#979797] mb-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.7142 9.34384C6.34503 9.34384 5.22656 8.2318 5.22656 6.85621C5.22656 5.48061 6.34503 4.375 7.7142 4.375C9.08336 4.375 10.2018 5.48704 10.2018 6.86263C10.2018 8.23822 9.08336 9.34384 7.7142 9.34384ZM7.7142 5.3392C6.87856 5.3392 6.19076 6.02057 6.19076 6.86263C6.19076 7.7047 6.87213 8.38607 7.7142 8.38607C8.55626 8.38607 9.23763 7.7047 9.23763 6.86263C9.23763 6.02057 8.54983 5.3392 7.7142 5.3392Z" fill="#979797"/>
                <path d="M7.7148 14.8654C6.76346 14.8654 5.80568 14.5055 5.06004 13.792C3.16378 11.9664 1.06825 9.05453 1.8589 5.58984C2.5724 2.44655 5.31716 1.03882 7.7148 1.03882C7.7148 1.03882 7.7148 1.03882 7.72123 1.03882C10.1189 1.03882 12.8636 2.44655 13.5771 5.59627C14.3613 9.06095 12.2658 11.9664 10.3696 13.792C9.62391 14.5055 8.66614 14.8654 7.7148 14.8654ZM7.7148 2.00302C5.84425 2.00302 3.44018 2.99936 2.80381 5.80196C2.10959 8.82955 4.01227 11.4393 5.73498 13.0913C6.84702 14.1648 8.58901 14.1648 9.70105 13.0913C11.4173 11.4393 13.32 8.82955 12.6386 5.80196C11.9958 2.99936 9.58535 2.00302 7.7148 2.00302Z" fill="#979797"/>
            </svg>

              <span className="text-lg text-[13.22px]">{equipmentData.location}</span>
            </div>

            <div className="mb-6">
              <span className="text-[31.85px] font-medium text-primary">₦{equipmentData.price.toLocaleString()}</span>
              <span className="text-base text-[#979797] ml-2">Per a day</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${equipmentData.phoneNumber}`}
                className="flex-1 text-base flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-white font-medium hover:bg-green-600"
              >
                {equipmentData.phoneNumber}
              </a>
              <button className="flex-1 whitespace-nowrap text-base flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-3 text-primary font-medium hover:bg-green-50">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 15.75H5.25V19.3209L9.71338 15.75H14C14.9651 15.75 15.75 14.9651 15.75 14V7C15.75 6.03487 14.9651 5.25 14 5.25H3.5C2.53487 5.25 1.75 6.03487 1.75 7V14C1.75 14.9651 2.53487 15.75 3.5 15.75Z" fill="#12B76A"/>
                    <path d="M17.5 1.75H7C6.03487 1.75 5.25 2.53487 5.25 3.5H15.75C16.7151 3.5 17.5 4.28487 17.5 5.25V12.25C18.4651 12.25 19.25 11.4651 19.25 10.5V3.5C19.25 2.53487 18.4651 1.75 17.5 1.75Z" fill="#12B76A"/>
                </svg>

                Message rental
              </button>
            </div>
          </div>

          {/* Middle Block - Renter Information and Feedback */}
          <div className="bg-white rounded-lg mb-6">
            <Link
              href={`/dashboard/users/${equipmentData.owner.id}`}
              className="flex items-center justify-between p-6 border-b"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={equipmentData.owner.image || "/placeholder.svg?height=64&width=64&query=person"}
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
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-[12.03px] text-[#979797]">Latest feedback on Renter</h3>
              <Link
                href={`/dashboard/users/${equipmentData.owner.id}/feedback`}
                className="flex items-center text-[12.03px] text-primary"
              >
                View all {equipmentData.totalFeedback}
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
            {equipmentData.feedback.length > 0 && (
              <div className="p-4 m-4 rounded-lg bg-[#F2F4F7]">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full flex-shrink-0">
                      <Image
                        src={
                          equipmentData.feedback[0].user.image ||
                          "/placeholder.svg?height=48&width=48&query=person" ||
                          "/placeholder.svg"
                        }
                        alt={equipmentData.feedback[0].user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-[500] text-[14.04px]">{equipmentData.feedback[0].user.name}</h4>
                      <p className="mt-1 text-[12.03px]">{equipmentData.feedback[0].text}</p>
                      <div className="mt-2 flex items-center gap-4 text-gray-500">
                        <span>{equipmentData.feedback[0].timeAgo}</span>
                        <button className="hover:text-gray-700">Like</button>
                        <button className="hover:text-gray-700">Reply</button>
                        <div className="flex items-center text-primary">
                            <div className="w-[11.03px] mr-2 flex justify-center items-center bg-primary rounded-full h-[11.03px]">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_479_10254)">
                                    <path d="M7.02726 3.37322C7.02726 3.21811 6.96564 3.06934 6.85596 2.95966C6.74627 2.84998 6.59751 2.78836 6.44239 2.78836H4.59422L4.87496 1.45194C4.88081 1.4227 4.88373 1.39053 4.88373 1.35836C4.88373 1.23847 4.83402 1.12734 4.75506 1.04839L4.44508 0.741333L2.52088 2.66554C2.41268 2.77374 2.34834 2.91995 2.34834 3.08079V6.00511C2.34834 6.16023 2.40996 6.30899 2.51965 6.41867C2.62933 6.52836 2.77809 6.58998 2.93321 6.58998H5.5651C5.80782 6.58998 6.01544 6.44376 6.10317 6.23321L6.98632 4.17156C7.01264 4.1043 7.02726 4.03412 7.02726 3.95809V3.37322ZM0.59375 6.58998H1.76348V3.08079H0.59375V6.58998Z" fill="white"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_479_10254">
                                    <rect width="7.01837" height="7.01837" fill="white" transform="translate(0.300781 0.448853)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </div>


                          {equipmentData.feedback[0].replies}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-primary">
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
                      className="h-6 w-6"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Leave Feedback */}
            <button className="flex items-center gap-2 p-6 w-full text-left hover:bg-gray-50">
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
                className="h-6 w-6 text-orange-500"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <span className="text-black text-[12.03px]">Leave feedback about the renter</span>
            </button>
          </div>

          {/* Bottom Block - Location Map and Booking Button */}
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-base font-medium">Location</h1>
            <div className="space-y-6">
              {/* Map Placeholder */}
                <svg width="358" height="147" viewBox="0 0 358 147" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect width="358" height="147" rx="7" fill="url(#pattern0_479_10150)"/>
                    <defs>
                    <pattern id="pattern0_479_10150" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_479_10150" transform="matrix(0.00262467 0 0 0.00639206 0 0.0301837)"/>
                    </pattern>
                    <image id="image0_479_10150" width="381" height="147" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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"/>
                    </defs>
                </svg>


              {/* Location Information */}
              <div className="flex items-start gap-3 mb-4">
                <div className="text-primary mt-1">
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
                    className="h-6 w-6"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium">{equipmentData.location}</p>
                  <button onClick={openDirections} className="text-primary text-[14px] hover:underline">
                    Get direction
                  </button>
                </div>
              </div>

              {/* Book Now Button */}
              <div className="pt-4">
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
      </div>
    </div>
  )
}
