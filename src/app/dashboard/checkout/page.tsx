"use client"

import { useState } from "react"
import { DatePicker } from "@/components/date-picker"
import Image from "next/image"

// Sample data for the Toyota Camry
const equipmentData = {
  id: "1",
  title: "Toyota Camry for Rent – Smooth, Stylish, and Reliable!",
  description:
    "Looking for a comfortable and fuel-efficient ride? Our Toyota Camry is the perfect choice! Whether it's for a business trip, weekend getaway, or city cruising, this sedan offers:",
  images: ["/toyota-black.svg"],
  price: 50000,
  location: "Rivers, Port harcourt, 7 woji road",
  phoneNumber: "08107355412",
  category: "Vehicles",
  owner: {
    id: "owner1",
    name: "Thankgod Ogbonna",
    image: "/tg.svg",
    verified: true,
  },
}

// Sample saved cards
const savedCards = [
  {
    id: "card1",
    last4: "3456",
    name: "Thankg",
    type: "visa",
  },
  {
    id: "card2",
    last4: "3456",
    name: "Thankg",
    type: "mastercard",
  },
]

export default function CheckoutPage() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedCard, setSelectedCard] = useState<string>("card1")
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [rentDuration, setRentDuration] = useState(2)

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

//   const calculateTotalDays = () => {
//     if (!startDate || !endDate) return 0
//     const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays + 1 // Include both start and end days
//   }

const calculateTotalDays = () => {
    return rentDuration
  }

  const calculateTotalPrice = () => {
    return calculateTotalDays() * equipmentData.price
  }

  const handleCheckout = () => {
    // Handle checkout logic here
    alert("Checkout functionality will be implemented soon!")
  }

  const incrementDuration = () => {
    setRentDuration((prev) => prev + 1)
  }

  const decrementDuration = () => {
    if (rentDuration > 1) {
      setRentDuration((prev) => prev - 1)
    }
  }

  // Format the current date and time
  const formattedDate = new Date()
    .toLocaleString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .replace(",", " at")

  return (
    <div className="space-y-8 font-sans">
      <h1 className="text-3xl mt-4 font-bold">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Equipment Summary */}
        <div className="w-full md:px-20 rounded-lg bg-white lg:flex-2">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-Medium mb-6">Equipment Summary</h2>

            <div className="flex gap-4 mb-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg flex-shrink-0">
                <Image
                  src={equipmentData.images[0] || "/placeholder.svg"}
                  alt={equipmentData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{equipmentData.title}</h3>
                <p className="text-[#676767] text-sm">{equipmentData.location}</p>
                <p className="text-primary text-sm font-medium mt-2">₦{equipmentData.price.toLocaleString()} per day</p>
              </div>
            </div>

             {/* Title and Timestamp */ }
          <div className="mb-4">
            <h2 className="text-2xl font-[600]">{equipmentData.title}</h2>
            <p className="text-[#979797] text-[12px]">Today at 12:00 Am</p>
          </div>

          {/* Rent Duration */}
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-base">Rent duration</span>
              <div className="flex items-center">
                <button
                  onClick={decrementDuration}
                  className="h-8 w-8 flex items-center justify-center text-xl font-bold text-[#979797] hover:text-gray-700"
                >
                  −
                </button>
                <span className="mx-4 text-base">{rentDuration}</span>
                <button
                  onClick={incrementDuration}
                  className="h-8 w-8 flex items-center justify-center text-xl font-bold text-[#979797] hover:text-gray-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>

            <div className="border-t pt-6">
              <h3 className="font-bold mb-4">Rental Details</h3>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Period:</span>
                  <span className="font-medium">
                    {startDate && endDate
                      ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{calculateTotalDays()} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-medium">₦{equipmentData.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₦{calculateTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

           {/* Important Notice */}
           <div className="border mt-4 bg-white rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
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
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                </svg>
              </div>
              <div className="">
                <h3 className="text-xl font-bold mb-2">Important Notice</h3>
                <p className="text-[14px] text-[#979797] mb-2">To keep your transactions safe, please remember:</p>
                <p className="text-[14px] text-[#979797] mb-2">
                  Your money will be held securely until you have seen the product in person and confirmed that
                  everything is okay.
                </p>
                <p className="text-[14px] text-[#979797] mb-2">
                  Only after your confirmation will the payment be released to the equipment owner.
                </p>
                <p className="text-[14px] text-[#979797]">
                  This helps protect both you and the seller from fraud or misunderstandings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Date Selection and Payment */}
        <div className="w-full flex-shrink-0 lg:flex-1">
          {/* Date Selection */}
          <div className="bg-white -z-50 rounded-lg p-6 mb-6">
            <h2 className="text-base font-bold mb-6">Select date</h2>
            <DatePicker onDateChange={handleDateChange} />
            <div className="mt-6 flex justify-between items-center">
              <span className="text-[14px] text-[#979797]">Total price</span>
              <div className="text-right">
                <span className="text-[20px] font-bold">₦{calculateTotalPrice().toLocaleString()}</span>
                <span className="text-[#979797] text-lg ml-2">Per a day</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-base font-bold mb-6">Payment method</h2>

            <div className="space-y-4">
              {/* Visa Card */}
              <div
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedCard("card1")}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-[12px]">Thankg*********3456</span>
                  <svg className="h-8" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M293.2 348.7L320.2 152.2H366.5L339.5 348.7H293.2Z" fill="#00579F" />
                    <path
                      d="M576.5 156.9C567.6 153.8 553.2 150.2 535.2 150.2C487.5 150.2 454.2 174.6 454 209.4C453.8 235.2 477.8 249.5 495.8 258.1C514.2 266.9 520.6 272.4 520.5 280.2C520.4 292.3 505.4 297.7 491.4 297.7C472.5 297.7 462.3 294.8 446.2 287.1L439.6 284.2L432.6 325.2C443.1 329.8 462.7 333.8 483.1 334C533.9 334 566.5 310 566.8 272.7C567 247.7 551.6 228.6 520.9 214.9C502.7 206.3 491.5 200.7 491.6 191.7C491.6 183.7 501.1 175.6 521.1 175.6C537.4 175.6 549.1 178.8 558 182.7L562.7 184.8L569.5 145.5L576.5 156.9Z"
                      fill="#00579F"
                    />
                    <path
                      d="M666.1 152.2H629.2C618.4 152.2 610.5 155.3 606 167.2L522.6 348.7H573.3C573.3 348.7 582.7 323.8 584.6 318.7C590.8 318.7 641.8 318.7 649.8 318.7C651.3 325.3 656.2 348.7 656.2 348.7H701.5L666.1 152.2ZM599.5 283.5C603.6 272.7 619.7 230.8 619.7 230.8C619.4 231.4 624.1 219.5 626.7 212.2L630.1 228.9C630.1 228.9 640.1 274.7 642.1 283.5H599.5Z"
                      fill="#00579F"
                    />
                    <path
                      d="M234.3 152.2L186.4 285.2L181.6 262.4C172.6 232.3 144.2 199.5 112.5 183.1L156.1 348.5H207.2L283.3 152.2H234.3Z"
                      fill="#00579F"
                    />
                    <path
                      d="M131.5 152.2H50.9L50 156.8C113.9 173.4 156.2 214.4 172.1 262.4L156.7 167.3C154.2 155.7 144.1 152.5 131.5 152.2Z"
                      fill="#FAA61A"
                    />
                  </svg>
                </div>
                <div
                  className={`h-6 w-6 rounded-full ${
                    selectedCard === "card1"
                      ? "bg-primary flex items-center justify-center"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {selectedCard === "card1" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* Mastercard */}
              <div
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedCard("card2")}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-[12px]">Thankg*********3456</span>
                  <svg className="h-8" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M449.1 250C449.1 319.9 392.9 376.9 323.9 376.9C255 376.9 198.8 319.9 198.8 250C198.8 180.1 255 123.1 323.9 123.1C392.9 123.1 449.1 180.1 449.1 250Z"
                      fill="#EB001B"
                    />
                    <path
                      d="M581.2 250C581.2 319.9 525 376.9 456.1 376.9C387.1 376.9 330.9 319.9 330.9 250C330.9 180.1 387.1 123.1 456.1 123.1C525 123.1 581.2 180.1 581.2 250Z"
                      fill="#F79E1B"
                    />
                    <path
                      d="M390 174.6C363.9 197 347.8 222.3 347.8 250C347.8 277.7 363.9 303 390 325.4C416.1 303 432.2 277.7 432.2 250C432.2 222.3 416.1 197 390 174.6Z"
                      fill="#FF5F00"
                    />
                  </svg>
                </div>
                <div
                  className={`h-6 w-6 rounded-full ${
                    selectedCard === "card2"
                      ? "bg-primary flex items-center justify-center"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {selectedCard === "card2" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* Add New Card */}
              <div
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setShowAddCard(true)}
              >
                <div className="flex items-center">
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
                    className="h-6 w-6 mr-3"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span className="font-medium text-[12px]">Add new card</span>
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
                  className="h-5 w-5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              {/* Order Summary */}
              <h2 className="text-base font-medium">Order summary</h2>
              <div className="mt-4 rounded-xl border border-gray-200 p-4">
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[12px] text-[#676767]">Pay per day</span>
                  <span className="text-primary text-sm font-medium">₦50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#676767]">Sub total</span>
                  <span className="text-primary text-sm font-medium">₦100,000</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full rounded-full bg-primary py-4 text-center text-base font-medium text-white hover:bg-green-600 transition-colors"
          >
            Checkout now
          </button>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-10 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
             <div className="">
                <h2 className="text-xl font-bold">Add card</h2>
                <p className="text-[13px] text-[#5A5555]">Enter your card details, including the card number, expiry date, and CVV, to complete your transaction securely</p>
             </div>
              <button onClick={() => setShowAddCard(false)} className="text-[#979797] self-start hover:text-gray-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="#5A5555"/>
                <path d="M9.16937 15.58C8.97937 15.58 8.78938 15.51 8.63938 15.36C8.34938 15.07 8.34938 14.59 8.63938 14.3L14.2994 8.63999C14.5894 8.34999 15.0694 8.34999 15.3594 8.63999C15.6494 8.92999 15.6494 9.40998 15.3594 9.69998L9.69937 15.36C9.55937 15.51 9.35937 15.58 9.16937 15.58Z" fill="#5A5555"/>
                <path d="M14.8294 15.58C14.6394 15.58 14.4494 15.51 14.2994 15.36L8.63938 9.69998C8.34938 9.40998 8.34938 8.92999 8.63938 8.63999C8.92937 8.34999 9.40937 8.34999 9.69937 8.63999L15.3594 14.3C15.6494 14.59 15.6494 15.07 15.3594 15.36C15.2094 15.51 15.0194 15.58 14.8294 15.58Z" fill="#5A5555"/>
              </svg>

              </button>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cardNumber" className="block text-sm font-medium">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full  bg-[#F8F8FA] px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiryDate" className="block text-sm font-medium">
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    className="w-full  bg-[#F8F8FA] px-3 py-3 text-sm focus:border-primary placeholder:text-[#ADB3BC] placeholder:text-[13px] focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="cvv" className="block text-sm font-medium">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    className="w-full  bg-[#F8F8FA] px-3 py-3 text-sm placeholder:text-[#ADB3BC] placeholder:text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  className="flex-1 rounded-full bg-primary px-4 py-4 text-white hover:bg-green-600 focus:outline-none focus:ring-2 placeholder:text-[#ADB3BC] placeholder:text-[13px] focus:ring-primary focus:ring-offset-2"
                  onClick={() => setShowAddCard(false)}
                >
                  Checkout now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
