"use client"

import { User } from "lucide-react"
import Image from "next/image"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  avatar: string
  isActive?: boolean
}

interface MessageListProps {
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
}

export function MessageList({ conversations, activeId, onSelect }: MessageListProps) {
  // console.log(conversations)
  return (
    <div className="divide-y bg-white overflow-y-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          className={`flex w-full items-start space-x-3 px-4 py-4 text-left hover:bg-gray-50 ${
            conversation.id === activeId ? "bg-white" : ""
          }`}
          onClick={() => onSelect(conversation.id)}
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
              <span className="text-xs text-[#5A5555]">{conversation.time}</span>
            </div>
            <p className="truncate text-xs text-[#5A5555]">{conversation.lastMessage}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
