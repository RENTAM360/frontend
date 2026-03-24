import type {
  MessagesResponse,
  MessagesWithEquipmentResponse,
  Message,
  Conversation,
  MessagesPayload,
  EquipmentBasic,
} from "@/types/messaging";
import { baseApi } from "./baseApi";

type MessageWithEquipment = Message & {
  equipment: EquipmentBasic;
};

function isMessageWithEquipment(msg: Message): msg is MessageWithEquipment {
  return (
    typeof (msg as unknown as Record<string, unknown>).equipment === "object"
  );
}

export const makeConvKey = (receiverId?: string, equipmentId?: string) => {
  if (!receiverId) return undefined;
  if (!equipmentId) return `direct::${receiverId}`;
  return `${receiverId}::${equipmentId}`;
};

export const messagingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/messages/conversations",
      transformResponse: (response: {
        status: string;
        data: Conversation[];
      }) => {
        console.log("[v0] Conversations API response:", response);
        if (!response.data || !Array.isArray(response.data)) {
          console.error(
            "[v0] Invalid conversations response format:",
            response
          );
          return [];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return response.data.flatMap((c: any) => {
          const uid = c.userId || c.receiverId || c.participant?.userId || c._id || "";
          if (!uid) return []; // skip entries with no usable ID
          return [{
            receiverId: uid,
            equipmentId: "",
            equipment: { name: "", media: [] },
            participant: {
              userId: uid,
              // null/empty name means admin account — show "Rentam360"
              name: c.name || c.participant?.name || "Rentam360",
              avatar: c.avatar || c.participant?.avatar || "",
            },
            lastMessage: c.lastMessage || "",
            lastMessageTime: c.lastMessageTime || "",
            lastMessageRead: (c.unreadCount ?? 0) === 0,
            unreadCount: c.unreadCount ?? 0,
            conversationId: c._id || c.conversationId || "",
          }];
        });
      },
      providesTags: ["Conversation"],
    }),

    getConversationsByEquipment: builder.query<Conversation[], void>({
      query: () => "/messages/conversations-by-equipment",
      transformResponse: (response: {
        status: string;
        data: Conversation[];
      }) => {
        console.log("[v1] Conversations by equipment API response:", response);
        if (!response.data || !Array.isArray(response.data)) return [];

        // Map participant.userId to receiverId for consistency
        const mappedConversations = response.data.map((c) => ({
          ...c,
          receiverId: c.receiverId || c.participant?.userId || "",
        }));

        // CRITICAL: Log conversations to verify backend is returning separate conversations per equipment
        console.log("[v1] Processed conversations:", {
          total: mappedConversations.length,
          conversations: mappedConversations.map((c) => ({
            receiverId: c.receiverId || c.participant?.userId,
            equipmentId: c.equipmentId,
            conversationId: c.conversationId,
            lastMessageRead: c.lastMessageRead,
            equipmentName: c.equipment?.name,
            key: makeConvKey(
              c.receiverId || c.participant?.userId,
              c.equipmentId
            ),
          })),
          // Group by receiver to see if backend is returning multiple per receiver
          groupedByReceiver: mappedConversations.reduce((acc, c) => {
            const receiverId = c.receiverId || c.participant?.userId || "";
            if (!acc[receiverId]) acc[receiverId] = [];
            acc[receiverId].push({
              equipmentId: c.equipmentId,
              equipmentName: c.equipment?.name,
            });
            return acc;
          }, {} as Record<string, { equipmentId: string; equipmentName?: string }[]>),
        });

        // Ensure all conversations have both receiverId and equipmentId
        const validConversations = mappedConversations.filter(
          (c) => (c.receiverId || c.participant?.userId) && c.equipmentId
        );

        if (validConversations.length !== mappedConversations.length) {
          console.warn(
            "[v1] Filtered out conversations without receiverId or equipmentId:",
            mappedConversations.length - validConversations.length
          );
        }

        return validConversations;
      },
      providesTags: (result) =>
        result
          ? result.map((c) => ({
              type: "Conversation" as const,
              id: makeConvKey(c.participant.userId, c.equipmentId),
            }))
          : ["Conversation"],
    }),

    // Get messages scoped by receiver + equipment
    getMessagesByEquipment: builder.query<
      MessagesPayload,
      { receiverId: string; equipmentId: string; currentUserId: string }
    >({
      query: ({ receiverId, equipmentId }) => ({
        url: `/messages/by-equipment/${receiverId}/${equipmentId}`,
      }),
      transformResponse: (
        response: MessagesWithEquipmentResponse,
        meta,
        arg
      ): MessagesPayload => {
        console.log("[v1] Messages by equipment response:", response);

        const payload = response.data;
        const messages = payload?.messages ?? [];

        // CRITICAL: Filter messages to ensure they match the requested equipmentId
        // This prevents messages from other equipment being included
        const filteredMessages = arg
          ? messages.filter((msg) => {
              const msgEquipmentId =
                typeof msg.equipment === "string"
                  ? msg.equipment
                  : (msg.equipment as Message)?._id || "";
              return msgEquipmentId === arg.equipmentId;
            })
          : messages;

        const equipment = payload?.equipment
          ? {
              _id: payload.equipment._id,
              name: payload.equipment.name,
              pricePerDay: payload.equipment.pricePerDay,
              rating: payload.equipment.rating,
              media: payload.equipment.media || [],
              category: payload.equipment.category,
            }
          : undefined;

        if (!Array.isArray(messages)) {
          console.error("[v1] Invalid messages response format:", response);
          return { messages: [] };
        }

        console.log("[v1] Filtered messages by equipment:", {
          requestedEquipmentId: arg?.equipmentId,
          totalMessages: messages.length,
          filteredCount: filteredMessages.length,
        });

        return {
          messages: filteredMessages,
          equipment,
        };
      },
      providesTags: (result, error, { receiverId, equipmentId }) => [
        { type: "Message", id: makeConvKey(receiverId, equipmentId) },
      ],
    }),

    // Get all messages with a specific receiver
    getMessages: builder.query<
      MessagesPayload,
      { receiverId: string; currentUserId: string }
    >({
      query: ({ receiverId }) => `/messages/${receiverId}`,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any): MessagesPayload => {
        console.log("[v0] Messages API response:", response);

        if (!response) return { messages: [] };

        // Handle raw array response
        if (Array.isArray(response)) {
          return { messages: response };
        }

        const payload = response.data;

        if (!payload) return { messages: [] };

        // Handle { data: [...] } — direct array in data
        if (Array.isArray(payload)) {
          return { messages: payload };
        }

        // Handle double-nested: { data: { messages: { messages: [...] } } }
        // or single-nested:     { data: { messages: [...] } }
        const messagesRaw = payload.messages;
        const messages = Array.isArray(messagesRaw)
          ? messagesRaw
          : Array.isArray(messagesRaw?.messages)
          ? messagesRaw.messages
          : [];
        const equipment = payload.equipment ?? undefined;

        return { messages, equipment };
      },
      providesTags: (result, error, { receiverId }) => [
        { type: "Message", id: receiverId },
      ],
    }),

    // Recent messages scoped by equipment
    getRecentMessagesByEquipment: builder.query<
      Message[],
      {
        receiverId: string;
        equipmentId: string;
        currentUserId: string;
        limit?: number;
      }
    >({
      query: ({ receiverId, equipmentId, limit = 20 }) => ({
        url: `/messages/recent-by-equipment/${receiverId}/${equipmentId}`,
        params: { limit },
      }),
      transformResponse: (
        response: MessagesWithEquipmentResponse
      ): Message[] => {
        console.log("[v1] Recent messages by equipment response:", response);
        const msgs = response.data?.messages ?? [];
        if (!Array.isArray(msgs)) return [];
        return msgs;
      },
      providesTags: (result, error, { receiverId, equipmentId }) => [
        {
          type: "Message",
          id: `recent-${makeConvKey(receiverId, equipmentId)}`,
        },
      ],
    }),

    // Recent messages not scoped to equipment (kept for backward compatibility)
    getRecentMessages: builder.query<
      Message[],
      { receiverId: string; currentUserId: string; limit?: number }
    >({
      query: ({ receiverId, limit = 20 }) => ({
        url: `/messages/recent-messages/${receiverId}`,
        params: { limit },
      }),
      transformResponse: (response: MessagesResponse): Message[] => {
        console.log("[v1] Recent messages response (legacy):", response);
        if (!response.data || !Array.isArray(response.data)) return [];
        return response.data;
      },
      providesTags: (result, error, { receiverId }) => [
        { type: "Message", id: `recent-legacy-${receiverId}` },
      ],
    }),

    // Get recent messages with a specific receiver (with limit)
    // getRecentMessages: builder.query<
    //   Message[],
    //   {
    //     receiverId: string;
    //     currentUserId: string;
    //     limit?: number;
    //   }
    // >({
    //   query: ({ receiverId, limit = 20 }) => ({
    //     url: `/messages/recent-messages/${receiverId}`,
    //     params: { limit },
    //   }),
    //   transformResponse: (response: MessagesResponse): Message[] => {
    //     console.log("[v0] Recent messages API response:", response);
    //     if (!response.data || !Array.isArray(response.data)) {
    //       console.error(
    //         "[v0] Invalid recent messages response format:",
    //         response
    //       );
    //       return [];
    //     }
    //     return response.data;
    //   },
    //   providesTags: (result, error, { receiverId }) => [
    //     { type: "Message", id: `recent-${receiverId}` },
    //   ],
    // }),

    addMessageOptimistic: builder.mutation<
      Message,
      {
        receiverId: string;
        equipmentId: string | undefined;
        message: Message;
        currentUserId: string;
      }
    >({
      queryFn: async ({ message }) => ({ data: message }),
      onQueryStarted: async (
        { receiverId, equipmentId, message, currentUserId },
        { dispatch, queryFulfilled }
      ) => {
        // update messages query cache for this equipment-scoped conversation
        const patchResult = dispatch(
          messagingApi.util.updateQueryData(
            "getMessagesByEquipment",
            { receiverId, equipmentId: equipmentId ?? "", currentUserId },
            (draft) => {
              if (!draft.messages) draft.messages = [];
              draft.messages.push(message);
              if (!draft.equipment && isMessageWithEquipment(message)) {
                draft.equipment = message.equipment;
              }
            }
          )
        );
        // Update recent messages
        dispatch(
          messagingApi.util.updateQueryData(
            "getRecentMessagesByEquipment",
            { receiverId, equipmentId: equipmentId ?? "", currentUserId },
            (draft) => {
              draft.push(message);
              if (draft.length > 20) draft.splice(0, draft.length - 20);
            }
          )
        );

        // Update conversations list lastMessage/time optimistically
        dispatch(
          messagingApi.util.updateQueryData(
            "getConversationsByEquipment",
            undefined,
            (draft) => {
              const conv = draft.find(
                (c) =>
                  c.participant.userId === receiverId &&
                  (equipmentId ? c.equipmentId === equipmentId : !c.equipmentId)
              );
              if (conv) {
                conv.lastMessage = message.content;
                conv.lastMessageTime = message.createdAt;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { receiverId, equipmentId }) => [
        { type: "Message", id: makeConvKey(receiverId, equipmentId) },
        {
          type: "Message",
          id: `recent-${makeConvKey(receiverId, equipmentId)}`,
        },
        "Conversation",
      ],
    }),
    // Optimistic update for new messages (used with socket)
    // addMessage: builder.mutation<
    //   Message,
    //   {
    //     receiverId: string;
    //     message: Message;
    //     currentUserId: string;
    //   }
    // >({
    //   queryFn: async ({ message }) => {
    //     // This is an optimistic update - the actual sending happens via socket
    //     return { data: message };
    //   },
    //   onQueryStarted: async (
    //     { receiverId, message, currentUserId },
    //     { dispatch, queryFulfilled }
    //   ) => {
    //     // Optimistically update the messages cache
    //     const patchResult = dispatch(
    //       messagingApi.util.updateQueryData(
    //         "getMessages",
    //         {
    //           receiverId,
    //           currentUserId: message.sender === "user" ? "current" : receiverId,
    //         },
    //         (draft) => {
    //           if (!Array.isArray(draft.messages)) {
    //             draft.messages = [];
    //           }

    //           draft.messages.push(message);

    //           if (
    //             !draft.equipment &&
    //             message.equipment &&
    //             typeof message.equipment !== "string"
    //           ) {
    //             draft.equipment = message.equipment;
    //           }
    //         }
    //       )
    //     );

    //     // Also update recent messages cache
    //     dispatch(
    //       messagingApi.util.updateQueryData(
    //         "getRecentMessages",
    //         {
    //           receiverId,
    //           currentUserId:
    //             message.sender === "user" ? currentUserId : receiverId,
    //         },
    //         (draft) => {
    //           const apiMessage: Message = {
    //             _id: message._id,
    //             sender: message.sender === "user" ? currentUserId : receiverId,
    //             receiver:
    //               message.sender === "user" ? receiverId : currentUserId,
    //             content: message.content,
    //             read: message.read ?? false,
    //             createdAt: message.createdAt,
    //             updatedAt: message.updatedAt,
    //             __v: message.__v,
    //           };

    //           draft.push(apiMessage);

    //           // Keep only 20 most recent
    //           if (draft.length > 20) {
    //             draft.splice(0, draft.length - 20);
    //           }
    //         }
    //       )
    //     );
    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       // Revert optimistic update on failure
    //       patchResult.undo();
    //     }
    //   },
    //   invalidatesTags: (result, error, { receiverId }) => [
    //     { type: "Message", id: receiverId },
    //     { type: "Message", id: `recent-${receiverId}` },
    //     "Conversation", // Update conversation list to show new last message
    //   ],
    // }),

    // Mark messages as read (optimistic update + socket event)
    // Note: No HTTP endpoint exists, so we use socket events and optimistic updates
    // The backend should update unreadCount when processing the socket event
    markMessagesAsRead: builder.mutation<
      null,
      { receiverId: string; equipmentId: string; currentUserId: string }
    >({
      queryFn: async () => ({ data: null }),
      onQueryStarted: async (
        { receiverId, equipmentId, currentUserId },
        { dispatch, queryFulfilled }
      ) => {
        // Optimistic updates for immediate UI feedback
        const patches = [
          dispatch(
            messagingApi.util.updateQueryData(
              "getMessagesByEquipment",
              { receiverId, equipmentId, currentUserId },
              (draft) => {
                draft.messages?.forEach((m) => {
                  if (m.sender !== currentUserId) m.read = true;
                });
              }
            )
          ),
          dispatch(
            messagingApi.util.updateQueryData(
              "getRecentMessagesByEquipment",
              { receiverId, equipmentId, currentUserId },
              (draft) => {
                draft.forEach((m) => {
                  if (m.sender !== currentUserId) m.read = true;
                });
              }
            )
          ),
          // Update unreadCount in conversations list for this specific equipment
          dispatch(
            messagingApi.util.updateQueryData(
              "getConversationsByEquipment",
              undefined,
              (draft) => {
                const conv = draft.find(
                  (c) =>
                    c.participant.userId === receiverId &&
                    c.equipmentId === equipmentId
                );
                if (conv) {
                  conv.unreadCount = 0;
                }
              }
            )
          ),
        ];

        try {
          await queryFulfilled;
          // Invalidate conversations to trigger refetch and get updated unreadCount from backend
          // The backend should have updated unreadCount when processing the socket event
          // Use a small delay to ensure backend has processed the socket event
          setTimeout(() => {
            dispatch(messagingApi.util.invalidateTags(["Conversation"]));
          }, 500);
        } catch (error) {
          console.error(
            "[Messaging] ❌ Failed to mark messages as read:",
            error
          );
          patches.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ["Conversation"],
    }),

    // Update conversation last message (used when socket receives new message)
    updateConversationLastMessage: builder.mutation<
      null,
      {
        receiverId: string;
        equipmentId: string;
        lastMessage: string;
        lastMessageTime: string;
      }
    >({
      queryFn: async () => ({ data: null }),
      onQueryStarted: async (
        { receiverId, equipmentId, lastMessage, lastMessageTime },
        { dispatch }
      ) => {
        dispatch(
          messagingApi.util.updateQueryData(
            "getConversationsByEquipment",
            undefined,
            (draft) => {
              const conv = draft.find(
                (c) =>
                  c.participant.userId === receiverId &&
                  c.equipmentId === equipmentId
              );
              if (conv) {
                conv.lastMessage = lastMessage;
                conv.lastMessageTime = lastMessageTime;
                const idx = draft.indexOf(conv);
                if (idx > 0) {
                  draft.splice(idx, 1);
                  draft.unshift(conv);
                }
              }
            }
          )
        );
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useGetRecentMessagesQuery,
  useGetConversationsByEquipmentQuery,
  useGetMessagesByEquipmentQuery,
  useGetRecentMessagesByEquipmentQuery,
  useAddMessageOptimisticMutation,
  useMarkMessagesAsReadMutation,
  useUpdateConversationLastMessageMutation,
} = messagingApi;
