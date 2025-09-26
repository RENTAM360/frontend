import { io, type Socket } from "socket.io-client"

export interface SocketMessage {
  _id: string
  content: string
  sender: string
  receiver: string
  read: boolean
  createdAt: string
  updatedAt: string
  media?: string | null
}

export interface SocketResponse {
  ok: boolean
  data?: unknown
  error?: string
}

class SocketService {
  private socket: Socket | null = null
  private token: string | null = null

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket
    }

    this.token = token

    const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL

    const serverUrl = `${baseUrl}`
    console.log("[v0] Attempting to connect to:", serverUrl)

    try {
      this.socket = io(serverUrl, {
        auth: { token },
        autoConnect: true,
      })
      console.log("[v0] Socket.io client created, autoConnect: true")

      this.setupEventListeners()
      console.log("[v0] Event listeners setup complete")

      return this.socket
    } catch (error) {
      console.error("[v0] Error creating socket:", error)
      throw error
    }

  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on("connect", () => {
      console.log("[Socket] Connected:", this.socket?.id)
      const auth = this.socket?.auth as { token?: string }
      console.log("[Socket] Authenticated as user:", auth?.token ? "✅" : "❌")
    })

    this.socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected, reason:", reason)
    })

    this.socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message, error)
    })

    this.socket.on("error", (err) => {
      console.error("[Socket] Error event:", err)
    })

    this.socket.on("socket error", (error: { code: string; message: string }) => {
      console.error("[Socket] Error:", error.code, error.message)
    })

    console.log("[v0] All event listeners registered")
  }

  // ---- Connection event helpers ----
  onConnect(callback: () => void) {
    this.socket?.on("connect", callback)
  }

  offConnect(callback?: () => void) {
    if (callback) this.socket?.off("connect", callback)
    else this.socket?.off("connect")
  }

  onDisconnect(callback: () => void) {
    this.socket?.on("disconnect", callback)
  }

  offDisconnect(callback?: () => void) {
    if (callback) this.socket?.off("disconnect", callback)
    else this.socket?.off("disconnect")
  }

  joinChat(receiverUserId: string) {
    if (!this.socket?.connected) {
      console.error("[Socket] Not connected")
      return
    }

    this.socket.emit("join chat", receiverUserId)
    console.log("[Socket] Joined chat with:", receiverUserId)
  }

  sendMessage(
    receiver: string,
    content: string,
    media: string | null = null,
    callback?: (response: SocketResponse) => void,
  ) {
    if (!this.socket?.connected) {
      console.error("[Socket] Not connected")
      callback?.({ ok: false, error: "Socket not connected" })
      return
    }

    this.socket.emit(
      "chat",
      {
        receiver,
        content,
        media,
      },
      (response: SocketResponse) => {
        if (response.ok) {
          console.log("[Socket] Message sent:", response.data)
        } else {
          console.error("[Socket] Send error:", response.error)
        }
        callback?.(response)
      },
    )
  }

  markMessagesAsRead(receiverUserId: string, callback?: (response: SocketResponse) => void) {
    if (!this.socket?.connected) {
      console.error("[Socket] Not connected")
      callback?.({ ok: false, error: "Socket not connected" })
      return
    }

    this.socket.emit("read_message", receiverUserId, (response: SocketResponse) => {
      if (response.ok) {
        console.log("[Socket] Messages marked as read")
      } else {
        console.error("[Socket] Read error:", response.error)
      }
      callback?.(response)
    })
  }

  onMessage(callback: (message: SocketMessage) => void) {
    if (!this.socket) return

    this.socket.on("chat", callback)
  }

  onMessagesRead(callback: (data: { receiver: string }) => void) {
    if (!this.socket) return

    this.socket.on("messages read", callback)
  }

  offMessage(callback?: (message: SocketMessage) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off("chat", callback)
    } else {
      this.socket.off("chat")
    }
  }

  offMessagesRead(callback?: (data: { receiver: string }) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off("messages read", callback)
    } else {
      this.socket.off("messages read")
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  get isConnected() {
    return this.socket?.connected || false
  }

  get socketId() {
    return this.socket?.id
  }

  get rawSocket() {
    return this.socket
  }
}

// Export singleton instance
export const socketService = new SocketService()
