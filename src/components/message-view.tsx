"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Paperclip } from "lucide-react"
import type { Conversation } from "@/types/messaging"
import { useMessagingContext } from "@/context/messaging-context"

interface MessageViewProps {
  conversation: Conversation
  showProductCard: boolean
  onSendMessage?: (message: string) => Promise<void>
}

export function MessageView({ conversation, showProductCard }: MessageViewProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { sendMessage } = useMessagingContext()

  console.log(conversation, showProductCard)

   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    const messageContent = message.trim()
    setMessage("")          
    setIsSending(true)

    try {
      await sendMessage(conversation.id, messageContent, undefined, conversation.product?.id)
      console.log("[v0] Message sent successfully via context")
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
      // Restore message on error
      setMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }


  return (
    <div className="flex h-full bg-[#F9F9F9] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Product card */}
        {showProductCard && conversation.product && (
          <div className="mb-6 flex justify-between items-center md:mx-auto md:w-[385px] rounded-lg bg-white p-3">
            <div className="flex items-center">
              <div className="relative h-14 w-18 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                  src={conversation.product.image || conversation.product.imageUrl || "/placeholder.svg"}
                  alt={conversation.product.name}
                  fill
                  className="object-cover"
                  />
              </div>
              <div className="ml-3 flex flex-1 flex-col justify-between">
                  <div>
                  <h3 className="font-medium">{conversation.product.name}</h3>
                  <div className="flex items-center">
                      <span className="text-sm font-medium text-emerald-500">₦{Number(conversation.product.price || conversation.product.pricePerDay).toLocaleString("en-NG")} <span className="font-light text-[#979797]">Per day</span></span>
                      <span className="ml-1 text-xs text-gray-500">{conversation.product.period}</span>
                  </div>
                  </div>
              </div>
            </div>
            {conversation.product.availability ? ( <a
                className="w-fit h-[35px] flex justify-center items-center rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-600"
              >
                Available
              </a>) : <a
                className="w-fit h-[35px] flex justify-center items-center rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-600"
              >
                Unavailable
              </a>}
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
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="sticky bottom-0 z-20 border-t bg-white p-3">
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
            className="flex-shrink-0"
            disabled={!message.trim() || isSending}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9987 0.333313C19.1874 0.333313 21.3547 0.764409 23.3768 1.60199C25.3988 2.43957 27.2362 3.66722 28.7838 5.21487C30.3315 6.76251 31.5591 8.59983 32.3967 10.6219C33.2343 12.644 33.6654 14.8113 33.6654 17C33.6654 21.4203 31.9094 25.6595 28.7838 28.7851C25.6582 31.9107 21.419 33.6666 16.9987 33.6666C14.81 33.6666 12.6427 33.2355 10.6206 32.398C8.59855 31.5604 6.76123 30.3327 5.21358 28.7851C2.08798 25.6595 0.332031 21.4203 0.332031 17C0.332031 12.5797 2.08798 8.34047 5.21358 5.21487C8.33919 2.08926 12.5784 0.333313 16.9987 0.333313ZM10.332 9.84998V15.4166L22.232 17L10.332 18.5833V24.15L26.9987 17L10.332 9.84998Z" fill="#12B76A"/>
            </svg>

          </button>
        </form>
      </div>
    </div>
  )
}
