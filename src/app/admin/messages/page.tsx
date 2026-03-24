"use client";

import Image from "next/image";
import { MessageList } from "@/components/message-list";
import { MessageView } from "@/components/message-view";
import {
  ArrowLeft,
  MessageCircle,
  Search,
  User,
} from "lucide-react";
import { useMessagingContext } from "@/context/messaging-context";
import { socketService } from "@/lib/socket";
import { useGetConversationsQuery } from "@/lib/redux/api/messaging-api";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { timeAgo } from "@/app/utils/timeAgo";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminActiveConversation, setAdminActiveConversation] = useState<import("@/types/messaging").Conversation | null>(null);

  const {
    activeConversationId,
    joinConversation,
    sendMessage,
    isLoadingMessages,
    isConnected,
    connectionError,
    setActiveConversationId,
  } = useMessagingContext();

  // Use unfiltered conversations so admin direct messages (no equipment) are included
  const { data: allConversations = [], isLoading: isLoadingConversations } =
    useGetConversationsQuery(undefined, { refetchOnFocus: true, refetchOnMountOrArgChange: true });

  // Supplement "Unknown" participant names from localStorage (stored when admin clicks Message)
  const conversations = useMemo(() => {
    const stored = JSON.parse(
      typeof window !== "undefined"
        ? localStorage.getItem("conversationUsers") || "{}"
        : "{}"
    );
    return allConversations.map((c) => {
      if (!c.equipmentId && c.participant?.name === "Unknown") {
        const uid = c.participant?.userId || c.receiverId;
        const userData = stored[uid];
        if (userData) {
          return {
            ...c,
            participant: {
              ...c.participant,
              name: `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim() || "Unknown",
              avatar: userData.avatar || c.participant?.avatar || "",
            },
          };
        }
      }
      return c;
    });
  }, [allConversations]);

  // Admin manages its own active conversation from the unfiltered list
  const activeConversation = adminActiveConversation;

  // console.log(isConnected, activeConversation, conversations)

  const searchParams = useSearchParams();
  const convId = searchParams.get("conversation");

  const [userStatus, setUserStatus] = useState<{
    lastActive?: number;
    isOnlinr?: boolean;
  }>({});

  const activeParticipantId =
    activeConversation?.participant?.userId ||
    activeConversation?.receiverId ||
    null;

  useEffect(() => {
    // Read any previously stored status from localStorage
    const users = JSON.parse(localStorage.getItem("activeUsers") || "{}");
    setUserStatus(activeParticipantId ? users[activeParticipantId] || {} : {});

    if (!activeParticipantId) return;

    // Subscribe directly to socket events — the server doesn't include userId
    // in the payload, so we associate the update with the active participant
    const handleStatus = (data: { isOnlinr?: boolean; lastActive?: number }) => {
      setUserStatus({ isOnlinr: data.isOnlinr, lastActive: data.lastActive });
    };

    socketService.onLastActive(handleStatus);
    // Request current status in case the user was already online before we joined
    socketService.requestUserStatus(activeParticipantId);
    return () => socketService.offLastActive(handleStatus);
  }, [activeParticipantId]);

  // Handle URL conversation parameter
  useEffect(() => {
    if (!convId || isLoadingConversations) return;

    const existing = conversations.find(
      (c) => c.participant?.userId === convId || c.receiverId === convId
    );

    const conv = existing ?? (() => {
      // New direct message — try to restore user data from localStorage
      const stored = JSON.parse(localStorage.getItem("conversationUsers") || "{}");
      const userData = stored[convId];
      return {
        receiverId: convId,
        equipmentId: "",
        equipment: { name: "", media: [] as string[] },
        participant: {
          userId: convId,
          name: userData ? `${userData.firstName} ${userData.lastName}` : "User",
          avatar: userData?.avatar || "",
        },
        lastMessage: "",
        conversationId: "",
        lastMessageRead: false,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        messages: [],
      } as import("@/types/messaging").Conversation;
    })();

    setAdminActiveConversation(conv);
    joinConversation(conv.receiverId, conv.equipmentId || undefined, conv);
  }, [convId, isLoadingConversations, conversations, joinConversation]);

  // Conversations are already `Conversation[]` shaped; use them directly
  const formattedConversations = useMemo(() => {
    return conversations;
  }, [conversations]);

  const handleSendMessage = async (message: string) => {
    if (!activeConversation) {
      throw new Error("No active conversation");
    }

    const receiverId =
      activeConversation.participant?.userId || activeConversation.receiverId;
    const equipmentId = activeConversation.equipmentId || undefined;
    await sendMessage(receiverId, equipmentId, message);
  };


  const filteredConversations = useMemo(() => {
    if (!searchQuery) return formattedConversations;
    return formattedConversations.filter(
      (conv) =>
        (conv.participant?.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (conv.equipment?.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [formattedConversations, searchQuery]);

  return (
    <div className="flex h-[calc(100vh-5rem)] -mx-4 md:-mx-6 font-sans relative overflow-hidden">
      {/* Messages list */}
      <div
        className={`
          flex flex-col md:border-r bg-white
          transition-transform duration-300 ease-in-out
          w-full md:w-[30%]
          ${
            activeConversation && !isLoadingMessages
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
                activeConversationId
                  ? activeConversationId.equipmentId
                    ? `${activeConversationId.receiverId}::${activeConversationId.equipmentId}`
                    : `direct::${activeConversationId.receiverId}`
                  : ""
              }
              onSelect={(key: string) => {
                const makeMinimalConv = (receiverId: string, equipmentId: string): import("@/types/messaging").Conversation => ({
                  receiverId,
                  equipmentId,
                  equipment: { name: "", media: [] },
                  participant: { userId: receiverId, name: "User", avatar: "" },
                  lastMessage: "",
                  lastMessageRead: true,
                  conversationId: "",
                  lastMessageTime: "",
                  unreadCount: 0,
                });

                if (key.startsWith("direct::")) {
                  const receiverId = key.slice("direct::".length);
                  if (!receiverId) return;
                  const conv =
                    conversations.find(
                      (c) =>
                        (c.participant?.userId || c.receiverId) === receiverId &&
                        !c.equipmentId
                    ) ?? makeMinimalConv(receiverId, "");
                  setAdminActiveConversation(conv);
                  joinConversation(receiverId, undefined, conv);
                } else {
                  const separatorIdx = key.indexOf("::");
                  const receiverId = key.slice(0, separatorIdx);
                  const equipmentId = key.slice(separatorIdx + 2);
                  if (!receiverId) return;
                  const conv =
                    conversations.find(
                      (c) =>
                        (c.participant?.userId || c.receiverId) === receiverId &&
                        c.equipmentId === equipmentId
                    ) ?? makeMinimalConv(receiverId, equipmentId);
                  setAdminActiveConversation(conv);
                  joinConversation(receiverId, equipmentId || "", conv);
                }
              }}
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
            activeConversation
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          }
        `}
      >
        {activeConversation ? (
          <>
            {/* Conversation Header */}
            <div className="sticky top-0 z-30 bg-white h-16 flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                {/* Back button (mobile only) */}
                <button
                  onClick={() => { setActiveConversationId(null); setAdminActiveConversation(null); }}
                  className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  {activeConversation.participant?.avatar && (
                    <Image
                      src={
                        activeConversation.participant.avatar ||
                        "/placeholder.svg"
                      }
                      alt={activeConversation.participant.name || "User"}
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
                    {activeConversation.participant?.name}
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
              </div>
              <div className="flex items-center space-x-2" />
            </div>

            {/* Message View */}
            {isLoadingMessages ? (
              <div className="flex-1 flex items-center overflow-y-auto justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <MessageView
                  conversation={activeConversation}
                  showProductCard={false}
                  onSendMessage={handleSendMessage}
                  isAdmin={true}
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

      {/* Mobile empty state */}
      {/* <div className="flex flex-1 items-center justify-center md:hidden">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
          </div>
        </div> */}

    </div>
  );
}
