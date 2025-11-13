"use client"

import Image from "next/image"
import { MessageList } from "@/components/message-list"
import { MessageView } from "@/components/message-view"
import { ArrowLeft, Flag, MessageCircle, MoreVertical, Search, User } from "lucide-react"
import { useMessagingContext } from "@/context/messaging-context"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReportModal } from "@/components/report-modal"
import Link from "next/link"
import { timeAgo } from "@/app/utils/timeAgo"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

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
    setActiveConversationId,
  } = useMessagingContext()

  const router = useRouter()
  const pathname = usePathname()
  // console.log(activeConversation)

  const searchParams = useSearchParams()
  const convId = searchParams.get("conversation")

  const [userStatus, setUserStatus] = useState<{ lastActive?: number; isOnlinr?: boolean }>({})

  useEffect(() => {
    const handleStorageUpdate = () => {
      const users = JSON.parse(localStorage.getItem("activeUsers") || "{}")
      let status = {}
      if (activeConversation?.userId) {
        status = users[activeConversation.userId] || {}
      }
      setUserStatus(status)
    }

    // Load once
    handleStorageUpdate()

    // Optional: update automatically if socket events update localStorage
    window.addEventListener("storage", handleStorageUpdate)
    return () => window.removeEventListener("storage", handleStorageUpdate)
  }, [activeConversation?.userId])

  // Handle URL conversation parameter
  useEffect(() => {
    if (!convId) {
      setSelectedConversationId(null)
      return
    }

    setSelectedConversationId(convId)

    if (activeConversationId === convId) {
      return
    }

    const existing = conversations.find((c) => c.userId === convId)

    if (existing) {
      joinConversation(existing.userId, existing)
    } else if (!isLoadingConversations) {
      console.warn("[Messaging] Conversation not found:", convId)
    }
  }, [convId, activeConversationId, joinConversation, conversations, isLoadingConversations])

  useEffect(() => {
    if (activeConversationId) {
      setSelectedConversationId(activeConversationId)
    }
  }, [activeConversationId])

  const desiredConversationId = selectedConversationId ?? convId ?? activeConversationId ?? null
  const activeListId = desiredConversationId ?? ""
  const conversationForView =
    activeConversation && desiredConversationId && activeConversation.userId === desiredConversationId
      ? activeConversation
      : null
  const isConversationPending = !!desiredConversationId && !conversationForView

  // Format conversations for MessageList component
  const formattedConversations = useMemo(() => {
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
        return date.toLocaleDateString([], { weekday: "short" })
      } else {
        return date.toLocaleDateString([], { month: "short", day: "numeric" })
      }
    }

    return conversations.map((conv) => ({
      userId: conv.userId,
      name: conv.name,
      lastMessage: conv.lastMessage || "No messages yet",
      time: formatTime(conv.lastMessageTime),
      lastMessageTime: conv.lastMessageTime,
      avatar: conv.avatar,
      isActive: conv.userId === activeListId,
      unreadCount: conv.unreadCount,
    }))
    .sort((a, b) => new Date(b.lastMessageTime ?? 0).getTime() - new Date(a.lastMessageTime ?? 0).getTime())
  }, [conversations, activeListId])

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      setSelectedConversationId(conversationId)

      const params = new URLSearchParams(searchParams.toString())
      params.set("conversation", conversationId)
      const nextPath = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(nextPath, { scroll: false })

      const targetConversation = conversations.find((c) => c.userId === conversationId)
      joinConversation(conversationId, targetConversation)
    },
    [conversations, joinConversation, pathname, router, searchParams],
  )

  const handleSendMessage = async (message: string) => {
    const targetConversation = conversationForView ?? activeConversation
    if (!targetConversation) {
      throw new Error("No active conversation")
    }

    await sendMessage(targetConversation.userId, message)
  }

  // const handleOpenReportModal = () => {
  //   setIsReportModalOpen(true)
  // }

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false)
  }

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return formattedConversations
    return formattedConversations.filter((conv) =>
    (conv.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [formattedConversations, searchQuery])


  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-4 md:-mx-6 font-sans relative overflow-hidden">
        {/* Messages list */}
        <div 
          className={`
          flex flex-col md:border-r bg-white
          transition-transform duration-300 ease-in-out
          w-full md:w-[30%]
          ${desiredConversationId ? "translate-x-[-100%] md:translate-x-0" : "translate-x-0"}
        `}
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white border-b">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <h1 className="text-xl font-bold">Messages</h1>
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
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                <MessageCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">{searchQuery ? "No conversations found" : "No conversations yet"}</p>
              </div>
            ) : (
              <MessageList
                conversations={filteredConversations}
                activeId={activeListId}
                onSelect={handleSelectConversation}
              />
            )}
          </div>
        </div>

        {/* Active conversation */}
        <div 
          className={`
          absolute top-0 left-0 w-full h-full bg-white flex flex-col
          transition-transform duration-300 ease-in-out
          md:static md:flex-1
          ${desiredConversationId ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
        >
          {conversationForView ? (
            <>
              {/* Conversation Header */}
              <div className="sticky top-0 z-30 bg-white h-16 flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  {/* Back button (mobile only) */}
                  <button
                    onClick={() => {
                      setSelectedConversationId(null)
                      setActiveConversationId(null)
                      const params = new URLSearchParams(searchParams.toString())
                      params.delete("conversation")
                      const nextPath = params.toString() ? `${pathname}?${params.toString()}` : pathname
                      router.replace(nextPath, { scroll: false })
                    }}
                    className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <Link href={`/dashboard/user/owner/${conversationForView.userId}`} className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <User className="h-5 w-5" />
                      </div>
                      {conversationForView.avatar && (
                        <Image
                          src={conversationForView.avatar || "/placeholder.svg"}
                          alt={conversationForView.name}
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
                      <h2 className="text-sm md:text-base truncate whitespace-nowrap font-semibold text-[#5A5555]">{conversationForView.name}</h2>
                      <p className="text-xs text-[#B3B3B3]">
                        {userStatus?.isOnlinr ? (
                          <span className="text-[#12B76A]">Online</span>
                        ) : userStatus?.lastActive ? (
                          `Last active ${timeAgo(userStatus.lastActive)}`
                        ) : (
                          "Offline"
                        )}
                      </p>
                    </div>
                  </Link>
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
                      <DropdownMenuItem 
                        onSelect={(e) => {
                          e.preventDefault();
                          setIsReportModalOpen(true);
                        }}
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Report User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Message View */}
              {isLoadingMessages || isConversationPending ? (
                <div className="flex-1 flex items-center overflow-y-auto justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <MessageView
                    conversation={conversationForView}
                    showProductCard={true}
                    onSendMessage={handleSendMessage}
                  />
                </div>
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

      {conversationForView && conversationForView.equipment && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          reportedUserId={conversationForView.userId}
          reportedUserName={conversationForView.name}
          equipmentId={conversationForView.equipment._id}
        />
      )}
    </div>
  )
}
