"use client";
import { useNotifications } from "@/context/notification-context";
import { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from "@/lib/redux/api/notificationsApi";
import { Notification } from "@/types/notifications";
import { ArrowLeft, Bell, ClipboardCheck } from "lucide-react";
import { AnimatePresence } from "motion/dist/react";
import { motion } from "motion/react"
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function NotificationsDropdown() {
  const { latestNotif } = useNotifications();
  const { data, isLoading, refetch } = useGetNotificationsQuery({ page: 1, limit: 10 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

const notifications = data?.data

  console.log(notifications)

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
     if (res.status === 200) enqueueSnackbar("Marked as read", {variant: "success"})
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
        <h3 className="font-semibold text-black text-lg">All Notifications</h3>
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
              onClick={() => handleMarkAsRead(notif._id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                notif.isRead ? "bg-[#F2FEF8]" : "bg-white"
              }`}>
                  <Bell className="w-4 h-4 text-[#12B76A]" />
                </div>
                <div className="flex-1">
                  {/* <h4 className="font-medium">{notif.title}</h4> */}
                  <p className="text-sm text-gray-600">{notif.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#979797] mt-1">{formatTimeAgo(notif.createdAt ?? new Date().toISOString())}</p>
                      {notif.title === "payment success" && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="text-[9px] text-white bg-[#12B76A] p-1 rounded-sm mt-1"
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
                <h1 className="text-2xl font-bold mt-3 text-black">
                  ₦250,000.00
                </h1>
              </div>

              <div className="mt-5 border-t border-dashed border-gray-300 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span>{selectedNotif?._id ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-[#12B76A] font-medium">Success</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span>
                    {new Date(
                      selectedNotif?.createdAt ?? new Date()
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
              <button className="flex-1 bg-[#12B76A] text-white font-semibold py-3 rounded-full">
                Confirm
              </button>
              <button className="flex-1 border border-[#12B76A] text-[#12B76A] font-semibold py-3 rounded-full">
                Send report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
