"use client";

import type React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Conversation } from "@/types/messaging";
import { useMessagingContext } from "@/context/messaging-context";
import { useGetEquipmentByIdQuery } from "@/lib/redux/api/equipmentApi";
import { MediaUploadDropdown } from "./media-upload-dropdown";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MessageViewProps {
  conversation: Conversation;
  showProductCard: boolean;
  onSendMessage?: (message: string) => Promise<void>;
  isAdmin?: boolean;
}

export function MessageView({
  conversation,
  showProductCard,
}: MessageViewProps) {
  const { currentUserId, messages: contextMessages } = useMessagingContext();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useMessagingContext();
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isVideoPreview, setIsVideoPreview] = useState(false);

  // Memoize messages so the reference is stable and doesn't change every render
  // Use messages from context (includes merged socket messages) - this is the source of truth
  const messages = useMemo(() => {
    return contextMessages ?? conversation.messages ?? [];
  }, [contextMessages, conversation.messages]);

  // Debug log to verify messages are being used
  useEffect(() => {
    const finalMessagesCount = messages.length;
    const lastMessage = messages[finalMessagesCount - 1]?.content?.substring(
      0,
      30
    );
    const messageIds = messages.map((m) => m._id);

    console.log("[MessageView] Messages array updated:", {
      finalMessagesCount,
      lastMessage,
      messageIds,
    });
  }, [messages]);

  const eqId = useMemo(() => conversation?.equipmentId ?? "", [conversation]);

  useEffect(() => {
    console.log("eqId changed:", eqId);
  }, [eqId]);

  const { data: equipmentData } = useGetEquipmentByIdQuery(eqId, {
    skip: !eqId,
  });

  const phone = equipmentData?.owner?.phone;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get receiverId from conversation (either directly or from participant)
    const receiverId =
      conversation.receiverId || conversation.participant?.userId;
    const equipmentId = conversation.equipmentId;

    if (!message.trim() || isSending || !receiverId) {
      console.warn("[MessageView] Cannot send message - missing data:", {
        receiverId,
        equipmentId,
        message: message.trim(),
      });
      return;
    }

    const messageContent = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      await sendMessage(receiverId, equipmentId, messageContent);
      console.log("[v0] Message sent successfully via context");
    } catch (error) {
      console.error("[v0] Failed to send message:", error);
      // Restore message on error
      setMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const product = conversation.equipment;
  // Use equipment data from API query if available, otherwise use conversation equipment
  const productImage =
    equipmentData?.media?.[0] || product?.media?.[0] || "/placeholder.svg";
  const productName = equipmentData?.name || product?.name || "";
  const productPrice = equipmentData?.pricePerDay;

  // Helper function to check if URL is a local file URI
  const isLocalFileUri = (url: string) => {
    return (
      url.startsWith("file://") ||
      url.startsWith("blob:") ||
      url.startsWith("data:")
    );
  };

  return (
    <div className="flex h-full bg-[#F9F9F9] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Product card */}
        {showProductCard && (product || equipmentData) && (
          <div className="mb-6 flex justify-between items-center md:mx-auto md:w-[385px] rounded-lg bg-white p-3">
            <div className="flex items-center">
              <div className="relative h-14 w-18 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-medium">{productName}</h3>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-emerald-500">
                      {productPrice
                        ? `₦${Number(productPrice).toLocaleString("en-NG")}`
                        : "Price unavailable"}
                      <span className="font-light text-[#979797]">
                        {" "}
                        Per day
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="w-fit h-[35px] flex justify-center items-center rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-600"
              >
                Call Rental
              </a>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg) => {
            const content = msg.content;
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(content);
            const isVideo = /\.(mp4|mov|webm)$/i.test(content);
            const isDocument = /\.(pdf|docx?|xls|xlsx)$/i.test(content);
            const isSender = msg.sender === currentUserId;

            const textBubbleClass = isSender
              ? "bg-[#DDF4C7] rounded-tl-full text-[#5A5555]"
              : "bg-gray-100 rounded-tr-full text-[#5A5555]";

            return (
              <div
                key={msg._id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                {/* 🗨️ Text messages */}
                {!isImage && !isVideo && !isDocument && (
                  <div
                    className={`max-w-[320px] rounded-b-full px-6 py-4 ${textBubbleClass}`}
                  >
                    <p className="text-sm">{content}</p>
                  </div>
                )}

                {/* Image messages */}
                {isImage && (
                  <div className="relative w-[191px] h-[223px] rounded-[10px] overflow-hidden">
                    {isLocalFileUri(content) ? (
                      <Image
                        src={content}
                        alt="Sent image"
                        fill
                        unoptimized
                        onClick={() => {
                          setIsVideoPreview(false);
                          setMediaPreview(content);
                        }}
                        className="object-cover rounded-[10px] cursor-pointer"
                      />
                    ) : (
                      <Image
                        src={content}
                        alt="Sent image"
                        fill
                        onClick={() => {
                          setIsVideoPreview(false);
                          setMediaPreview(content);
                        }}
                        className="object-cover rounded-[10px] cursor-pointer"
                      />
                    )}
                  </div>
                )}

                {/* Video messages */}
                {isVideo && (
                  <video
                    controls
                    className="w-[191px] h-[223px] rounded-[10px] object-cover"
                    onClick={() => {
                      setIsVideoPreview(true);
                      setMediaPreview(content);
                    }}
                  >
                    <source src={content} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {/* Document messages */}
                {isDocument && (
                  <a
                    href={content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-emerald-600 underline"
                  >
                    <span>View Document</span>
                  </a>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="sticky bottom-0 z-20 border-t bg-white p-3">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-shrink-0 bg-primary w-8 h-8 flex justify-center items-center cursor-pointer rounded-full p-2">
            <MediaUploadDropdown
              onUpload={async (urls) => {
                console.log("Uploaded file URLs:", urls);

                // Send as a chat message (e.g., sendMessage with type "media")
                const receiverId =
                  conversation.receiverId || conversation.participant?.userId;
                const equipmentId = conversation.equipmentId;
                if (!receiverId) {
                  console.warn(
                    "[MessageView] Cannot send media - missing data:",
                    { receiverId, equipmentId }
                  );
                  return;
                }
                for (const url of urls) {
                  await sendMessage(receiverId, equipmentId, url);
                }
              }}
            />
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="flex-shrink-0 cursor-pointer"
            disabled={!message.trim() || isSending}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.9987 0.333313C19.1874 0.333313 21.3547 0.764409 23.3768 1.60199C25.3988 2.43957 27.2362 3.66722 28.7838 5.21487C30.3315 6.76251 31.5591 8.59983 32.3967 10.6219C33.2343 12.644 33.6654 14.8113 33.6654 17C33.6654 21.4203 31.9094 25.6595 28.7838 28.7851C25.6582 31.9107 21.419 33.6666 16.9987 33.6666C14.81 33.6666 12.6427 33.2355 10.6206 32.398C8.59855 31.5604 6.76123 30.3327 5.21358 28.7851C2.08798 25.6595 0.332031 21.4203 0.332031 17C0.332031 12.5797 2.08798 8.34047 5.21358 5.21487C8.33919 2.08926 12.5784 0.333313 16.9987 0.333313ZM10.332 9.84998V15.4166L22.232 17L10.332 18.5833V24.15L26.9987 17L10.332 9.84998Z"
                fill="#12B76A"
              />
            </svg>
          </button>
        </form>
      </div>
      <Dialog open={!!mediaPreview} onOpenChange={() => setMediaPreview(null)}>
        <DialogContent className="max-w-full max-h-full bg-black p-0 flex items-center justify-center">
          {isVideoPreview ? (
            <video
              src={mediaPreview!}
              controls
              autoPlay
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          ) : mediaPreview && isLocalFileUri(mediaPreview) ? (
            <Image
              src={mediaPreview}
              alt="Preview"
              width={1000}
              height={1000}
              unoptimized
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          ) : (
            <Image
              src={mediaPreview!}
              alt="Preview"
              width={1000}
              height={1000}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
