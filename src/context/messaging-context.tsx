"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  useGetConversationsByEquipmentQuery,
  useGetConversationsQuery,
  useGetMessagesByEquipmentQuery,
  useGetMessagesQuery,
  useAddMessageOptimisticMutation,
  messagingApi,
  makeConvKey,
} from "@/lib/redux/api/messaging-api";
import type {
  Conversation,
  Message,
  MessagingState,
  ConversationId,
} from "@/types/messaging";
import { type SocketMessage, socketService } from "@/lib/socket";
import { useAppDispatch } from "@/lib/redux/hooks";

interface MessagingContextType extends MessagingState {
  joinConversation: (
    receiverId: string,
    equipmentId: string | undefined,
    conv?: Conversation
  ) => void;
  sendMessage: (
    receiverId: string,
    equipmentId: string | undefined,
    content: string
  ) => Promise<void>;
  markAsRead: (
    receiverId: string,
    equipmentId: string,
    conversationId: string
  ) => void;
  setActiveConversationId: React.Dispatch<
    React.SetStateAction<ConversationId | null>
  >;
  connect: (authToken: string) => Promise<void>;
  disconnect: () => void;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  connectionError: string | null;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

export function MessagingProvider({
  children,
  currentUserId,
  authToken,
}: {
  children: React.ReactNode;
  currentUserId?: string | null;
  authToken?: string | null;
}) {
  const [activeConversationId, setActiveConversationId] =
    useState<ConversationId | null>(null);
  const activeConversationIdRef = useRef<ConversationId | null>(null);
  // Keep ref in sync so socket handlers can read latest value without stale closure
  activeConversationIdRef.current = activeConversationId;
  const incomingMessagesRef = useRef<Map<string, Message[]>>(new Map());
  const [tempConversation, setTempConversation] = useState<Conversation | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messagesVersion, setMessagesVersion] = useState(0);
  const dispatch = useAppDispatch();

  // RTK Query hooks
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useGetConversationsByEquipmentQuery();
  const { data: directConversations = [] } = useGetConversationsQuery();

  const { data: messagesData, isLoading: isLoadingMessagesByEquipment } =
    useGetMessagesByEquipmentQuery(
      {
        receiverId: activeConversationId?.receiverId ?? "",
        equipmentId: activeConversationId?.equipmentId ?? "",
        currentUserId: currentUserId ?? "",
      },
      {
        skip:
          !activeConversationId ||
          !currentUserId ||
          !activeConversationId.receiverId ||
          !activeConversationId.equipmentId,
      }
    );

  // Used for admin direct messages (no equipment)
  const { data: directMessagesData, isLoading: isLoadingDirectMessages } =
    useGetMessagesQuery(
      {
        receiverId: activeConversationId?.receiverId ?? "",
        currentUserId: currentUserId ?? "",
      },
      {
        skip:
          !activeConversationId ||
          !currentUserId ||
          !activeConversationId.receiverId ||
          !!activeConversationId.equipmentId, // only when NO equipmentId
        refetchOnMountOrArgChange: true,
      }
    );

  const isLoadingMessages = isLoadingMessagesByEquipment || isLoadingDirectMessages;

  const [addMessageOptimistic] = useAddMessageOptimisticMutation();

  const markAsRead = useCallback(
    (receiverId: string, equipmentId: string, conversationId?: string) => {
      if (!currentUserId || !isConnected) return;

      const finalConvId =
        conversationId ||
        conversations.find(
          (c) =>
            (c.participant?.userId === receiverId ||
              c.receiverId === receiverId) &&
            c.equipmentId === equipmentId
        )?.conversationId ||
        directConversations.find(
          (c) =>
            (c.participant?.userId === receiverId ||
              c.receiverId === receiverId) &&
            !c.equipmentId
        )?.conversationId;

      // Always clear unread count in caches regardless of whether we have a conversationId
      if (!equipmentId) {
        dispatch(
          messagingApi.util.updateQueryData("getConversations", undefined, (draft) => {
            // Use forEach to clear ALL matching entries (handles stale duplicates)
            draft.forEach((conv) => {
              if (
                (conv.receiverId === receiverId || conv.participant?.userId === receiverId) &&
                !conv.equipmentId
              ) {
                conv.unreadCount = 0;
              }
            });
          })
        );
      } else {
        dispatch(
          messagingApi.util.updateQueryData(
            "getConversationsByEquipment",
            undefined,
            (draft) => {
              const conv = draft.find((c) => c.conversationId === finalConvId);
              if (conv) conv.unreadCount = 0;
            }
          )
        );
      }

      // For direct conversations, the API may not return a conversationId —
      // fall back to the receiverId so the socket event is still emitted
      const idToEmit = finalConvId || (!equipmentId ? receiverId : null);

      if (!idToEmit) {
        console.warn("[Messaging] No conversationId found to mark as read");
        return;
      }

      socketService.rawSocket?.emit(
        "read_message",
        idToEmit,
        (response: { ok: boolean; error?: string }) => {
          if (response.ok) {
            console.log(`Marked as read: ${idToEmit}`);
          }
        }
      );
    },
    [currentUserId, isConnected, conversations, directConversations, dispatch]
  );

  // Merge messages from query and socket
  const messages = useMemo(() => {
    if (!activeConversationId) return [];

    const convKey = makeConvKey(
      activeConversationId.receiverId,
      activeConversationId.equipmentId
    );
    if (!convKey) return [];

    void messagesVersion; // trigger re-evaluation when socket messages are stored in ref
    const queryMessages = activeConversationId.equipmentId
      ? (messagesData?.messages ?? [])
      : (directMessagesData?.messages ?? []);
    const socketMessages = incomingMessagesRef.current.get(convKey) ?? [];

    const allMessages = [...queryMessages, ...socketMessages];
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg._id, msg])).values()
    );
    uniqueMessages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return uniqueMessages;
  }, [messagesData?.messages, directMessagesData?.messages, activeConversationId, messagesVersion]);

  // Socket event handling
  useEffect(() => {
    // Ensure socket is connected when we have an auth token
    if (!socketService.rawSocket && authToken) {
      console.log("[Messaging] Connecting socket from MessagingProvider");
      socketService.connect(authToken);
    }

    if (!socketService.rawSocket) return;

    const socket = socketService.rawSocket;

    const handleConnect = () => {
      console.log("[Messaging] ✅ Socket connected");
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      console.log("[Messaging] ❌ Socket disconnected");
      setIsConnected(false);
    };

    const handleError = (err: Error) => {
      console.error("[Messaging] ⚠️ Connection error:", err.message);
      setConnectionError(err.message);
    };

    const handleMessage = (socketMessage: SocketMessage) => {
      if (!currentUserId) return;

      const equipmentId =
        typeof socketMessage.equipment === "string"
          ? socketMessage.equipment
          : socketMessage.equipment?._id || "";

      const receiverId =
        socketMessage.sender === currentUserId
          ? socketMessage.receiver
          : socketMessage.sender;

      const message: Message = {
        _id: socketMessage._id,
        content: socketMessage.content,
        receiver: socketMessage.receiver,
        sender: socketMessage.sender,
        createdAt: socketMessage.createdAt,
        updatedAt: socketMessage.updatedAt,
        read: socketMessage.read,
        equipment: equipmentId || undefined,
      };

      const convKey = makeConvKey(receiverId, equipmentId || undefined);
      if (!convKey) return;

      const existingMessages = incomingMessagesRef.current.get(convKey) ?? [];
      if (!existingMessages.some((m) => m._id === message._id)) {
        incomingMessagesRef.current.set(convKey, [
          ...existingMessages,
          message,
        ]);
        setMessagesVersion((v) => v + 1);
      }

      // For direct messages, patch caches instantly (no network request needed)
      if (!equipmentId) {
        // Patch conversation list — update existing entry or refetch if not found yet
        let convFound = false;
        dispatch(
          messagingApi.util.updateQueryData("getConversations", undefined, (draft) => {
            const existing = draft.find(
              (c) => (c.receiverId === receiverId || c.participant?.userId === receiverId) && !c.equipmentId
            );
            if (existing) {
              convFound = true;
              existing.lastMessage = message.content;
              existing.lastMessageTime = message.createdAt;
              // Only increment unread if message is from someone else AND this conv isn't currently open
              const activeConvId = activeConversationIdRef.current;
              const isActiveConv = activeConvId?.receiverId === receiverId && !activeConvId?.equipmentId;
              if (message.sender !== currentUserId && !isActiveConv) {
                existing.unreadCount = (existing.unreadCount ?? 0) + 1;
              } else if (isActiveConv) {
                existing.unreadCount = 0;
              }
            }
          })
        );
        // If no existing conversation entry, refetch to get proper names from the API
        if (!convFound) {
          dispatch(messagingApi.util.invalidateTags(["Conversation"]));
        }

        // Patch message history cache so the message view shows it immediately
        dispatch(
          messagingApi.util.updateQueryData(
            "getMessages",
            { receiverId, currentUserId },
            (draft) => {
              if (!Array.isArray(draft.messages)) draft.messages = [];
              if (!draft.messages.some((m) => m._id === message._id)) {
                draft.messages.push(message);
              }
            }
          )
        );
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("chat", handleMessage);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("chat", handleMessage);
    };
  }, [currentUserId, authToken, dispatch]);

  // Auto-trigger mark as read when conversation becomes active
  useEffect(() => {
    if (!activeConversationId || !isConnected) return;

    // Wait for messages to load before marking as read
    if (isLoadingMessages) return;

    const timer = setTimeout(() => {
      markAsRead(
        activeConversationId.receiverId,
        activeConversationId.equipmentId
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [activeConversationId, isConnected, isLoadingMessages, markAsRead]);

  const joinConversation = useCallback(
    (receiverId: string, equipmentId: string | undefined, conv?: Conversation) => {
      setActiveConversationId({ receiverId, equipmentId: equipmentId ?? "" });

      if (conv) {
        setTempConversation(conv);
      }

      if (isConnected) {
        socketService.joinChat(receiverId);
      }

      // Only update equipment-based cache when equipmentId is present
      if (equipmentId) {
        dispatch(
          messagingApi.util.updateQueryData(
            "getConversationsByEquipment",
            undefined,
            (draft) => {
              const c = draft.find(
                (c) =>
                  (c.participant?.userId === receiverId ||
                    c.receiverId === receiverId) &&
                  c.equipmentId === equipmentId
              );
              if (c) {
                c.unreadCount = 0;
                if (conv?.equipment) {
                  c.equipment = conv.equipment;
                }
              }
            }
          )
        );
      }
    },
    [isConnected, dispatch]
  );

  const sendMessage = useCallback(
    async (receiverId: string, equipmentId: string | undefined, content: string) => {
      if (!currentUserId) {
        throw new Error("Not connected");
      }

      // If socket isn't created yet but we have a token, try to connect on demand
      if (!socketService.rawSocket && authToken) {
        console.log("[Messaging] sendMessage: connecting socket on demand");
        socketService.connect(authToken);
      }

      if (!socketService.rawSocket) {
        throw new Error("Not connected");
      }

      return new Promise<void>((resolve, reject) => {
        socketService.sendMessage(
          receiverId,
          content,
          equipmentId,
          (response) => {
            if (response.ok) {
              const sentMessage = response.data as Message;
              if (!equipmentId) {
                // Direct message — store in ref for instant display
                const convKey = `direct::${receiverId}`;
                const existing = incomingMessagesRef.current.get(convKey) ?? [];
                if (!existing.some((m) => m._id === sentMessage._id)) {
                  incomingMessagesRef.current.set(convKey, [...existing, sentMessage]);
                  setMessagesVersion((v) => v + 1);
                }
                // Patch the conversation list cache instantly
                let sentConvFound = false;
                dispatch(
                  messagingApi.util.updateQueryData("getConversations", undefined, (draft) => {
                    const conv = draft.find(
                      (c) => (c.receiverId === receiverId || c.participant?.userId === receiverId) && !c.equipmentId
                    );
                    if (conv) {
                      sentConvFound = true;
                      conv.lastMessage = sentMessage.content;
                      conv.lastMessageTime = sentMessage.createdAt;
                    }
                  })
                );
                if (!sentConvFound) {
                  dispatch(messagingApi.util.invalidateTags(["Conversation"]));
                }
                // Patch the message history cache so sent message shows immediately
                dispatch(
                  messagingApi.util.updateQueryData(
                    "getMessages",
                    { receiverId, currentUserId },
                    (draft) => {
                      if (!Array.isArray(draft.messages)) draft.messages = [];
                      if (!draft.messages.some((m) => m._id === sentMessage._id)) {
                        draft.messages.push(sentMessage);
                      }
                    }
                  )
                );
              } else {
                addMessageOptimistic({
                  receiverId,
                  equipmentId,
                  message: sentMessage,
                  currentUserId,
                });
              }
              resolve();
            } else {
              reject(new Error(response.error ?? "Failed to send message"));
            }
          }
        );
      });
    },
    [currentUserId, addMessageOptimistic, authToken, setMessagesVersion, dispatch]
  );

  const connect = useCallback(async (authToken: string) => {
    socketService.connect(authToken);
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;

    const found = conversations.find(
      (c) =>
        (c.participant?.userId === activeConversationId.receiverId ||
          c.receiverId === activeConversationId.receiverId) &&
        c.equipmentId === activeConversationId.equipmentId
    );

    return found || tempConversation;
  }, [conversations, activeConversationId, tempConversation]);

  useEffect(() => {
    if (
      activeConversationId &&
      conversations.some(
        (c) =>
          c.participant?.userId === activeConversationId.receiverId &&
          c.equipmentId === activeConversationId.equipmentId
      )
    ) {
      setTempConversation(null);
    }
  }, [activeConversationId, conversations]);

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        activeConversation,
        activeConversationId,
        messages,
        currentUserId: currentUserId ?? null,
        isLoadingConversations,
        isLoadingMessages,
        isConnected,
        connectionError,
        joinConversation,
        sendMessage,
        markAsRead,
        setActiveConversationId,
        connect,
        disconnect,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessagingContext() {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error(
      "useMessagingContext must be used within MessagingProvider"
    );
  }
  return context;
}
