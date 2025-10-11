// Base message interface from API response
export interface ApiMessage {
  _id: string
  sender: string
  receiver: string
  content: string
  read: boolean
  createdAt: string
  updatedAt: string
  __v: number
  media?: string | null
}

// Transformed message for UI consumption
export interface Message {
  id: string
  content: string
  sender: "user" | "other"
  timestamp: string
  read: boolean
  media?: string | null
}

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

// Conversation interface for UI
export interface Conversation {
  id: string
  name: string
  avatar: string
  status: string
  messages: Message[]
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  product?: Product
}

// API response for conversations list
export interface ApiConversation {
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  userId: string
  name: string
  avatar: string
}

// Socket event payloads
export interface SocketChatPayload {
  receiver: string
  content: string
  media?: string | null
}

export interface SocketChatResponse {
  ok: boolean
  data?: ApiMessage
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

export interface ConversationsResponse extends ApiResponse<ApiConversation[]> {}
export interface MessagesResponse {
  status: number
  message: string
  data: {
    messages: ApiMessage[]
  }
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
