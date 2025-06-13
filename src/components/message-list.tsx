"use client"

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
            <Image
              src={conversation.avatar || "/placeholder.svg"}
              alt={conversation.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between">
              <h3 className="font-medium">{conversation.name}</h3>
              <span className="text-xs text-gray-500">{conversation.time}</span>
            </div>
            <p className="truncate text-sm text-gray-500">{conversation.lastMessage}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
