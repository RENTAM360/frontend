"use client"

import Image from "next/image"
import { MessageList } from "@/components/message-list"
import { MessageView } from "@/components/message-view"
import { Flag, MessageCircle, MoreVertical, Search, User } from "lucide-react"
import { useMessagingContext } from "@/context/messaging-context"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReportModal } from "@/components/report-modal"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const {
    conversations,
    activeConversation,
    activeConversationId,
    joinConversation,
    sendMessage,
    isLoadingConversations,
    isLoadingMessages,
    isConnected,
    connectionError,
  } = useMessagingContext()

  console.log(isConnected, activeConversation, conversations)

  const searchParams = useSearchParams()
  const convId = searchParams.get("conversation")

  // Handle URL conversation parameter
  useEffect(() => {
    if (!convId) return

    const existing = conversations.find((c) => c.id === convId)

    if (existing) {
      joinConversation(existing.id, existing)
    } else if (!isLoadingConversations) {
      console.warn("[Messaging] Conversation not found:", convId)
    }
  }, [convId, joinConversation, conversations, isLoadingConversations])

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Format conversations for MessageList component
  const formattedConversations = filteredConversations.map((conv) => {
    // Format time for display
    const formatTime = (timestamp?: string) => {
      if (!timestamp) return ""

      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 1) {
        return "now"
      } else if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      } else if (diffInHours < 168) {
        // 7 days
        return date.toLocaleDateString([], { weekday: "short" })
      } else {
        return date.toLocaleDateString([], { month: "short", day: "numeric" })
      }
    }

    return {
      id: conv.id,
      name: conv.name,
      lastMessage: conv.lastMessage || "No messages yet",
      time: formatTime(conv.lastMessageTime),
      avatar: conv.avatar,
      isActive: conv.id === activeConversationId,
      unreadCount: conv.unreadCount,
    }
  })

  const handleSendMessage = async (message: string) => {
    if (!activeConversation) {
      throw new Error("No active conversation")
    }

    await sendMessage(activeConversation.id, message)
  }

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true)
  }

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false)
  }

  return (
    <div className="flex h-screen -mx-6 font-sans overflow-hidden">
      <div className="flex bg-[#F9F9F9] flex-1 overflow-hidden">
        {/* Messages list */}
        <div className="w-full bg-white md:w-1/3 lg:w-1/3 flex flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h1 className="text-xl font-bold">Messages</h1>
            {/* {connectionError ? (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-xs">Connection Error</span>
              </div>
            ) : !isConnected ? (
              <div className="flex items-center gap-2 text-amber-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs">Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs">Online</span>
              </div>
            )} */}
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="I am looking for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-hidden">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            ) : formattedConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                <MessageCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">{searchQuery ? "No conversations found" : "No conversations yet"}</p>
              </div>
            ) : (
              <MessageList
                conversations={formattedConversations}
                activeId={activeConversationId ?? ""}
                onSelect={joinConversation}
              />
            )}
          </div>
        </div>

        {/* Active conversation */}
        <div className="hidden flex-1 flex-col md:flex overflow-hidden">
          {activeConversation ? (
            <>
              {/* Conversation Header */}
              <div className="flex bg-white h-16 items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    {activeConversation.avatar && (
                      <Image
                        src={activeConversation.avatar || "/placeholder.svg"}
                        alt={activeConversation.name}
                        fill
                        className="object-cover z-10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#5A5555]">{activeConversation.name}</h2>
                    <p className="text-xs text-[#B3B3B3]">{isConnected ? activeConversation.status : "Offline"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="rounded-full p-2 text-[#12B76A] hover:bg-gray-100 transition-colors">
                    <Flag className="h-5 w-5" fill="#12B76A" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full p-2 text-[#12B76A] hover:bg-gray-100 transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleOpenReportModal}>
                        <Flag className="h-4 w-4 mr-2" />
                        Report User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Message View */}
              {isLoadingMessages ? (
                <div className="flex-1 flex items-center overflow-y-auto justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                </div>
              ) : (
                <MessageView
                  conversation={activeConversation}
                  showProductCard={true}
                  onSendMessage={handleSendMessage}
                />
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Select a conversation to start messaging</p>
                <p className="text-sm text-gray-400">
                  {isConnected ? "Choose from your conversations on the left" : "Connecting to messaging service..."}
                </p>
                {connectionError && <p className="text-sm text-red-500 mt-2">Connection failed: {connectionError}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Mobile empty state */}
        <div className="flex flex-1 items-center justify-center md:hidden">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
          </div>
        </div>
      </div>

      {activeConversation && activeConversation.product && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          reportedUserId={activeConversation.id}
          reportedUserName={activeConversation.name}
          equipmentId={activeConversation.product.id}
        />
      )}
    </div>
  )
}
