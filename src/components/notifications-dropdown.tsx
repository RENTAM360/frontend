"use client";
import { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from "@/lib/redux/api/notificationsApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { socketService } from "@/lib/socket";
import { Notification } from "@/types/notifications";
import { Bell } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

export default function NotificationsDropdown() {
  const user = useAppSelector((state) => state.auth);
  const { data, isLoading, refetch } = useGetNotificationsQuery({ page: 1, limit: 10 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

 // Dummy notifications for testing UI
// const dummyNotifications: Notification[] = [
//   {
//     _id: "1",
//     title: "Welcome to the app",
//     details: "Your account has been created successfully.",
//     isRead: false,
//     type: "rental",
//     user: "personal",
//   },
//   {
//     _id: "2",
//     title: "New Message",
//     details: "You have a new message from David Okwudiri.",
//     isRead: true,
//     type: "rental",
//     user: "personal",
//   },
//   {
//     _id: "3",
//     title: "System Update",
//     details: "The app will be under maintenance tomorrow at 3 AM.",
//     isRead: false,
//     type: "rental",
//     user: "personal",
//   },
// ];

// Use real notifications if available, otherwise dummy
const notifications = data?.data

  console.log(notifications)

  useEffect(() => {
    if (!user?.data) return

    socketService.connect(user.data)

    const handleNotification = (newNotif: Notification) => {
      console.log("New notification received:", newNotif)
      refetch()
    }

    // Listen for notification events
    socketService.on("notification", handleNotification)

    return () => {
      socketService.off("notification", handleNotification)
    }
  }, [user?.data, refetch])

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
    <div className="z-50">
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
                      {!notif.isRead && (
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
    </div>
  );
}
