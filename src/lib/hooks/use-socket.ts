"use client"

import { useEffect, useRef, useCallback } from "react"
import { socketService, type SocketMessage } from "@/lib/socket"

interface UseSocketOptions {
  token: string | null
  isDev?: boolean
  autoConnect?: boolean
}

export function useSocket({ token, autoConnect = true }: UseSocketOptions) {
  const isConnectedRef = useRef(false)

  const connect = useCallback(() => {
    if (!isConnectedRef.current && token) {
      socketService.connect(token)
      isConnectedRef.current = true
    }
  }, [token])

  const disconnect = useCallback(() => {
    if (isConnectedRef.current) {
      socketService.disconnect()
      isConnectedRef.current = false
    }
  }, [])

  const joinChat = useCallback((receiverUserId: string) => {
    socketService.joinChat(receiverUserId)
  }, [])

  const sendMessage = useCallback(
    (
      receiver: string,
      content: string,
      media?: string | null,
      callback?: (response: { ok: boolean; data?: any; error?: string }) => void,
    ) => {
      socketService.sendMessage(receiver, content, media, callback)
    },
    [],
  )

  const markAsRead = useCallback(
    (receiverUserId: string, callback?: (response: { ok: boolean; data?: any; error?: string }) => void) => {
      socketService.markMessagesAsRead(receiverUserId, callback)
    },
    [],
  )

  const onMessage = useCallback((callback: (message: SocketMessage) => void) => {
    socketService.onMessage(callback)
    return () => socketService.offMessage(callback)
  }, [])

  const onMessagesRead = useCallback((callback: (data: { receiver: string }) => void) => {
    socketService.onMessagesRead(callback)
    return () => socketService.offMessagesRead(callback)
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      if (autoConnect) {
        disconnect()
      }
    }
  }, [connect, disconnect, autoConnect])

  return {
    connect,
    disconnect,
    joinChat,
    sendMessage,
    markAsRead,
    onMessage,
    onMessagesRead,
    onConnect: socketService.onConnect.bind(socketService),
    offConnect: socketService.offConnect.bind(socketService),
    isConnected: socketService.isConnected,
    socketId: socketService.socketId,
  }
}
