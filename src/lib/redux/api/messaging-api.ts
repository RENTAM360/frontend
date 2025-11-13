import type {
  MessagesResponse,
  MessagesWithEquipmentResponse,
  Message,
  Conversation,
  MessagesPayload,
} from "@/types/messaging"
import { baseApi } from "./baseApi"

export const messagingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/messages/conversations",
      transformResponse: (response: { status: string; data: Conversation[] }) => {
        console.log("[v0] Conversations API response:", response)
        if (!response.data || !Array.isArray(response.data)) {
          console.error("[v0] Invalid conversations response format:", response)
          return []
        }
        return response.data
      },
      providesTags: ["Conversation"],
    }),

    // Get all messages with a specific receiver
    getMessages: builder.query<MessagesPayload, { receiverId: string; currentUserId: string }>({
      query: ({ receiverId }) => `/messages/${receiverId}`,

      transformResponse: (response: MessagesWithEquipmentResponse): MessagesPayload => {
        console.log("[v0] Messages API response:", response)

        const payload = response.data?.messages
        const messages = payload?.messages ?? []

        if (!Array.isArray(messages)) {
          console.error("[v0] Invalid messages response format:", response)
          return { messages: [] }
        }

        const equipment = payload?.equipment ?? undefined

        return {
          messages,
          equipment,
        }
      },
      providesTags: (result, error, { receiverId }) => [{ type: "Message", id: receiverId }],
    }),

    // Get recent messages with a specific receiver (with limit)
    getRecentMessages: builder.query<
      Message[],
      {
        receiverId: string
        currentUserId: string
        limit?: number
      }
    >({
      query: ({ receiverId, limit = 20 }) => ({
        url: `/messages/recent-messages/${receiverId}`,
        params: { limit },
      }),
      transformResponse: (response: MessagesResponse): Message[] => {
        console.log("[v0] Recent messages API response:", response)
        if (!response.data || !Array.isArray(response.data)) {
          console.error("[v0] Invalid recent messages response format:", response)
          return []
        }
        return response.data
      },
      providesTags: (result, error, { receiverId }) => [{ type: "Message", id: `recent-${receiverId}` }],
    }),

    // Optimistic update for new messages (used with socket)
    addMessage: builder.mutation<
      Message,
      {
        receiverId: string
        message: Message
        currentUserId: string
      }
    >({
      queryFn: async ({ message }) => {
        // This is an optimistic update - the actual sending happens via socket
        return { data: message }
      },
      onQueryStarted: async ({ receiverId, message, currentUserId }, { dispatch, queryFulfilled }) => {
        // Optimistically update the messages cache
        const patchResult = dispatch(
          messagingApi.util.updateQueryData(
            "getMessages",
            { receiverId, currentUserId: message.sender === "user" ? "current" : receiverId },
            (draft) => {
              if (!Array.isArray(draft.messages)) {
                draft.messages = []
              }

              draft.messages.push(message)

              if (!draft.equipment && message.equipment && typeof message.equipment !== "string") {
                draft.equipment = message.equipment
              }
            },
          ),
        )

        // Also update recent messages cache
        dispatch(
          messagingApi.util.updateQueryData(
            "getRecentMessages",
            {
              receiverId,
              currentUserId: message.sender === "user" ? currentUserId : receiverId,
            },
            (draft) => {
              const apiMessage: Message = {
                _id: message._id,
                sender: message.sender === "user" ? currentUserId : receiverId,
                receiver: message.sender === "user" ? receiverId : currentUserId,
                content: message.content,
                read: message.read ?? false,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                __v: message.__v
              }

              draft.push(apiMessage)

              // Keep only 20 most recent
              if (draft.length > 20) {
                draft.splice(0, draft.length - 20)
              }
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          // Revert optimistic update on failure
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, { receiverId }) => [
        { type: "Message", id: receiverId },
        { type: "Message", id: `recent-${receiverId}` },
        "Conversation", // Update conversation list to show new last message
      ],
    }),

    // Mark messages as read (optimistic update)
    markMessagesAsRead: builder.mutation<null, { receiverId: string; currentUserId: string }>({
      queryFn: async () => {
        // The actual marking happens via socket
        return { data: null }
      },
      onQueryStarted: async ({ receiverId, currentUserId }, { dispatch, queryFulfilled }) => {
        // Optimistically update messages to mark them as read
        const patchResults = [
          dispatch(
            messagingApi.util.updateQueryData("getMessages", { receiverId, currentUserId }, (draft) => {
              draft.messages?.forEach((message) => {
                if (message.sender === "other") {
                  message.read = true
                }
              })
            }),
          ),
          dispatch(
            messagingApi.util.updateQueryData(
              "getRecentMessages",
              { receiverId, currentUserId: "current" },
              (draft) => {
                draft.forEach((message) => {
                  if (message.sender === "other") {
                    message.read = true
                  }
                })
              },
            ),
          ),
        ]

        try {
          await queryFulfilled
        } catch {
          // Revert optimistic updates on failure
          patchResults.forEach((patch) => patch.undo())
        }
      },
      invalidatesTags: ["Conversation"], // Update unread counts
    }),

    // Update conversation last message (used when receiving new messages)
    updateConversationLastMessage: builder.mutation<
      null,
      {
        conversationId: string
        lastMessage: string
        lastMessageTime: string
      }
    >({
      queryFn: async () => ({ data: null }),
      onQueryStarted: async ({ conversationId, lastMessage, lastMessageTime }, { dispatch }) => {
        dispatch(
          messagingApi.util.updateQueryData("getConversations", undefined, (draft) => {
            const conversation = draft.find((conv) => conv.userId === conversationId)
            if (conversation) {
              conversation.lastMessage = lastMessage
              conversation.lastMessageTime = lastMessageTime
              // Move conversation to top of list
              const index = draft.indexOf(conversation)
              if (index > 0) {
                draft.splice(index, 1)
                draft.unshift(conversation)
              }
            }
          }),
        )
      },
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useGetRecentMessagesQuery,
  useAddMessageMutation,
  useMarkMessagesAsReadMutation,
  useUpdateConversationLastMessageMutation,
} = messagingApi
