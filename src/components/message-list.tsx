"use client"

import { Conversation } from "@/types/messaging"
import { User } from "lucide-react"
import Image from "next/image"

interface MessageListProps {
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
}

const formatTime = (timestamp?: string) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffInMinutes = diffMs / (1000 * 60);
  const diffInHours = diffMs / (1000 * 60 * 60);
  const diffInDays = diffMs / (1000 * 60 * 60 * 24);

  // Less than a minute ago
  if (diffInMinutes < 1) {
    return "now";
  }
  // Less than an hour ago
  else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  }
  // Within today
  else if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  // Within this week
  else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" }); // e.g., "Fri"
  }
  // Older
  else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" }); // e.g., "Oct 17"
  }
};


export function MessageList({ conversations, activeId, onSelect }: MessageListProps) {
  // console.log(conversations)
  return (
    <div className="divide-y bg-white overflow-y-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.userId}
          className={`flex w-full items-start space-x-3 px-4 py-4 text-left hover:bg-gray-50 ${
            conversation.userId === activeId ? "bg-white" : ""
          }`}
          onClick={() => onSelect(conversation.userId)}
        >
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
            {conversation.avatar ? (
              <Image
                src={conversation.avatar || "/placeholder.svg"}
                alt={conversation.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center bg-gray-100 justify-center text-gray-400">
                <User className="h-6 w-6" />
              </div>
            )}
            
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between">
              <h3 className="font-sm font-medium text-[#5A5555]">{conversation.name}</h3>
              <div className="flex flex-col">
                <span className="text-xs text-[#5A5555]">{formatTime(conversation.lastMessageTime)}</span>
                {(conversation.unreadCount ?? 0) > 0 &&<div className="w-4 h-4 self-end rounded-full flex justify-center items-center text-white p-1 text-[9px] bg-primary">{conversation.unreadCount}</div>}
              </div>
            </div>          
              <p className="truncate text-xs text-[#5A5555]">
                {(() => {
                  const msg = conversation.lastMessage || "";
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(msg);
                  const isVideo = /\.(mp4|mov|webm)$/i.test(msg);
                  const isDocument = /\.(pdf|docx?|xls|xlsx)$/i.test(msg);

                  if (isImage) return "Image";
                  if (isVideo) return "Video";
                  if (isDocument) return "Document";
                  return msg;
                })()}
              </p>
          </div>
        </button>
      ))}
    </div>
  )
}
