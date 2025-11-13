// Product information attached to conversations
export interface Product {
  id: string
  name: string
  price: string
  image: string
  period: string
  phone: string
  pricePerDay?: string
  imageUrl?: string
  availability?: boolean
}

export interface EquipmentCategory {
  _id: string
  name: string
}

export interface Equipment {
  _id: string
  name?: string
  pricePerDay?: number
  category?: EquipmentCategory[]
  media?: string[]
}

export interface Message {
  _id: string
  sender: string
  receiver: string
  content: string
  read: boolean
  createdAt: string
  updatedAt: string
  __v?: number
  equipment?: Equipment | string
}

export interface Conversation {
  userId: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages?: Message[] 
  equipment?: Equipment
}

// Socket event payloads
export interface SocketChatPayload {
  receiver: string
  content: string
  media?: string | null
}

export interface SocketChatResponse {
  ok: boolean
  data?: Message
  error?: string
}

export interface SocketError {
  code: "UNAUTHENTICATED" | "INVALID_PAYLOAD" | "INTERNAL_ERROR"
  message: string
}

// API response wrappers
export interface ApiResponse<T> {
  status: string
  data: T
}

export interface ConversationsResponse {
  status: number
  data: Conversation[]
}
export interface MessagesPayload {
  messages: Message[]
  equipment?: Equipment
}

export interface MessagesWithEquipmentResponse {
  status: number
  message: string
  data?: {
    messages?: MessagesPayload
  }
}

export interface MessagesResponse {
  status: number
  message: string
  data?: Message[]
}

// Socket event types
export type SocketEvents = {
  connect: () => void
  disconnect: () => void
  "join chat": (receiverId: string) => void
  chat: (payload: SocketChatPayload, callback?: (response: SocketChatResponse) => void) => void
  read_message: (receiverId: string, callback?: (response: SocketChatResponse) => void) => void
  "socket error": (error: SocketError) => void
  "messages read": (data: { receiver: string }) => void
}

// Auth token interface
export interface AuthToken {
  token: string
  userId: string
}

// Messaging context state
export interface MessagingState {
  conversations: Conversation[]
  activeConversationId: string | null
  activeConversation: Conversation | null
  isConnected: boolean
  currentUserId: string | null
}
