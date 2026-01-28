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
  useGetMessagesByEquipmentQuery,
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
    equipmentId: string,
    conv?: Conversation
  ) => void;
  sendMessage: (
    receiverId: string,
    equipmentId: string,
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
  const incomingMessagesRef = useRef<Map<string, Message[]>>(new Map());
  const [tempConversation, setTempConversation] = useState<Conversation | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // RTK Query hooks
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useGetConversationsByEquipmentQuery();

  const { data: messagesData, isLoading: isLoadingMessages } =
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
        )?.conversationId;

      if (!finalConvId) {
        console.warn("[Messaging] No conversationId found to mark as read");
        return;
      }

      console.log(`Emitting mark_messages for: ${finalConvId}`);

      socketService.rawSocket?.emit(
        "read_message",
        finalConvId,
        (response: { ok: boolean; error?: string }) => {
          if (response.ok) {
            console.log(`Conv ${finalConvId} marked as read`);
          }
        }
      );

      // Update cache optimistically
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
    },
    [currentUserId, isConnected, conversations, dispatch]
  );

  // Merge messages from query and socket
  const messages = useMemo(() => {
    if (!activeConversationId) return [];

    const convKey = makeConvKey(
      activeConversationId.receiverId,
      activeConversationId.equipmentId
    );
    if (!convKey) return [];

    const queryMessages = messagesData?.messages ?? [];
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
  }, [messagesData?.messages, activeConversationId]);

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

      if (!equipmentId) return;

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
        equipment: equipmentId,
      };

      const convKey = makeConvKey(receiverId, equipmentId);
      if (!convKey) return;

      const existingMessages = incomingMessagesRef.current.get(convKey) ?? [];
      if (!existingMessages.some((m) => m._id === message._id)) {
        incomingMessagesRef.current.set(convKey, [
          ...existingMessages,
          message,
        ]);
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
  }, [currentUserId, authToken]);

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
    (receiverId: string, equipmentId: string, conv?: Conversation) => {
      setActiveConversationId({ receiverId, equipmentId });

      if (conv) {
        setTempConversation(conv);
      }

      if (isConnected) {
        socketService.joinChat(receiverId);
      }

      // Update cache
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
    },
    [isConnected, dispatch]
  );

  const sendMessage = useCallback(
    async (receiverId: string, equipmentId: string, content: string) => {
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
              addMessageOptimistic({
                receiverId,
                equipmentId,
                message: response.data as Message,
                currentUserId,
              });
              resolve();
            } else {
              reject(new Error(response.error ?? "Failed to send message"));
            }
          }
        );
      });
    },
    [currentUserId, addMessageOptimistic, authToken]
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
