// Product information attached to conversations
export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  period: string;
  phone: string;
  pricePerDay?: string;
  imageUrl?: string;
  availability?: boolean;
}

export interface EquipmentCategory {
  _id: string;
  name: string;
}

export interface Equipment {
  _id: string;
  name?: string;
  pricePerDay?: number;
  category?: EquipmentCategory[];
  media?: string[];
}

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  // Equipment can be a string id or an object with details coming from socket or API
  equipment?: string | Equipment;
}

export interface Conversation {
  receiverId: string;
  equipmentId: string;
  equipment: { name: string; media: string[] };
  participant: { userId: string; name: string; avatar: string };
  lastMessage: string;
  lastMessageRead: boolean;
  conversationId: string;
  lastMessageTime: string;
  unreadCount: number;
  messages?: Message[];
}

// Socket event payloads
export interface SocketChatPayload {
  receiver: string;
  content: string;
  media?: string | null;
}

export interface SocketChatResponse {
  ok: boolean;
  data?: Message;
  error?: string;
}

export interface SocketError {
  code: "UNAUTHENTICATED" | "INVALID_PAYLOAD" | "INTERNAL_ERROR";
  message: string;
}

// API response wrappers
export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface ConversationsResponse {
  status: number;
  data: Conversation[];
}

export interface EquipmentBasic {
  _id?: string;
  name: string;
  pricePerDay: number;
  rating?: number;
  media: string[];
  category?: string | string[];
}

export interface MessagesPayload {
  messages: Message[];
  equipment?: EquipmentBasic;
}

export interface MessagesWithEquipmentResponse {
  status: string;
  data: {
    messages: Message[];
    equipment?: EquipmentBasic;
  };
}

export interface MessagesResponse {
  status: number;
  message: string;
  data?: Message[];
}

// Socket event types
export type SocketEvents = {
  connect: () => void;
  disconnect: () => void;
  "join chat": (receiverId: string) => void;
  chat: (
    payload: SocketChatPayload,
    callback?: (response: SocketChatResponse) => void
  ) => void;
  read_message: (
    receiverId: string,
    callback?: (response: SocketChatResponse) => void
  ) => void;
  "socket error": (error: SocketError) => void;
  "messages read": (data: { receiver: string }) => void;
};

// Auth token interface
export interface AuthToken {
  token: string;
  userId: string;
}

// Conversation identifier (receiverId + equipmentId pair)
export interface ConversationId {
  receiverId: string;
  equipmentId: string;
}

// Messaging context state
export interface MessagingState {
  conversations: Conversation[];
  activeConversationId: ConversationId | null;
  activeConversation: Conversation | null;
  messages: Message[]; // Merged messages (query + socket) for the active conversation
  isConnected: boolean;
  currentUserId: string | null;
}
