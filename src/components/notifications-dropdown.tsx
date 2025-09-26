"use client";
import { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from "@/lib/redux/api/notificationsApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { Notification } from "@/types/notifications";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import io from "socket.io-client";



let socket: ReturnType<typeof io> | null = null;

export default function NotificationsDropdown() {
  const user = useAppSelector((state) => state.auth);
  const { data, isLoading, refetch } = useGetNotificationsQuery({ page: 1, limit: 10 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

 // Dummy notifications for testing UI
const dummyNotifications: Notification[] = [
  {
    _id: "1",
    title: "Welcome to the app",
    details: "Your account has been created successfully.",
    isRead: false,
    type: "rental",
    user: "personal",
  },
  {
    _id: "2",
    title: "New Message",
    details: "You have a new message from David Okwudiri.",
    isRead: true,
    type: "rental",
    user: "personal",
  },
  {
    _id: "3",
    title: "System Update",
    details: "The app will be under maintenance tomorrow at 3 AM.",
    isRead: false,
    type: "rental",
    user: "personal",
  },
];

// Use real notifications if available, otherwise dummy
const notifications = data?.data?.length ? data.data : dummyNotifications;

  console.log(notifications)

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_AUTH_API_URL as string, {
        auth: {token: user.data},
        transports: ["websocket"],
      });
    }

    socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("⚠️ Socket connection error:", err.message);
  });

    socket.on("notification", (newNotif: Notification) => {
      console.log("New notification received:", newNotif);
      refetch();
    });

    return () => {
      socket?.off("notification");
    };
  }, [refetch, user.data]);

  return (
    <div className="mt-2 py-4 z-50">
      <div className="flex justify-between px-4 items-center mb-3">
        <h3 className="font-semibold text-black text-lg">All Notifications</h3>
        <button
          className="text-[#12B76A] text-sm"
          onClick={() => markAllAsRead()}
        >
          Mark all as read
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul className="">
          {notifications.map((notif: Notification) => (
            <li
              key={notif._id}
              className={`p-3 border-t border-[#EBEBEB] ${
                notif.isRead ? "bg-white" : "bg-[#F2FEF8]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                notif.isRead ? "bg-[#F2FEF8]" : "bg-white"
              }`}>
                  <Bell className="w-4 h-4 text-[#12B76A]" />
                </div>
                <div className="flex-1">
                  {/* <h4 className="font-medium">{notif.title}</h4> */}
                  <p className="text-sm text-gray-600">{notif.details}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#979797] mt-1">1 minute ago</p>
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
