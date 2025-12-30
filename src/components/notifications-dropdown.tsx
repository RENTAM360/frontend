"use client";
import { useNotifications } from "@/context/notification-context";
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/lib/redux/api/notificationsApi";
import { useGetProfileQuery } from "@/lib/redux/api/authApi";
import {
  useGetBookingByIdQuery,
  useConfirmBookingMutation,
} from "@/lib/redux/api/equipmentApi";
import { Notification } from "@/types/notifications";
import { ReportModal } from "@/components/report-modal";
import { ArrowLeft, Bell, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

export default function NotificationsDropdown() {
  const { latestNotif } = useNotifications();
  const { data, isLoading, refetch } = useGetNotificationsQuery({
    page: 1,
    limit: 10,
  });
  const { data: profileData } = useGetProfileQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [confirmBooking, { isLoading: isConfirming }] =
    useConfirmBookingMutation();

  const currentUserId = profileData?.data?.user?._id;

  const notifications = data?.data || [];

  const handleOpenReportModal = () => setIsReportModalOpen(true);
  const handleCloseReportModal = () => setIsReportModalOpen(false);

  // Get booking ID directly from the payment success notification's meta field
  const selectedBookingId = useMemo(() => {
    if (!selectedNotif || selectedNotif.title !== "payment success")
      return null;
    return selectedNotif.meta?.bookingId || null;
  }, [selectedNotif]);

  // Fetch booking details using the booking ID
  const { data: bookingData, isLoading: isLoadingBooking } =
    useGetBookingByIdQuery(selectedBookingId || "", {
      skip: !selectedBookingId,
    });

  const equipment = bookingData?.booking?.equipment;
  const customer = bookingData?.booking?.customer;
  const rentalStart = bookingData?.booking?.startDate
    ? new Date(bookingData.booking.startDate)
    : null;
  const rentalEnd = bookingData?.booking?.endDate
    ? new Date(bookingData.booking.endDate)
    : null;
  const totalDays =
    rentalStart && rentalEnd
      ? Math.max(
          1,
          Math.ceil(
            (rentalEnd.getTime() - rentalStart.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;
  const totalAmount =
    equipment?.pricePerDay && totalDays
      ? equipment.pricePerDay *
        (bookingData?.booking?.quantity ?? 1) *
        totalDays
      : null;

  // Check if current user is the customer who made the payment
  const isPaymentCustomer = (notif: Notification): boolean => {
    if (!currentUserId || notif.title !== "payment success") return false;

    // Check if the notification belongs to the current user
    if (notif.user !== currentUserId) return false;

    return true;
  };

  // console.log(notifications)

  useEffect(() => {
    if (latestNotif) {
      refetch();
    }
  }, [latestNotif, refetch]);

  function formatTimeAgo(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markAsRead(id).unwrap();
      if (res.status === 200)
        enqueueSnackbar("Marked as read", { variant: "success" });
      refetch();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData?.booking?._id) {
      enqueueSnackbar("No booking selected", { variant: "error" });
      return;
    }
    try {
      await confirmBooking(bookingData?.booking?._id).unwrap();
      enqueueSnackbar("Booking confirmed", { variant: "success" });
      // refresh notifications/booking state
      refetch();
      setShowReceipt(false);
      setSelectedNotif(null);
    } catch (err) {
      console.error("Confirm booking failed:", err);
      enqueueSnackbar("Failed to confirm booking", { variant: "error" });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!showReceipt ? (
          <motion.div
            key="dropdown"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between px-4 items-center mb-3">
              <h3 className="font-semibold text-black text-lg">
                All Notifications
              </h3>
              <button
                className="text-[#12B76A] text-sm"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : notifications?.length === 0 ? (
              <p className="text-gray-500 ml-3">No notification</p>
            ) : (
              <ul className="">
                {notifications?.map((notif: Notification) => (
                  <li
                    key={notif._id}
                    className={`p-3 border-t cursor-pointer border-[#EBEBEB] ${
                      notif.isRead ? "bg-white" : "bg-[#F2FEF8]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notif.isRead ? "bg-[#F2FEF8]" : "bg-white"
                        }`}
                      >
                        <Bell className="w-4 h-4 text-[#12B76A]" />
                      </div>
                      <div className="flex-1">
                        {/* <h4 className="font-medium">{notif.title}</h4> */}
                        <p
                          className="text-sm text-gray-600"
                          onClick={() => handleMarkAsRead(notif._id)}
                        >
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[#979797] mt-1">
                            {formatTimeAgo(
                              notif.createdAt ?? new Date().toISOString()
                            )}
                          </p>
                          {isPaymentCustomer(notif) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNotif(notif);
                                setShowReceipt(true);
                              }}
                              className="text-[9px] text-white cursor-pointer bg-[#12B76A] p-1 rounded-sm mt-1"
                            >
                              View details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="receipt"
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
                  setShowReceipt(false);
                  setSelectedNotif(null);
                }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="font-semibold text-lg">Receipt</h2>
            </div>

            {/* Receipt Content */}
            <div className="border rounded-2xl p-5 shadow-sm mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#12B76A] rounded-full flex items-center justify-center mb-3">
                  <ClipboardCheck className="text-white w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">Payment Confirmation</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedNotif?.details ??
                    "You made a successful payment transaction."}
                </p>
                {isLoadingBooking ? (
                  <p className="text-sm text-gray-500 mt-3">
                    Loading details...
                  </p>
                ) : bookingData ? (
                  <>
                    {equipment?.media?.[0] && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden mt-3 mb-2">
                        <Image
                          src={equipment.media[0]}
                          alt={equipment.name || "Equipment"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {equipment?.name && (
                      <p className="text-sm font-medium text-gray-700 mt-2">
                        {equipment.name}
                      </p>
                    )}
                    <h1 className="text-2xl font-bold mt-3 text-black">
                      {totalAmount !== null
                        ? `₦${totalAmount.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : selectedNotif?.details || "₦0.00"}
                    </h1>
                  </>
                ) : selectedBookingId ? (
                  <p className="text-sm text-gray-500 mt-3">
                    Unable to load booking details.
                  </p>
                ) : (
                  <h1 className="text-2xl font-bold mt-3 text-black">
                    {selectedNotif?.details || "₦0.00"}
                  </h1>
                )}
              </div>

              <div className="mt-5 border-t border-dashed border-gray-300 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="text-xs break-all text-black">
                    {selectedNotif?._id ?? "—"}
                  </span>
                </div>
                {bookingData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking ID</span>
                      <span className="text-xs break-all text-black">
                        {bookingData.booking._id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking Status</span>
                      <span
                        className={`font-medium capitalize ${
                          bookingData.booking.status === "initilized" ||
                          bookingData.booking.status === "initialized"
                            ? "text-blue-600"
                            : bookingData.booking.isCompleted
                            ? "text-[#12B76A]"
                            : "text-orange-600"
                        }`}
                      >
                        {bookingData.booking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Equipment</span>
                      <span className="font-medium text-black">
                        {equipment?.name ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price per day</span>
                      <span className="text-black">
                        {equipment?.pricePerDay !== undefined
                          ? `₦${equipment.pricePerDay.toLocaleString("en-NG")}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quantity</span>
                      <span className="text-black">
                        {bookingData.booking.quantity ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rental period</span>
                      <span className="text-black">
                        {rentalStart && rentalEnd
                          ? `${rentalStart.toLocaleDateString()} - ${rentalEnd.toLocaleDateString()}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total days</span>
                      <span className="text-black">
                        {totalDays ? `${totalDays} day(s)` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer</span>
                      <span className="font-medium text-black">
                        {customer
                          ? `${customer.firstName} ${customer.lastName || ""}`
                          : "—"}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span
                    className={
                      bookingData?.booking?.payment
                        ? "text-[#12B76A] font-medium"
                        : "text-orange-600 font-medium"
                    }
                  >
                    {bookingData?.booking?.payment ? "Paid" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-black">
                    {new Date(
                      selectedNotif?.createdAt ??
                        bookingData?.booking?.createdAt ??
                        new Date()
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notice Section */}
            <div className="bg-[#FFF7E8] border border-[#FFD79A] rounded-xl p-4 mb-6">
              <p className="text-[#F7931A] font-semibold">Important notice!</p>
              <p className="text-sm text-gray-600 mt-1">
                To complete your payment, please click “Confirm” only after
                verifying all details are correct. If something seems wrong,
                report the transaction instead to prevent unauthorized payout.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-[#12B76A] text-white font-semibold py-3 rounded-full disabled:opacity-60 disabled:cursor-not-allowed disabled:grayscale"
                onClick={handleConfirmBooking}
                disabled={
                  !bookingData?.booking?._id ||
                  isConfirming ||
                  !bookingData?.isCustomer
                }
              >
                {isConfirming ? "Confirming..." : "Confirm"}
              </button>

              <button
                className="flex-1 border border-[#12B76A] text-[#12B76A] font-semibold py-3 rounded-full"
                onClick={() => {
                  handleOpenReportModal();
                }}
              >
                Send report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        reportedUserId={customer?._id ?? ""}
        reportedUserName={
          customer ? `${customer.firstName} ${customer.lastName ?? ""}` : ""
        }
        equipmentId={equipment?._id ?? ""}
      />
    </div>
  );
}
