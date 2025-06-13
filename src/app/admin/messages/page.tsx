"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageList } from "@/components/message-list"
import { MessageView } from "@/components/message-view"
import { Flag, MoreVertical } from "lucide-react"

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState({
    id: "1",
    name: "Thankgod ogbonna",
    status: "Online",
    avatar: "/tg.svg",
    messages: [
      {
        id: "1",
        text: "i'm looking for information about your car I want to rent it, can I call you?",
        sender: "user",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Thanks for reaching out about our Toyota Camry. Yes, you can absolutely call us",
        sender: "other",
        timestamp: new Date().toISOString(),
      },
    ],
    product: {
      id: "1",
      name: "Toyota camry",
      price: "50,000",
      image: "/toyota-black.svg",
      period: "Per a day",
      phone: "08107355412",
    },
  })

  return (
      <div className="flex h-[calc(100vh)] font-sans flex-col">
        <div className="flex bg-[#F9F9F9] flex-1 overflow-hidden">
          {/* Messages list */}
          <div className="w-full bg-white md:w-1/3 lg:w-1/4">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="I am looking for..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <svg width="22" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5404 19.9374C5.3612 19.9374 1.14453 15.7208 1.14453 10.5416C1.14453 5.36242 5.3612 1.14575 10.5404 1.14575C15.7195 1.14575 19.9362 5.36242 19.9362 10.5416C19.9362 15.7208 15.7195 19.9374 10.5404 19.9374ZM10.5404 2.52075C6.11286 2.52075 2.51953 6.12325 2.51953 10.5416C2.51953 14.9599 6.11286 18.5624 10.5404 18.5624C14.9679 18.5624 18.5612 14.9599 18.5612 10.5416C18.5612 6.12325 14.9679 2.52075 10.5404 2.52075Z" fill="#979797"/>
                    <path d="M20.167 20.8542C19.9928 20.8542 19.8186 20.7901 19.6811 20.6526L17.8478 18.8192C17.582 18.5534 17.582 18.1134 17.8478 17.8476C18.1136 17.5817 18.5536 17.5817 18.8195 17.8476L20.6528 19.6809C20.9186 19.9467 20.9186 20.3867 20.6528 20.6526C20.5153 20.7901 20.3411 20.8542 20.167 20.8542Z" fill="#979797"/>
                </svg>
              </div>
            </div>
            <MessageList
              conversations={Array.from({ length: 5 }, (_, i) => ({
                id: `${i + 1}`, 
                name: "Thankgod Ogbonna",
                lastMessage: "Hello, how is it going?",
                time: "12:00pm",
                avatar: "/tg.svg",
                isActive: i === 0, 
            }))}
              activeId="1"
              onSelect={() => {}}
            />
          </div>

          {/* Active conversation */}
          <div className="hidden flex-1 flex-col md:flex">
            <div className="flex bg-white h-16 items-center justify-between px-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={activeConversation.avatar || "/placeholder.svg"}
                    alt={activeConversation.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-semibold">{activeConversation.name}</h2>
                  <p className="text-xs text-emerald-500">{activeConversation.status}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="rounded-full p-2 text-emerald-500 hover:bg-gray-100">
                  <Flag className="h-5 w-5" />
                </button>
                <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
            <MessageView
              conversation={activeConversation}
              showProductCard={false}
              onSendMessage={(message) => console.log("Sending message:", message)}
            />
          </div>

          {/* Empty state for mobile */}
          <div className="flex flex-1 items-center justify-center md:hidden">
            <div className="text-center">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </div>
  )
}
