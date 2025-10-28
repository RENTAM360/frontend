"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MessageCircle, ThumbsUp, Paperclip, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import {
  useGetUserFeedbacksQuery,
  useLikeFeedbackMutation,
  useCreateFeedbackReplyMutation,
} from "@/lib/redux/api/feedbackApi"
import { useGetOtherUserProfileQuery } from "@/lib/redux/api/authApi"
import {
  useCreateUserFeedbackMutation,
} from "@/lib/redux/api/feedbackApi"
import { useUploadEquipmentImagesMutation } from "@/lib/redux/api/equipmentApi"
import { AnimatedLogo } from "./loading-logo"

// type Owner = {
//   _id: string
//   firstName: string
//   lastName: string
//   name: string
//   avatarUrl?: string
// }

// type FeedbackUser = {
//   _id: string
//   firstName: string
//   lastName: string
//   avatar?: string
// }

// type Reply = {
//   _id: string
//   user: FeedbackUser
//   comment: string
//   createdAt: string
//   isOwner?: boolean
// }

// type Feedback = {
//   _id: string
//   user: FeedbackUser
//   comment: string
//   rating: number
//   createdAt: string
//   likes?: number
//   dislikes?: number
//   media?: string[]
//   replies?: Reply[]
// }

interface FeedbackPageClientProps {
  ownerId: string
}

export function FeedbackPageClient({ ownerId }: FeedbackPageClientProps) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [likedFeedbacks, setLikedFeedbacks] = useState<Set<string>>(new Set())
  const { data: ownerProfile } = useGetOtherUserProfileQuery(ownerId!, {
      skip: !ownerId,
    })
  const [createFeedback] = useCreateUserFeedbackMutation()
  const [uploadEquipmentImages] = useUploadEquipmentImagesMutation()

  const { data: feedbackData, isLoading, error } = useGetUserFeedbacksQuery({ userId: ownerId })
  const [likeFeedback] = useLikeFeedbackMutation()
  const [createReply, { isLoading: isCreatingReply }] = useCreateFeedbackReplyMutation()

  const feedbacks = feedbackData?.data || []

  console.log(feedbacks)

  const handleFeedbackSubmit = async (data: { feedback: string; images: File[]; rating: number }) => {
    try {
      let mediaUrls: string[] = []

      if (data.images.length > 0) {
        const uploadRes = await uploadEquipmentImages(data.images).unwrap()
        mediaUrls = uploadRes.data
      }

      // then submit feedback
      await createFeedback({
        userId: ownerId,
        feedback: {
          comment: data.feedback,
          media: mediaUrls,
          rating: data.rating,
        },
      }).unwrap()
    } catch (error) {
      console.error("Failed to submit feedback:", error)
      throw error
    }
  }

  const handleReplyClick = (feedbackId: string) => {
    setActiveReplyId(activeReplyId === feedbackId ? null : feedbackId)
  }

  const handleReplyTextChange = (feedbackId: string, text: string) => {
    setReplyTexts((prev) => ({ ...prev, [feedbackId]: text }))
  }

  const handleSubmitReply = async (feedbackId: string) => {
    const replyText = replyTexts[feedbackId]?.trim()
    if (!replyText) return

    try {
      await createReply({
        userId: ownerId,
        feedbackId,
        reply: {
          comment: replyText,
        },
      }).unwrap()

      setReplyTexts((prev) => ({ ...prev, [feedbackId]: "" }))
      setActiveReplyId(null)
    } catch (error) {
      console.error("Failed to submit reply:", error)
    }
  }

  const handleLikeFeedback = async (feedbackId: string) => {
    try {
      await likeFeedback({ feedbackId, action: "like" }).unwrap()
      setLikedFeedbacks((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(feedbackId)) {
          newSet.delete(feedbackId)
        } else {
          newSet.add(feedbackId)
        }
        return newSet
      })
    } catch (error) {
      console.error("Failed to like feedback:", error)
    }
  }

  if (isLoading) {
    return <AnimatedLogo />
  }

  if (error) {
    return (
      <div className="container font-sans mx-auto px-4 py-6">
        <div className="text-center py-8 text-red-500">
          <p>Error loading feedback. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container font-sans mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex md:items-center gap-2">
              <Link href={`/dashboard/user/owner/${ownerId}`} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="md:text-2xl font-bold">
                Feedback about <span className="underline text-primary">{ownerProfile?.data.user.firstName} {ownerProfile?.data.user.lastName}</span>
              </h1>
            </div>
            <Button className="bg-primary hover:bg-green-600" onClick={() => setIsFeedbackModalOpen(true)}>
              Leave feedback
            </Button>
          </div>

          {/* Feedback List */}
          <div className="space-y-6 bg-white">
            {!feedbacks || feedbacks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No feedback yet for {ownerProfile?.data.user.firstName} {ownerProfile?.data.user.lastName}</p>
              </div>
            ) : (
              feedbacks.map((feedback) => (
                <div key={feedback._id} className="bg-white rounded-lg p-6">
                  <div className="bg-[#F8F8F8] p-3 mb-3 rounded-xl">
                    {/* Feedback Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                        {feedback?.user?.avatar ? (
                          <Image
                            src={feedback?.user?.avatar || "/placeholder.svg"}
                            alt={`${feedback.user.firstName} ${feedback.user.lastName}`}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <>
                            {feedback.user.firstName[0]}
                            {feedback.user.lastName[0]}
                          </>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {feedback.user.firstName} {feedback.user.lastName}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-gray-500 ml-1">({feedback.rating}/5)</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <p className="text-gray-700 mb-3">{feedback.comment}</p>
                  </div>

                  {/* Feedback Media (if any) */}
                  {feedback.media && feedback.media.length > 0 && (
                    <div className="mb-3 flex gap-2">
                      {feedback.media.map((mediaUrl, index) => (
                        <Image
                          key={index}
                          src={mediaUrl || "/placeholder.svg"}
                          alt={`Feedback media ${index + 1}`}
                          width={300}
                          height={200}
                          className="rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Feedback Actions */}
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                    <button
                      className={`flex items-center gap-1 hover:text-gray-700 ${
                        likedFeedbacks.has(feedback._id) ? "text-primary" : ""
                      }`}
                      onClick={() => handleLikeFeedback(feedback._id)}
                    >
                      <ThumbsUp className={`w-4 h-4 ${likedFeedbacks.has(feedback._id) ? "fill-primary" : ""}`} />
                      Like
                    </button>
                    <button
                      className="flex items-center gap-1 hover:text-gray-700"
                      onClick={() => handleReplyClick(feedback._id)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </button>
                    {feedback.likes && feedback.likes > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <ThumbsUp className="w-4 h-4 fill-primary" />
                        {feedback.likes}
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {feedback.replies && feedback.replies.length > 0 && (
                    <div className="mt-4 pl-10 space-y-4">
                      {feedback.replies.map((reply) => (
                        <div key={reply._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                              {reply?.user?.avatar ? (
                                <Image
                                  src={reply.user.avatar || "/placeholder.svg"}
                                  alt={`${reply.user.firstName} ${reply.user.lastName}`}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              ) : (
                                <>
                                  {reply.user.firstName[0]}
                                  {reply.user.lastName[0]}
                                </>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                {reply.user.firstName} {reply.user.lastName}
                              </h4>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{reply.comment}</p>
                          <div className="flex items-center text-sm text-gray-500 gap-4">
                            <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                            {reply.isOwner ? (
                              <button className="text-gray-500 hover:text-gray-700">Edit</button>
                            ) : (
                              <button className="text-gray-500 hover:text-gray-700">Like</button>
                            )}
                            <button className="text-gray-500 hover:text-gray-700">Reply</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mt-4 pl-10 transition-all duration-300 ease-in-out ${
                      activeReplyId === feedback._id ? "max-h-20 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="flex items-center gap-2 border rounded-sm p-2 bg-[#F8F8F8]">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="flex-1 outline-none text-sm px-2 bg-transparent"
                        value={replyTexts[feedback._id] || ""}
                        onChange={(e) => handleReplyTextChange(feedback._id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmitReply(feedback._id)
                          }
                        }}
                      />
                      <button className="text-gray-400 hover:text-gray-600">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        className="bg-primary text-white rounded-full p-1.5 disabled:opacity-50"
                        onClick={() => handleSubmitReply(feedback._id)}
                        disabled={isCreatingReply || !replyTexts[feedback._id]?.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" onClick={() => setActiveReplyId(null)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg p-6 sticky top-20">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-full p-2 text-primary">
                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.73438 10.75C8.73438 9.14627 9.37145 7.60822 10.5055 6.47421C11.6395 5.3402 13.1775 4.70313 14.7812 4.70312H28.8906C31.7417 4.70313 34.476 5.83571 36.492 7.85173C38.508 9.86774 39.6406 12.602 39.6406 15.4531V22.8438C39.6406 24.4475 39.0035 25.9855 37.8695 27.1195C36.7355 28.2535 35.1975 28.8906 33.5938 28.8906H14.7812C13.1775 28.8906 11.6395 28.2535 10.5055 27.1195C9.37145 25.9855 8.73438 24.4475 8.73438 22.8438V10.75Z"
                    fill="#12B76A"
                  />
                  <path
                    d="M4.03125 15.4531C4.03125 13.8494 4.66833 12.3113 5.80234 11.1773C6.93635 10.0433 8.47439 9.40625 10.0781 9.40625H28.8906C30.4944 9.40625 32.0324 10.0433 33.1664 11.1773C34.3004 12.3113 34.9375 13.8494 34.9375 15.4531V27.5469C34.9375 29.1506 34.3004 30.6887 33.1664 31.8227C32.0324 32.9567 30.4944 33.5938 28.8906 33.5938H22.3197L13.9817 39.8986C12.6541 40.9024 10.75 39.9551 10.75 38.2902V33.5938H10.0781C8.47439 33.5938 6.93635 32.9567 5.80234 31.8227C4.66833 30.6887 4.03125 29.1506 4.03125 27.5469V15.4531Z"
                    fill="url(#paint0_radial_528_13042)"
                  />
                  <defs>
                    <radialGradient
                      id="paint0_radial_528_13042"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(-3.10137 -0.10213) rotate(49.5625) scale(57.1563 102.959)"
                    >
                      <stop stopColor="#12B76A" />
                      <stop offset="0.535" stopColor="#1DEA8A" />
                      <stop offset="1" stopColor="#12B76A" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Your feedback is very important for the seller review. Please, leave the honest review to help other
              buyers and the seller in the customer attraction
            </p>
          </div>
        </div>
      </div>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        ownerId={ownerId}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  )
}
