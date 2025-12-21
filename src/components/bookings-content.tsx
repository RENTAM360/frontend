"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import Image from "next/image";
import { Booking, useGetBookingsQuery } from "@/lib/redux/api/equipmentApi";

export default function BookingsContent() {
  const { data: bookings = [], isLoading } = useGetBookingsQuery();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const rentalDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max(
      1,
      Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
    );
  };

  const getStatusLabel = (booking: Booking) => {
    if (booking.dispute) return "Disputed";
    if (booking.isCompleted) return "Completed";
    if (booking.payment) return "Paid";
    return "Pending";
  };

  return (
    <div className="relative h-[70vh]">
      <AnimatePresence mode="wait">
        {!showDetails ? (
          /* ================= LIST VIEW ================= */
          <motion.div
            key="list"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto"
          >
            {isLoading ? (
              <p className="p-4 text-gray-500">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="p-4 text-gray-500">No bookings yet</p>
            ) : (
              bookings.map((booking) => {
                const equipment = booking.equipment;
                if (!equipment) return null;

                const days = rentalDays(booking.startDate, booking.endDate);

                const total = equipment.pricePerDay * booking.quantity * days;

                return (
                  <div
                    key={booking._id}
                    className="p-4 border-b flex items-center gap-3"
                  >
                    {/* Equipment Image */}
                    {equipment.media?.[0] && (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={equipment.media[0]}
                          alt={equipment.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{equipment.name}</p>
                      <p className="text-xs text-gray-500">
                        {days} day(s) • ₦{total.toLocaleString("en-NG")}
                      </p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-[2px] rounded-full bg-gray-100 text-gray-600">
                        {getStatusLabel(booking)}
                      </span>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetails(true);
                      }}
                      className="text-[10px] bg-[#12B76A] text-white px-2 py-1 rounded"
                    >
                      View details
                    </button>
                  </div>
                );
              })
            )}
          </motion.div>
        ) : (
          /* ================= DETAILS VIEW ================= */
          <motion.div
            key="details"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-5"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedBooking(null);
                }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="font-semibold text-lg">Booking details</h2>
            </div>

            {/* Receipt Card */}
            {selectedBooking && (
              <div className="border rounded-2xl p-5 shadow-sm mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#12B76A] rounded-full flex items-center justify-center mb-3">
                    <ClipboardCheck className="text-white w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-semibold">Booking Information</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Review the booking details below
                  </p>

                  {selectedBooking.equipment?.media?.[0] && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden mt-4 mb-2">
                      <Image
                        src={selectedBooking.equipment.media[0]}
                        alt={selectedBooking.equipment.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <p className="text-sm font-medium text-gray-700 mt-2">
                    {selectedBooking.equipment?.name}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-5 border-t border-dashed border-gray-300 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking ID</span>
                    <span className="text-xs break-all text-black">
                      {selectedBooking._id}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`font-medium capitalize ${
                        selectedBooking.isCompleted
                          ? "text-[#12B76A]"
                          : selectedBooking.status === "initialized"
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity</span>
                    <span className="text-black">
                      {selectedBooking.quantity}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Price per day</span>
                    <span className="text-black">
                      ₦
                      {selectedBooking.equipment?.pricePerDay.toLocaleString(
                        "en-NG"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Rental period</span>
                    <span className="text-black">
                      {new Date(selectedBooking.startDate).toLocaleDateString()}{" "}
                      – {new Date(selectedBooking.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Status</span>
                    <span
                      className={`font-medium ${
                        selectedBooking.payment
                          ? "text-[#12B76A]"
                          : "text-orange-600"
                      }`}
                    >
                      {selectedBooking.payment ? "Paid" : "Pending"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="text-black">
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Notice */}
            {/* <div className="bg-[#FFF7E8] border border-[#FFD79A] rounded-xl p-4 mb-6">
                <p className="text-[#F7931A] font-semibold">Important notice!</p>
                <p className="text-sm text-gray-600 mt-1">
                Please verify all booking details carefully. If you notice any issue,
                report the booking immediately.
                </p>
            </div> */}

            {/* Actions */}
            {/* <div className="flex gap-3">
                <button
                className="flex-1 bg-[#12B76A] text-white font-semibold py-3 rounded-full"
                >
                Confirm
                </button>

                <button
                className="flex-1 border border-[#12B76A] text-[#12B76A] font-semibold py-3 rounded-full"
                >
                Send report
                </button>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
