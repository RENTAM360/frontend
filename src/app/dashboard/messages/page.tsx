"use client";

import Image from "next/image";
import { MessageList } from "@/components/message-list";
import { MessageView } from "@/components/message-view";
import {
  ArrowLeft,
  Flag,
  MessageCircle,
  // MoreVertical,
  Search,
  User,
} from "lucide-react";
import { useMessagingContext } from "@/context/messaging-context";
import { useGetConversationsQuery } from "@/lib/redux/api/messaging-api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { ReportModal } from "@/components/report-modal";
import Link from "next/link";
import { timeAgo } from "@/app/utils/timeAgo";
import type { ConversationId } from "@/types/messaging";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<ConversationId | null>(null);
  const [directActiveConversation, setDirectActiveConversation] =
    useState<import("@/types/messaging").Conversation | null>(null);
  const isNavigatingBackRef = useRef(false);

  const {
    conversations,
    activeConversation: equipmentActiveConversation,
    activeConversationId,
    joinConversation,
    sendMessage,
    isLoadingConversations,
    isLoadingMessages,
    isConnected,
    connectionError,
    markAsRead,
    setActiveConversationId,
  } = useMessagingContext();

  // For direct (admin) messages, use local state; for equipment ones use context
  const activeConversation = directActiveConversation ?? equipmentActiveConversation;

  // Fetch direct (admin) messages — only no-equipment conversations
  const { data: allConversations = [] } = useGetConversationsQuery();
  const directConversations = useMemo(
    () => allConversations.filter((c) => !c.equipmentId),
    [allConversations]
  );

  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiver");
  const equipmentId = searchParams.get("equipment");

  const [userStatus, setUserStatus] = useState<{
    lastActive?: number;
    isOnlinr?: boolean;
  }>({});

  useEffect(() => {
    const handleStorageUpdate = () => {
      const users = JSON.parse(localStorage.getItem("activeUsers") || "{}");
      let status = {};
      if (activeConversation?.participant.userId) {
        status = users[activeConversation.participant.userId] || {};
      }
      setUserStatus(status);
    };

    // Load once
    handleStorageUpdate();

    // Optional: update automatically if socket events update localStorage
    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, [activeConversation?.participant.userId]);

  // Handle URL conversation parameters (receiver + equipment)
  useEffect(() => {
    // Don't process URL params if user just clicked back button
    if (isNavigatingBackRef.current) {
      return;
    }

    if (!receiverId || !equipmentId) {
      setSelectedConversationId(null);
      return;
    }

    const urlConvId: ConversationId = { receiverId, equipmentId };
    setSelectedConversationId(urlConvId);

    // Check if this conversation is already active
    if (
      activeConversationId?.receiverId == receiverId ||
      activeConversationId?.equipmentId == equipmentId
    ) {
      return;
    }

    // Find existing conversation
    const existing = conversations.find(
      (c) =>
        (c.participant?.userId === receiverId || c.receiverId === receiverId) &&
        c.equipmentId === equipmentId
    );

    if (existing) {
      joinConversation(receiverId, equipmentId, existing);
    } else if (!isLoadingConversations) {
      // Even if conversation not in list, try to join it (for new conversations)
      joinConversation(receiverId, equipmentId);
    }
  }, [
    receiverId,
    equipmentId,
    activeConversationId,
    joinConversation,
    conversations,
    isLoadingConversations,
  ]);

  // Reset back navigation flag when URL params are actually cleared
  useEffect(() => {
    if (isNavigatingBackRef.current && !receiverId && !equipmentId) {
      isNavigatingBackRef.current = false;
    }
  }, [receiverId, equipmentId]);

  useEffect(() => {
    if (activeConversationId) {
      setSelectedConversationId(activeConversationId);
    }
  }, [activeConversationId]);

  const desiredConversationId =
    selectedConversationId ??
    (receiverId && equipmentId ? { receiverId, equipmentId } : null) ??
    activeConversationId;

  const conversationForView = activeConversation;

  // const conversationForView =
  //   activeConversation &&
  //   desiredConversationId &&
  //   activeConversation.participant.userId ===
  //     desiredConversationId.receiverId &&
  //   activeConversation.equipmentId === desiredConversationId.equipmentId
  //     ? activeConversation
  //     : null;
  const isConversationPending = !!desiredConversationId && !conversationForView;

  const sortedConversations = useMemo(() => {
    const merged = [...conversations, ...directConversations];

    // Ensure uniqueness by key
    const uniqueConversations = Array.from(
      new Map(
        merged.map((c) => {
          const pid = c.receiverId || c.participant?.userId || "";
          const key = c.equipmentId ? `${pid}::${c.equipmentId}` : `direct::${pid}`;
          return [key, c];
        })
      ).values()
    );

    return uniqueConversations.sort(
      (a, b) =>
        new Date(b.lastMessageTime ?? 0).getTime() -
        new Date(a.lastMessageTime ?? 0).getTime()
    );
  }, [conversations, directConversations]);

  const handleSelectConversation = useCallback(
    (conversationKey: string) => {
      const isDirect = conversationKey.startsWith("direct::");
      const receiverId = isDirect
        ? conversationKey.slice("direct::".length)
        : conversationKey.split("::")[0];
      const equipmentId = isDirect ? "" : conversationKey.split("::")[1] ?? "";

      if (!receiverId) return;

      const convId: ConversationId = { receiverId, equipmentId };

      const allConvs = [...conversations, ...directConversations];
      const targetConversation =
        allConvs.find(
          (c) =>
            (c.participant?.userId === receiverId || c.receiverId === receiverId) &&
            (isDirect ? !c.equipmentId : c.equipmentId === equipmentId)
        ) ??
        (isDirect
          ? {
              receiverId,
              equipmentId: "",
              equipment: { name: "", media: [] },
              participant: { userId: receiverId, name: "Unknown", avatar: "" },
              lastMessage: "",
              lastMessageRead: true,
              lastMessageTime: new Date().toISOString(),
              conversationId: "",
              unreadCount: 0,
            }
          : undefined);

      setSelectedConversationId(convId);

      if (isDirect) {
        setDirectActiveConversation(targetConversation ?? null);
      } else {
        setDirectActiveConversation(null);
      }

      joinConversation(receiverId, equipmentId || undefined, targetConversation);

      if (targetConversation?.conversationId && !isDirect) {
        markAsRead(receiverId, equipmentId, targetConversation.conversationId);
      }

      // Only update URL for equipment-based conversations
      if (!isDirect) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("receiver", receiverId);
        params.set("equipment", equipmentId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [
      conversations,
      directConversations,
      joinConversation,
      pathname,
      router,
      markAsRead,
      searchParams,
    ]
  );

  const handleSendMessage = async (message: string) => {
    const targetConversation = conversationForView ?? activeConversation;
    if (!targetConversation || !activeConversationId) {
      throw new Error("No active conversation");
    }

    await sendMessage(
      activeConversationId.receiverId,
      activeConversationId.equipmentId,
      message
    );
  };

  // const handleOpenReportModal = () => {
  //   setIsReportModalOpen(true)
  // }

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return sortedConversations;
    return sortedConversations.filter(
      (conv) =>
        (conv.participant?.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (conv.equipment?.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [sortedConversations, searchQuery]);

  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-4 md:-mx-6 font-sans relative overflow-hidden">
      {/* Messages list */}
      <div
        className={`
          flex flex-col md:border-r bg-white
          transition-transform duration-300 ease-in-out
          w-full md:w-[30%]
          ${
            desiredConversationId
              ? "translate-x-[-100%] md:translate-x-0"
              : "translate-x-0"
          }
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
              <p className="text-sm">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
            </div>
          ) : (
            <MessageList
              conversations={filteredConversations}
              activeId={
                desiredConversationId
                  ? desiredConversationId.equipmentId
                    ? `${desiredConversationId.receiverId}::${desiredConversationId.equipmentId}`
                    : `direct::${desiredConversationId.receiverId}`
                  : ""
              }
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
          ${
            desiredConversationId
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          }
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
                    // Set flag to prevent URL params from overriding our state change
                    isNavigatingBackRef.current = true;

                    // Clear local state immediately - this takes precedence over URL params
                    setSelectedConversationId(null);
                    setDirectActiveConversation(null);
                    setActiveConversationId(null);

                    // Clear URL params (this happens asynchronously, but state change is immediate)
                    router.replace(pathname, { scroll: false });
                  }}
                  className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <Link
                  href={`/dashboard/user/owner/${conversationForView.participant.userId}`}
                  className="flex items-center space-x-3"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    {conversationForView.participant.avatar && (
                      <Image
                        src={
                          conversationForView.participant.avatar ||
                          "/placeholder.svg"
                        }
                        alt={conversationForView.participant.name}
                        fill
                        className="object-cover z-10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm md:text-base truncate whitespace-nowrap font-semibold text-[#5A5555]">
                      {conversationForView.participant.name}
                    </h2>
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
                <button onClick={() => setIsReportModalOpen(true)} className="rounded-full p-2 text-[#12B76A] hover:bg-gray-100 transition-colors">
                  <Flag className="h-5 w-5" fill="#12B76A" />
                </button>
                {/* <DropdownMenu>
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
                </DropdownMenu> */}
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
                  showProductCard={!!conversationForView.equipmentId}
                  onSendMessage={handleSendMessage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                Select a conversation to start messaging
              </p>
              <p className="text-sm text-gray-400">
                {isConnected
                  ? "Choose from your conversations on the left"
                  : "Connecting to messaging service..."}
              </p>
              {connectionError && (
                <p className="text-sm text-red-500 mt-2">
                  Connection failed: {connectionError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {conversationForView && conversationForView.equipmentId && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          reportedUserId={conversationForView.participant.userId}
          reportedUserName={conversationForView.participant.name}
          equipmentId={conversationForView.equipmentId}
        />
      )}
    </div>
  );
}
