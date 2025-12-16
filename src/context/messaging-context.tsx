"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
// import { socketService, type SocketMessage, type SocketResponse } from "@/lib/socket-service"
import {
  useGetConversationsByEquipmentQuery,
  useGetMessagesByEquipmentQuery,
  useAddMessageOptimisticMutation,
  useMarkMessagesAsReadMutation,
  messagingApi,
  makeConvKey,
} from "@/lib/redux/api/messaging-api";
import type {
  Conversation,
  Message,
  MessagingState,
  ConversationId,
  Equipment,
} from "@/types/messaging";
import { SocketMessage, SocketResponse, socketService } from "@/lib/socket";
import { useAppDispatch } from "@/lib/redux/hooks";

interface MessagingContextType extends MessagingState {
  // Actions
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
  markAsRead: (receiverId: string, equipmentId: string) => void;
  setActiveConversationId: React.Dispatch<
    React.SetStateAction<ConversationId | null>
  >;

  // Connection management
  connect: (authToken: string) => Promise<void>;
  disconnect: () => void;

  // Loading states
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;

  // Connection error
  connectionError: string | null;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

interface MessagingProviderProps {
  children: React.ReactNode;
  currentUserId?: string | null;
  authToken?: string | null;
}

export function MessagingProvider({
  children,
  currentUserId,
  authToken,
}: MessagingProviderProps) {
  const [activeConversationId, setActiveConversationId] =
    useState<ConversationId | null>(null);

  // Track incoming messages from socket to merge with query results
  const incomingMessagesRef = useRef<Map<string, Message[]>>(new Map());
  // State to trigger re-renders when new messages arrive
  const [messageUpdateCounter, setMessageUpdateCounter] = useState(0);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const tempConversationRef = useRef<Conversation | null>(null);
  const dispatch = useAppDispatch();

  // Refs for cleanup
  const cleanupFunctions = useRef<(() => void)[]>([]);
  const isConnectingRef = useRef(false);

  // RTK Query hooks - use equipment-based API
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useGetConversationsByEquipmentQuery();

  console.log("Fetching messages for:", {
    activeConversationId,
    currentUserId,
  });

  const {
    data: messagesData,
    currentData: currentMessagesData,
    originalArgs: messagesQueryArgs,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetMessagesByEquipmentQuery(
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

  const messagesPayload = useMemo(() => {
    const latestPayload = currentMessagesData ?? messagesData;

    if (!latestPayload) {
      return undefined;
    }

    // Check if query args match current active conversation
    if (
      messagesQueryArgs?.receiverId !== activeConversationId?.receiverId ||
      messagesQueryArgs?.equipmentId !== activeConversationId?.equipmentId
    ) {
      return undefined;
    }

    return latestPayload;
  }, [
    currentMessagesData,
    messagesData,
    messagesQueryArgs?.receiverId,
    messagesQueryArgs?.equipmentId,
    activeConversationId,
  ]);

  // When activeConversationId changes, ensure we pick up any stored socket messages
  // and trigger a recalculation
  useEffect(() => {
    if (!activeConversationId) return;

    const convKey = makeConvKey(
      activeConversationId.receiverId,
      activeConversationId.equipmentId
    );

    if (convKey && currentUserId) {
      const storedSocketMessages =
        incomingMessagesRef.current.get(convKey) ?? [];
      if (storedSocketMessages.length > 0) {
        console.log(
          "[Messaging] 🔵 Found stored socket messages when opening conversation:",
          {
            convKey,
            storedCount: storedSocketMessages.length,
            messageIds: storedSocketMessages.map((m) => m._id),
            messageContents: storedSocketMessages.map((m) =>
              m.content.substring(0, 30)
            ),
          }
        );

        // CRITICAL: Merge stored socket messages into cache immediately
        dispatch(
          messagingApi.util.updateQueryData(
            "getMessagesByEquipment",
            {
              receiverId: activeConversationId.receiverId,
              equipmentId: activeConversationId.equipmentId,
              currentUserId,
            },
            (draft) => {
              if (!Array.isArray(draft.messages)) {
                draft.messages = [];
              }
              // Merge stored socket messages into cache
              storedSocketMessages.forEach((msg) => {
                const exists = draft.messages.some((m) => m._id === msg._id);
                if (!exists) {
                  draft.messages.push(msg);
                }
              });
              // Sort by createdAt
              draft.messages.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
              console.log(
                "[Messaging] ✅ Merged stored socket messages into cache, total:",
                draft.messages.length
              );
            }
          )
        );

        // Force recalculation to include these messages
        setMessageUpdateCounter((prev) => prev + 1);
      }
    }
  }, [
    activeConversationId,
    activeConversationId?.receiverId,
    activeConversationId?.equipmentId,
    currentUserId,
    dispatch,
  ]);

  // Clear incoming messages when query data is successfully loaded and matches
  // Only clear messages that are confirmed to be in the query cache
  // Keep messages that arrived recently (within last 10 seconds) to ensure they're visible
  useEffect(() => {
    if (!messagesPayload || !activeConversationId) return;

    const convKey = makeConvKey(
      activeConversationId.receiverId,
      activeConversationId.equipmentId
    );
    if (convKey && messagesPayload.messages.length > 0) {
      // Check if incoming messages are now in the query cache
      const socketMessages = incomingMessagesRef.current.get(convKey) ?? [];
      const queryMessageIds = new Set(
        messagesPayload.messages.map((m) => m._id)
      );

      // Only clear messages that:
      // 1. Are older than 10 seconds (to avoid clearing real-time messages)
      // 2. Are confirmed to be in the query cache
      const now = Date.now();
      const messagesToKeep = socketMessages.filter((msg) => {
        const messageAge = now - new Date(msg.createdAt).getTime();
        const isRecent = messageAge < 10000; // 10 seconds
        const isInCache = queryMessageIds.has(msg._id);
        // Keep if it's recent OR not in cache yet (might be a timing issue)
        return isRecent || !isInCache;
      });

      if (
        messagesToKeep.length !== socketMessages.length &&
        socketMessages.length > 0
      ) {
        console.log(
          "[Messaging] Clearing old socket messages that are now in query cache:",
          {
            before: socketMessages.length,
            after: messagesToKeep.length,
            cleared: socketMessages.length - messagesToKeep.length,
          }
        );
        if (messagesToKeep.length > 0) {
          incomingMessagesRef.current.set(convKey, messagesToKeep);
        } else {
          incomingMessagesRef.current.delete(convKey);
        }
        setMessageUpdateCounter((prev) => prev + 1); // Trigger re-render after clearing
      }
    }
  }, [
    messagesPayload,
    messagesPayload?.messages?.length,
    activeConversationId,
    activeConversationId?.receiverId,
    activeConversationId?.equipmentId,
  ]);

  // Merge query messages with incoming socket messages
  // This memo recalculates whenever messageUpdateCounter changes, ensuring socket messages appear immediately
  // CRITICAL: Only merge messages that belong to the active conversation (receiverId + equipmentId)
  // Extract message ID snapshot to avoid complex expressions in deps
  const messageIdsJson = useMemo(
    () =>
      messagesPayload?.messages
        ? JSON.stringify(messagesPayload.messages.map((m) => m._id))
        : "",
    [messagesPayload]
  );

  const messages = useMemo(() => {
    if (!activeConversationId) return [];

    const convKey = makeConvKey(
      activeConversationId.receiverId,
      activeConversationId.equipmentId
    );
    if (!convKey) return [];

    // Get query messages - these should already be filtered by equipment from the API
    const queryMessages = messagesPayload?.messages ?? [];

    // CRITICAL: Filter query messages to ensure they match the active conversation's equipment
    // This prevents messages from other equipment being shown
    const filteredQueryMessages = queryMessages.filter((msg) => {
      if (!msg.equipment) return false;
      const msgEquipmentId =
        typeof msg.equipment === "string"
          ? msg.equipment
          : (msg.equipment as Equipment)?._id || "";
      return msgEquipmentId === activeConversationId.equipmentId;
    });

    // Always read fresh from ref (not cached) - this ensures we get latest socket messages
    const socketMessages = incomingMessagesRef.current.get(convKey) ?? [];

    // CRITICAL: Also filter socket messages by equipment to ensure no cross-contamination
    const filteredSocketMessages = socketMessages.filter((msg) => {
      if (!msg.equipment) return false;
      const msgEquipmentId =
        typeof msg.equipment === "string"
          ? msg.equipment
          : (msg.equipment as Equipment)?._id || "";
      return msgEquipmentId === activeConversationId.equipmentId;
    });

    // Merge and deduplicate messages
    const allMessages = [...filteredQueryMessages, ...filteredSocketMessages];
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg._id, msg])).values()
    );
    // Sort by createdAt
    uniqueMessages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    console.log("[Messaging] 📨 Merged messages calculation:", {
      queryCount: queryMessages.length,
      filteredQueryCount: filteredQueryMessages.length,
      socketCount: socketMessages.length,
      filteredSocketCount: filteredSocketMessages.length,
      totalCount: uniqueMessages.length,
      messageUpdateCounter,
      convKey,
      activeEquipmentId: activeConversationId.equipmentId,
      messageIdsJson,
      queryMessageEquipmentIds: queryMessages.map((m) => {
        if (!m.equipment) return "";
        const eq =
          typeof m.equipment === "string"
            ? m.equipment
            : (m.equipment as Equipment)?._id || "";
        return eq;
      }),
    });

    return uniqueMessages;
  }, [
    messagesPayload,
    messageIdsJson, // Detect content changes (extracted)
    activeConversationId,
    messageUpdateCounter,
  ]);

  // // Debug: Log when messages array changes
  // useEffect(() => {
  //   console.log("[Messaging] 🎯 Messages array changed:", {
  //     count: messages.length,
  //     activeConversationId,
  //     messageUpdateCounter,
  //     firstMessage: messages[0]?.content?.substring(0, 30),
  //     lastMessage: messages[messages.length - 1]?.content?.substring(0, 30),
  //   });
  // }, [messages.length, messageUpdateCounter, activeConversationId]);

  const equipmentFromMessages = messagesPayload?.equipment;
  console.log(messages);

  useEffect(() => {
    if (!activeConversationId || !messagesPayload) return;

    // Update conversation cache with messages and equipment
    dispatch(
      messagingApi.util.updateQueryData(
        "getConversationsByEquipment",
        undefined,
        (draft) => {
          const conv = draft.find(
            (c) =>
              c.participant.userId === activeConversationId.receiverId &&
              c.equipmentId === activeConversationId.equipmentId
          );
          if (conv && equipmentFromMessages) {
            // Update equipment info from messages if available
            conv.equipment = {
              name: equipmentFromMessages.name,
              media: equipmentFromMessages.media || [],
            };
          }
        }
      )
    );
  }, [messagesPayload, equipmentFromMessages, activeConversationId, dispatch]);

  // RTK Query OPTIMISTIC mutations
  const [addMessageOptimistic] = useAddMessageOptimisticMutation();
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

  // Mark messages as read when active conversation changes and messages are loaded
  useEffect(() => {
    if (!activeConversationId || !currentUserId || !isConnected) return;
    if (!messagesPayload || messagesPayload.messages.length === 0) return;

    // Mark messages as read for the active conversation
    markMessagesAsRead({
      receiverId: activeConversationId.receiverId,
      equipmentId: activeConversationId.equipmentId,
      currentUserId,
    });

    // Also update socket messages in the ref to mark them as read
    const convKey = makeConvKey(
      activeConversationId.receiverId,
      activeConversationId.equipmentId
    );
    if (convKey) {
      const socketMessages = incomingMessagesRef.current.get(convKey) ?? [];
      // Create new message objects instead of mutating (to avoid read-only errors)
      const updatedMessages = socketMessages.map((msg) => {
        if (msg.sender !== currentUserId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });

      // Only update if there were changes
      const hasChanges = updatedMessages.some(
        (msg, idx) => msg.read !== socketMessages[idx]?.read
      );
      if (hasChanges) {
        incomingMessagesRef.current.set(convKey, updatedMessages);
        setMessageUpdateCounter((prev) => prev + 1); // Trigger re-render
      }
    }
  }, [
    activeConversationId,
    messagesPayload,
    currentUserId,
    isConnected,
    markMessagesAsRead,
  ]);

  useEffect(() => {
    if (!socketService.rawSocket) return;

    const socket = socketService.rawSocket;

    const handleConnect = () => {
      console.log("[Messaging] Socket connected");
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = (reason: string) => {
      console.log("[Messaging] Socket disconnected", reason);
      setIsConnected(false);
      setConnectionError(reason);
    };

    const handleError = (err: Error) => {
      console.error("[Messaging] Connection error:", err.message);
      setIsConnected(false);
      setConnectionError(err.message);
    };

    // Handle incoming messages
    const handleMessage = (socketMessage: SocketMessage) => {
      console.log("[Messaging] ⚡⚡⚡ SOCKET MESSAGE RECEIVED ⚡⚡⚡:", {
        messageId: socketMessage._id,
        content: socketMessage.content,
        sender: socketMessage.sender,
        receiver: socketMessage.receiver,
        equipment: socketMessage.equipment,
        timestamp: new Date().toISOString(),
        currentUserId,
        socketConnected: socket.connected,
        socketId: socket.id,
      });

      if (!currentUserId) {
        console.warn(
          "[Messaging] Received message but currentUserId is not available"
        );
        return;
      }

      console.log("[Messaging] Processing incoming socket message:", {
        messageId: socketMessage._id,
        sender: socketMessage.sender,
        receiver: socketMessage.receiver,
        equipment: socketMessage.equipment,
        currentUserId,
      });

      // Extract equipmentId - can be a string ID or an object with _id
      const equipmentId =
        typeof socketMessage.equipment === "string"
          ? socketMessage.equipment
          : socketMessage.equipment?._id || "";

      if (!equipmentId) {
        console.warn(
          "[Messaging] Received message without equipmentId, skipping cache update",
          socketMessage
        );
        return;
      }

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

      // Extract receiverId - the other participant in the conversation
      // If message is from us, receiverId is the recipient (we sent it to them)
      // If message is to us, receiverId is the sender (they sent it to us)
      const receiverId =
        socketMessage.sender === currentUserId
          ? socketMessage.receiver
          : socketMessage.sender;

      // IMPORTANT: Store the message even if this conversation is NOT currently active
      // This ensures messages appear when the user opens the conversation later

      console.log(
        "[Messaging] 🔔 Processing socket message for conversation:",
        {
          receiverId,
          equipmentId,
          currentUserId,
          messageSender: socketMessage.sender,
          messageReceiver: socketMessage.receiver,
          isFromMe: socketMessage.sender === currentUserId,
          activeConversationReceiver: activeConversationId?.receiverId,
          activeConversationEquipment: activeConversationId?.equipmentId,
          isActiveConversation:
            activeConversationId?.receiverId === receiverId &&
            activeConversationId?.equipmentId === equipmentId,
        }
      );

      const convKey = makeConvKey(receiverId, equipmentId);
      if (!convKey) {
        console.warn("[Messaging] Could not create conversation key");
        return;
      }

      // Store message in incoming messages ref (for immediate UI update)
      // This ensures messages appear immediately even if query cache isn't subscribed
      // IMPORTANT: Store for ALL conversations, not just the active one
      const existingMessages = incomingMessagesRef.current.get(convKey) ?? [];
      const messageExists = existingMessages.some((m) => m._id === message._id);

      if (!messageExists) {
        const updatedMessages = [...existingMessages, message];
        incomingMessagesRef.current.set(convKey, updatedMessages);

        const isActiveConv =
          activeConversationId?.receiverId === receiverId &&
          activeConversationId?.equipmentId === equipmentId;

        console.log(
          "[Messaging] ⚡ Stored socket message in incoming messages:",
          {
            convKey,
            messageId: message._id,
            messageContent: message.content.substring(0, 50),
            totalIncoming: updatedMessages.length,
            isActiveConversation: isActiveConv,
            activeConvReceiver: activeConversationId?.receiverId,
            activeConvEquipment: activeConversationId?.equipmentId,
            messageReceiver: receiverId,
            messageEquipment: equipmentId,
          }
        );

        // ALWAYS force a re-render by updating counter state
        // This ensures messages appear even if conversation becomes active later
        setMessageUpdateCounter((prev) => {
          const newVal = prev + 1;
          console.log(
            "[Messaging] 🔄 messageUpdateCounter:",
            prev,
            "->",
            newVal,
            "| Active:",
            isActiveConv
          );
          return newVal;
        });

        // If this is the active conversation, also mark it as read automatically
        if (isActiveConv && socketMessage.sender !== currentUserId) {
          console.log(
            "[Messaging] Auto-marking message as read (active conversation)"
          );
          markMessagesAsRead({ receiverId, equipmentId, currentUserId });
          socketService.markMessagesAsRead(receiverId, () => {});
        }
      } else {
        console.log(
          "[Messaging] Socket message already in incoming messages, skipping:",
          message._id
        );
      }

      // Update messages cache ONLY if this is the active conversation
      // For non-active conversations, messages are stored in incomingMessagesRef and will be merged when conversation is opened
      const isActiveConv =
        activeConversationId?.receiverId === receiverId &&
        activeConversationId?.equipmentId === equipmentId;

      if (isActiveConv) {
        // Only update cache if this is the active conversation
        dispatch(
          messagingApi.util.updateQueryData(
            "getMessagesByEquipment",
            { receiverId, equipmentId, currentUserId },
            (draft) => {
              if (!Array.isArray(draft.messages)) {
                draft.messages = [];
              }
              // Avoid duplicates - check if message already exists
              const exists = draft.messages.some((m) => m._id === message._id);
              if (!exists) {
                draft.messages.push(message);
                // Sort messages by createdAt to ensure correct order
                draft.messages.sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );
                console.log(
                  "[Messaging] ✅ Added message to RTK Query cache, total:",
                  draft.messages.length
                );
              } else {
                console.log(
                  "[Messaging] Message already exists in cache, skipping"
                );
              }
              // Update equipment if provided in socket message (object format)
              if (
                typeof socketMessage.equipment === "object" &&
                socketMessage.equipment &&
                !draft.equipment
              ) {
                draft.equipment = {
                  _id: socketMessage.equipment._id,
                  name: socketMessage.equipment.name || "",
                  pricePerDay: socketMessage.equipment.pricePerDay || 0,
                  media: socketMessage.equipment.media || [],
                  category:
                    socketMessage.equipment.category?.map((c) => c.name) || [],
                };
              }
            }
          )
        );
      } else {
        console.log(
          "[Messaging] Conversation not active, skipping cache update (message stored in ref for later)"
        );
      }

      // Only invalidate conversation list, not messages (to avoid refetching and overwriting socket messages)

      // Update conversations list - create conversation if it doesn't exist
      // CRITICAL: Always check BOTH receiverId AND equipmentId to ensure conversations are unique
      dispatch(
        messagingApi.util.updateQueryData(
          "getConversationsByEquipment",
          undefined,
          (draft) => {
            // CRITICAL: Find conversation by BOTH receiverId AND equipmentId
            let conv = draft.find(
              (c) =>
                c.participant.userId === receiverId &&
                c.equipmentId === equipmentId
            );

            if (!conv) {
              // Create new conversation if it doesn't exist
              console.log(
                "[Messaging] Creating new conversation for received message"
              );
              conv = {
                receiverId,
                equipmentId,
                participant: {
                  userId: receiverId,
                  name: "", // Will be populated when conversations are refetched
                  avatar: "",
                },
                equipment:
                  typeof socketMessage.equipment === "object" &&
                  socketMessage.equipment
                    ? {
                        name: socketMessage.equipment.name || "",
                        media: socketMessage.equipment.media || [],
                      }
                    : {
                        name: "",
                        media: [],
                      },
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                unreadCount: socketMessage.sender !== currentUserId ? 1 : 0,
              };
              draft.unshift(conv);
              // Refetch conversations to get proper participant data
              refetchConversations();
            } else {
              // Update existing conversation
              conv.lastMessage = message.content;
              conv.lastMessageTime = message.createdAt;
              if (socketMessage.sender !== currentUserId) {
                conv.unreadCount = (conv.unreadCount || 0) + 1;
              }
              // Move to top (most recent)
              const idx = draft.indexOf(conv);
              if (idx > 0) {
                draft.splice(idx, 1);
                draft.unshift(conv);
              }
            }
          }
        )
      );

      // Only invalidate conversation list, not messages (to avoid refetching and overwriting socket messages)
      dispatch(messagingApi.util.invalidateTags(["Conversation"]));

      // Note: We don't need to refetch here because:
      // 1. The cache is already updated above
      // 2. The messageUpdateCounter state change will trigger the messages memo to recalculate
      // 3. Refetching could cause race conditions with the socket update
    };

    // Register socket event handlers
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    // Register message handler - use socketService.onMessage which properly manages handlers
    console.log(
      "[Messaging] 📡 Registering socket message handler for currentUserId:",
      currentUserId,
      "Socket connected:",
      socket.connected,
      "Socket ID:",
      socket.id
    );

    // Register handler via service (this is the primary handler)
    socketService.onMessage(handleMessage);

    // Also register directly on socket as a backup to ensure we catch all messages
    // This helps debug if the service wrapper is causing issues
    socket.on("chat", handleMessage);

    // If already connected, trigger connect handler
    if (socket.connected) {
      handleConnect();
      console.log("[Messaging] Socket already connected, handlers registered");
    }

    // Cleanup function
    return () => {
      console.log("[Messaging] 🧹 Cleaning up socket event handlers");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("chat", handleMessage);
      // Remove the message handler via service (this properly removes the handler)
      socketService.offMessage(handleMessage);
    };
  }, [
    currentUserId,
    dispatch,
    refetchConversations,
    activeConversationId,
    refetchMessages,
    markMessagesAsRead,
  ]);

  useEffect(() => {
    if (!socketService.rawSocket) return;

    // Listen for "messages read" events
    socketService.onMessagesRead(({ receiver }) => {
      console.log("[Messaging] Messages read for:", receiver);

      // Note: Backend may need to send equipmentId in the read event
      // For now, we'll update all conversations with this receiver
      dispatch(
        messagingApi.util.updateQueryData(
          "getConversationsByEquipment",
          undefined,
          (draft) => {
            const convs = draft.filter(
              (c) => c.participant.userId === receiver
            );
            convs.forEach((conv) => {
              conv.unreadCount = 0;
            });
          }
        )
      );
    });

    return () => {
      socketService.offMessagesRead();
    };
  }, [dispatch]);

  // Connect to socket

  const connect = useCallback(async (token: string) => {
    if (isConnectingRef.current) {
      console.log("[v0] Connection already in progress, skipping");
      return;
    }

    isConnectingRef.current = true;
    setConnectionError(null);

    try {
      console.log(
        "[v0] Attempting to connect with token:",
        token ? "Present" : "Missing"
      );
      socketService.connect(token);
      const s = socketService.rawSocket;
      if (s) {
        // If the socket connects a bit later, ensure we set isConnected at that moment
        s.once("connect", () => {
          console.log(
            "[Messaging] (connect once) socket connected -> setting state"
          );
          setIsConnected(true);
          setConnectionError(null);
        });

        // If connect error happens right after connect() call
        s.once("connect_error", (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === "string"
              ? err
              : "Unknown connection error";
          console.error("[Messaging] (connect once) connect_error", err);
          setIsConnected(false);
          setConnectionError(message);
        });

        // Also handle disconnects so state flips off if connection drops later
        const handleDisconnect = (reason: unknown) => {
          console.log("[Messaging] (connect-time) socket disconnected", reason);
          setIsConnected(false);
          setConnectionError(reason?.toString?.() ?? String(reason));
        };
        s.on("disconnect", handleDisconnect);

        // push a cleanup so disconnect() can remove these listeners later
        cleanupFunctions.current.push(() => {
          try {
            s.off("disconnect", handleDisconnect);
            s.off("connect"); // remove any once handlers if still present
            s.off("connect_error");
          } catch (e) {
            /* ignore cleanup errors */
          }
        });

        // If the socket was already connected synchronously, immediately sync state
        if (s.connected) {
          console.log(
            "[Messaging] socket.rawSocket.connected is true immediately after connect()"
          );
          setIsConnected(true);
          setConnectionError(null);
        }
      }
    } catch (error) {
      console.error("[Messaging] Failed to connect:", error);
      setIsConnected(false);
      setConnectionError(
        error instanceof Error
          ? error.message
          : "Failed to connect to messaging service"
      );
      throw error;
    } finally {
      isConnectingRef.current = false;
    }
  }, []);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    cleanupFunctions.current.forEach((cleanup) => cleanup());
    cleanupFunctions.current = [];

    socketService.disconnect();
    setIsConnected(false);
  }, []);

  const activeConversation = useMemo<Conversation | null>(() => {
    if (!activeConversationId) return null;

    // Find conversation by receiverId + equipmentId pair
    const conv = conversations.find(
      (c) =>
        c.participant.userId === activeConversationId.receiverId &&
        c.equipmentId === activeConversationId.equipmentId
    );

    // If tempConversationRef matches, use it
    const tempMatches =
      tempConversationRef.current &&
      tempConversationRef.current.participant.userId ===
        activeConversationId.receiverId &&
      tempConversationRef.current.equipmentId ===
        activeConversationId.equipmentId;

    // Build equipment object for conversation - prioritize from messages payload
    const equipment = equipmentFromMessages
      ? {
          name: equipmentFromMessages.name,
          media: equipmentFromMessages.media || [],
        }
      : conv?.equipment ?? tempConversationRef.current?.equipment;

    if (!conv && tempMatches && tempConversationRef.current) {
      return {
        ...tempConversationRef.current,
        receiverId:
          tempConversationRef.current.receiverId ||
          tempConversationRef.current.participant.userId, // Ensure receiverId is set
        messages: messages || [],
        equipment: equipment ?? tempConversationRef.current.equipment,
      };
    }

    return conv
      ? {
          ...conv,
          receiverId: conv.receiverId || conv.participant.userId, // Ensure receiverId is set
          messages: messages || [],
          equipment: equipment ?? conv.equipment,
        }
      : null;
  }, [activeConversationId, conversations, messages, equipmentFromMessages]);

  // Join a conversation
  const joinConversation = useCallback(
    (receiverId: string, equipmentId: string, conv?: Conversation) => {
      console.log("[Messaging] 🔵 Joining conversation:", {
        receiverId,
        equipmentId,
        hasConv: !!conv,
      });

      // Set active conversation ID - this triggers the messages query
      setActiveConversationId({ receiverId, equipmentId });
      if (conv) tempConversationRef.current = conv;

      if (isConnected) {
        // Socket join chat may need to be updated for equipment-based rooms
        socketService.joinChat(receiverId);
        // Mark messages as read for this equipment conversation
        markMessagesAsRead({
          receiverId,
          equipmentId,
          currentUserId: currentUserId ?? "",
        });
      }

      // Update the cached conversation
      dispatch(
        messagingApi.util.updateQueryData(
          "getConversationsByEquipment",
          undefined,
          (draft) => {
            const c = draft.find(
              (c) =>
                c.participant.userId === receiverId &&
                c.equipmentId === equipmentId
            );
            if (c) {
              c.unreadCount = 0;
              // Update equipment if provided
              if (conv?.equipment) {
                c.equipment = conv.equipment;
              }
            }
          }
        )
      );

      // Force messages memo to recalculate by incrementing counter
      // This ensures any socket messages stored in incomingMessagesRef are included
      setMessageUpdateCounter((prev) => prev + 1);
      console.log(
        "[Messaging] 🔵 Triggered message recalculation after joining conversation"
      );
    },
    [isConnected, dispatch, currentUserId, markMessagesAsRead]
  );

  // Send a message
  const sendMessage = useCallback(
    async (receiverId: string, equipmentId: string, content: string) => {
      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const socketReady = isConnected || socketService.rawSocket?.connected;

      if (!socketReady) {
        throw new Error("Not connected to server");
      }

      if (!content.trim()) {
        throw new Error("Message content cannot be empty");
      }

      return new Promise<void>((resolve, reject) => {
        const optimisticMessage: Message = {
          _id: `temp-${Date.now()}`,
          sender: currentUserId,
          receiver: receiverId,
          content: content.trim(),
          read: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        };

        // Add optimistic message
        addMessageOptimistic({
          receiverId,
          equipmentId,
          message: optimisticMessage,
          currentUserId,
        });

        // Send via socket
        socketService.sendMessage(
          receiverId,
          content.trim(),
          equipmentId,
          (response: SocketResponse) => {
            if (response.ok) {
              console.log("[Messaging] Message sent successfully");
              resolve();
            } else {
              console.error(
                "[Messaging] Failed to send message:",
                response.error
              );
              reject(new Error(response.error || "Failed to send message"));
            }
          }
        );
      });
    },
    [isConnected, addMessageOptimistic, currentUserId]
  );

  // Mark messages as read
  // Note: Backend read_message only supports receiverId, not equipment-scoped
  // We use optimistic updates for the specific equipment conversation
  // The backend will mark ALL conversations with this receiver as read (backend limitation)
  const markAsRead = useCallback(
    (receiverId: string, equipmentId: string) => {
      if (!isConnected || !currentUserId) return;

      // Use mutation to mark as read (optimistic update for this specific equipment)
      // This ensures the UI updates immediately for the correct conversation
      markMessagesAsRead({ receiverId, equipmentId, currentUserId });

      // Notify socket - backend will mark all messages with this receiver as read
      // The optimistic update ensures the correct equipment conversation shows as read
      socketService.markMessagesAsRead(
        receiverId,
        (response: SocketResponse) => {
          if (response.ok) {
            console.log(
              "[Messaging] Messages marked as read (all conversations with receiver)"
            );
            // Note: Backend marks all conversations with this receiver as read
            // The optimistic update already handled the specific equipment conversation
          } else {
            console.error(
              "[Messaging] Failed to mark messages as read:",
              response.error
            );
          }
        }
      );
    },
    [isConnected, currentUserId, markMessagesAsRead]
  );

  useEffect(() => {
    if (authToken && !isConnected && !isConnectingRef.current) {
      console.log("[v0] Auto-connecting with auth token");
      connect(authToken).catch((error) => {
        console.error("[v0] Auto-connect failed:", error);
      });
    }
  }, [authToken, isConnected, connect]);

  useEffect(() => {
    return () => {
      console.log("[v0] Cleaning up socket on unmount");
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    if (activeConversationId && isConnected) {
      // Join chat room (socket may need backend update for equipment-based rooms)
      socketService.joinChat(activeConversationId.receiverId);
    }
  }, [activeConversationId, isConnected]);

  const normalizedCurrentUserId: string | null = currentUserId ?? null;

  const contextValue: MessagingContextType = {
    conversations,
    activeConversationId,
    activeConversation,
    messages, // Export merged messages (query + socket) for real-time updates
    isConnected,
    currentUserId: normalizedCurrentUserId,
    connectionError,
    joinConversation,
    sendMessage,
    markAsRead,
    connect,
    disconnect,
    isLoadingConversations,
    setActiveConversationId,
    isLoadingMessages,
  };

  // console.log(isConnected)

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessagingContext(): MessagingContextType {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error(
      "useMessagingContext must be used within a MessagingProvider"
    );
  }
  return context;
}
