"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react"
// import { socketService, type SocketMessage, type SocketResponse } from "@/lib/socket-service"
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useAddMessageMutation,
  // useMarkMessagesAsReadMutation,
  useUpdateConversationLastMessageMutation,
  messagingApi,
} from "@/lib/redux/api/messaging-api"
import type { Conversation, Message, MessagingState } from "@/types/messaging"
import { SocketMessage, SocketResponse, socketService } from "@/lib/socket"
import { useAppDispatch } from "@/lib/redux/hooks"

interface MessagingContextType extends MessagingState {
  // Actions
  joinConversation: (conversationId: string, conv?: Conversation) => void
  sendMessage: (conversationId: string, content: string, media?: string, equipment?: string) => Promise<void>
  markAsRead: (conversationId: string) => void
  // setActiveConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
  setActiveConversationId: React.Dispatch<React.SetStateAction<string | null>>

  // Connection management
  connect: (authToken: string) => Promise<void>
  disconnect: () => void

  // Loading states
  isLoadingConversations: boolean
  isLoadingMessages: boolean

  // Connection error
  connectionError: string | null
}

const MessagingContext = createContext<MessagingContextType | null>(null)

interface MessagingProviderProps {
  children: React.ReactNode
  currentUserId: string
  authToken?: string
}

export function MessagingProvider({ children, currentUserId, authToken }: MessagingProviderProps) {
  // Local state
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  // const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const tempConversationRef = useRef<Conversation | null>(null)
  const dispatch = useAppDispatch();

  // Refs for cleanup
  const cleanupFunctions = useRef<(() => void)[]>([])
  const isConnectingRef = useRef(false)

  // RTK Query hooks
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    // refetch: refetchConversations,
  } = useGetConversationsQuery()

  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    // refetch: refetchMessages,
  } = useGetMessagesQuery({ receiverId: activeConversationId!, currentUserId }, { skip: !activeConversationId })

  // RTK Query mutations
  const [addMessage] = useAddMessageMutation()
  // const [markMessagesAsRead] = useMarkMessagesAsReadMutation()
  const [updateConversationLastMessage] = useUpdateConversationLastMessageMutation()

  useEffect(() => {
  if (!socketService.rawSocket) return

  const socket = socketService.rawSocket

  const handleConnect = () => {
    console.log("[Messaging] Socket connected ✅")
    setIsConnected(true)
    setConnectionError(null)
  }

  const handleDisconnect = (reason: string) => {
    console.log("[Messaging] Socket disconnected ❌", reason)
    setIsConnected(false)
    setConnectionError(reason)
  }

  const handleError = (err: Error) => {
    console.error("[Messaging] Connection error:", err.message)
    setIsConnected(false)
    setConnectionError(err.message)
  }

  socket.on("connect", handleConnect)
  socket.on("disconnect", handleDisconnect)
  socket.on("connect_error", handleError)
  
  if (socket.connected) {
      handleConnect()
    }
  // incoming messages etc
  socketService.onMessage((socketMessage: SocketMessage) => {
    console.log("[Messaging] Received message:", socketMessage)
    const message: Message = {
      id: socketMessage._id,
      content: socketMessage.content,
      sender: socketMessage.sender === currentUserId ? "user" : "other",
      timestamp: socketMessage.createdAt,
      read: false,
      media: socketMessage.media || undefined,
    }

    const conversationId =
      socketMessage.sender === currentUserId ? socketMessage.receiver : socketMessage.sender

    addMessage({ receiverId: conversationId, message })
    updateConversationLastMessage({
      conversationId,
      lastMessage: socketMessage.content,
      lastMessageTime: socketMessage.createdAt,
    })
  })

  

  return () => {
    socket.off("connect", handleConnect)
    socket.off("disconnect", handleDisconnect)
    socket.off("connect_error", handleError)
    socketService.disconnect()
  }
}, [currentUserId, addMessage, updateConversationLastMessage])


  useEffect(() => {
    if (!socketService.rawSocket) return;

    // Listen for "messages read" events
    socketService.onMessagesRead(({ receiver }) => {
      console.log("[Messaging] Messages read for:", receiver);

      // Optimistically update conversation unreadCount = 0
      dispatch(
        messagingApi.util.updateQueryData("getConversations", undefined, (draft) => {
          const conv = draft.find((c) => c.id === receiver);
          if (conv) {
            conv.unreadCount = 0;
          }
        })
      );
    });

    return () => {
      socketService.offMessagesRead();
    };
  }, [dispatch]);


  // Connect to socket
  
  const connect = useCallback(
    async (token: string) => {
      if (isConnectingRef.current) {
        console.log("[v0] Connection already in progress, skipping")
        return
      }

      isConnectingRef.current = true
      setConnectionError(null)

      try {
        console.log("[v0] Attempting to connect with token:", token ? "Present" : "Missing");
        socketService.connect(token);
        const s = socketService.rawSocket;
        if (s) {
          // If the socket connects a bit later, ensure we set isConnected at that moment
          s.once("connect", () => {
            console.log("[Messaging] (connect once) socket connected -> setting state");
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
            console.log("[Messaging] socket.rawSocket.connected is true immediately after connect()");
            setIsConnected(true);
            setConnectionError(null);
          }
        }
      } catch (error) {
        console.error("[Messaging] Failed to connect:", error)
        setIsConnected(false)
        setConnectionError(error instanceof Error ? error.message : "Failed to connect to messaging service")
        throw error
      } finally {
        isConnectingRef.current = false
      }
    },
    [],
  )

  // Disconnect from socket
  const disconnect = useCallback(() => {
    cleanupFunctions.current.forEach((cleanup) => cleanup())
    cleanupFunctions.current = []

    socketService.disconnect()
    setIsConnected(false)
  }, [])

//   useEffect(() => {
//   if (!activeConversationId) {
//     setActiveConversation(null)
//     return
//   }

//   const conv = conversations.find(c => c.id === activeConversationId)

//   if (conv) {
//     setActiveConversation({ ...conv, messages: messages || [], product: tempConversationRef.current?.product ?? conv.product, })
//   } else if (tempConversationRef.current?.id === activeConversationId) {
//     setActiveConversation(tempConversationRef.current)
//   } else {
//     setActiveConversation(null)
//   }
// }, [activeConversationId, conversations, messages])
const activeConversation = useMemo(() => {
  if (!activeConversationId) return null

  const conv = conversations.find((c) => c.id === activeConversationId)
  if (!conv && tempConversationRef.current?.id === activeConversationId) {
    return tempConversationRef.current
  }

  return conv
    ? {
        ...conv,
        messages: messages || [],
        product: tempConversationRef.current?.product ?? conv.product,
      }
    : null
}, [activeConversationId, conversations, messages])


  // Join a conversation
  const joinConversation = useCallback(
    (conversationId: string, conv?: Conversation) => {
      console.log("[Messaging] Joining conversation:", conversationId)

      setActiveConversationId(conversationId)

      if (conv?.product) {
        tempConversationRef.current = conv
      }

      if (isConnected) {
        socketService.joinChat(conversationId)
        socketService.markMessagesAsRead(conversationId);
      }

      // markMessagesAsRead({ receiverId: conversationId, currentUserId }).catch((error) => {
      //   console.warn("[v0] Failed to mark messages as read optimistically:", error)
      // })
      dispatch(
        messagingApi.util.updateQueryData("getConversations", undefined, (draft) => {
          const c = draft.find((c) => c.id === conversationId)
          if (c) c.unreadCount = 0
        })
      )

    },
    [isConnected, dispatch],
  )

  // const activeConversation = useMemo(() => {
  //   if (!activeConversationId) return null

  //   const conversation = conversations.find(c => c.id === activeConversationId)
  //   if (conversation) return { ...conversation, messages: messages || [] }

  //   if (tempConversationRef.current?.id === activeConversationId) {
  //     return tempConversationRef.current
  //   }

  //   return null
  // }, [activeConversationId, conversations, messages])

  // Send a message
  const sendMessage = useCallback(
    async (conversationId: string, content: string, media?: string) => {
      const socketReady = isConnected || socketService.rawSocket?.connected

      if (!socketReady) {
        throw new Error("Not connected to server")
      }

      if (!content.trim()) {
        throw new Error("Message content cannot be empty")
      }

      return new Promise<void>((resolve, reject) => {
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          content: content.trim(),
          sender: "user",
          timestamp: new Date().toISOString(),
          read: false,
          media,
        }

        addMessage({
          receiverId: conversationId,
          message: optimisticMessage,
        })

        socketService.sendMessage(conversationId, content.trim(), media || null, activeConversation?.product?.id, (response: SocketResponse) => {
          if (response.ok) {
            console.log("[Messaging] Message sent successfully")
            resolve()
          } else {
            console.error("[Messaging] Failed to send message:", response.error)
            reject(new Error(response.error || "Failed to send message"))
          }
        })
      })
    },
    [isConnected, addMessage, activeConversation?.product?.id],
  )


  // Mark messages as read
  const markAsRead = useCallback(
    (conversationId: string) => {
      if (!isConnected) return

      socketService.markMessagesAsRead(conversationId, (response: SocketResponse) => {
        if (response.ok) {
          console.log("[Messaging] Messages marked as read")
        } else {
          console.error("[Messaging] Failed to mark messages as read:", response.error)
        }
      })
    },
    [isConnected],
  )

  useEffect(() => {
    if (authToken && !isConnected && !isConnectingRef.current) {
      console.log("[v0] Auto-connecting with auth token")
      connect(authToken).catch((error) => {
        console.error("[v0] Auto-connect failed:", error)
      })
    }

  }, [authToken, isConnected, connect])

  useEffect(() => {
  return () => {
    console.log("[v0] Cleaning up socket on unmount")
    disconnect()
  }
}, [disconnect])

  useEffect(() => {
    if (activeConversationId && isConnected) {
      socketService.joinChat(activeConversationId)
    }
  }, [activeConversationId, isConnected])

  const contextValue: MessagingContextType = {
    conversations,
    activeConversationId,
    activeConversation,
    isConnected,
    currentUserId,
    connectionError,
    joinConversation,
    sendMessage,
    markAsRead,
    connect,
    disconnect,
    isLoadingConversations,
    setActiveConversationId,
    isLoadingMessages,
  }

  console.log(isConnected)

  return <MessagingContext.Provider value={contextValue}>{children}</MessagingContext.Provider>
}

export function useMessagingContext(): MessagingContextType {
  const context = useContext(MessagingContext)
  if (!context) {
    throw new Error("useMessagingContext must be used within a MessagingProvider")
  }
  return context
}
