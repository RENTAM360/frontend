import { Notification } from "@/types/notifications";
import { baseApi } from "./baseApi";


interface NotificationListResponse {
  message: string;
  data: Notification[];
}

interface NotificationDetailsResponse {
  message: string;
  data: Notification;
}

export const notificationsApi = baseApi.injectEndpoints({ 
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      { page?: number; limit?: number; isRead?: boolean }
    >({
      query: ({ page = 1, limit = 20, isRead = false }) => ({
        url: "/notifications",
        params: { page, limit, isRead },
      }),
      providesTags: ["Notifications"],
    }),

    getNotification: builder.query<NotificationDetailsResponse, string>({
      query: (notificationId) => `/notifications/${notificationId}`,
    }),

    markAsRead: builder.mutation<{ message: string }, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllAsRead: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
