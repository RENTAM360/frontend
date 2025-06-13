"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Paperclip, Send } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "other"
  timestamp: string
}

interface Product {
  id: string
  name: string
  price: string
  image: string
  period: string
  phone: string
}

interface Conversation {
  id: string
  name: string
  status: string
  avatar: string
  messages: Message[]
  product: Product
}

interface MessageViewProps {
  conversation: Conversation
  onSendMessage: (message: string) => void
  showProductCard: boolean
}

export function MessageView({ conversation, onSendMessage, showProductCard }: MessageViewProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Product card */}
        {showProductCard && (
          <div className="mb-6 flex justify-between items-center md:mx-auto md:w-[385px] rounded-lg bg-white p-3">
            <div className="flex">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                  src={conversation.product.image || "/placeholder.svg"}
                  alt={conversation.product.name}
                  fill
                  className="object-cover"
                  />
              </div>
              <div className="ml-3 flex flex-1 flex-col justify-between">
                  <div>
                  <h3 className="font-medium">{conversation.product.name}</h3>
                  <div className="flex items-center">
                      <span className="text-sm font-medium text-emerald-500">₦ {conversation.product.price}</span>
                      <span className="ml-1 text-xs text-gray-500">{conversation.product.period}</span>
                  </div>
                  </div>
              </div>
            </div>
            <a
                href={`tel:${conversation.product.phone}`}
                className="w-fit h-[35px] flex justify-center items-center rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-600"
              >
                {conversation.product.phone}
              </a>
          </div>
        )}


        {/* Messages */}
        <div className="space-y-4">
          {conversation.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[320px] rounded-b-full px-6 py-4 ${
                  msg.sender === "user" ? "bg-[#DDF4C7] rounded-tl-full text-[#5A5555]" : "bg-gray-100 rounded-tr-full text-[#5A5555]"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button type="button" className="flex-shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="flex-shrink-0 rounded-full bg-emerald-500 p-2 text-white hover:bg-emerald-600"
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
