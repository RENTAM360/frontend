"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MessageCircle, ThumbsUp, Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"

type Owner = {
  id: string
  name: string
  profileImage: string
}

type Reply = {
  id: string
  user: {
    id: string
    name: string
    profileImage: string
  }
  text: string
  date: string
  isOwner: boolean
}

type Review = {
  id: string
  user: {
    id: string
    name: string
    profileImage: string
  }
  text: string
  date: string
  likes: number
  image?: string
  replies: Reply[]
}

interface ReviewsPageClientProps {
  owner: Owner
  reviews: Review[]
  ownerId: string
}

export function ReviewsPageClient({ owner, reviews, ownerId }: ReviewsPageClientProps) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  const handleFeedbackSubmit = async (data: { feedback: string; images: File[] }) => {
    // This would be replaced with your actual submission logic
    console.log("Submitting feedback:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // After successful submission, you would typically refetch the reviews
  }

  return (
    <div className="container font-sans mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex md:items-center gap-2">
              <Link href={`/user/owner/${ownerId}`} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="md:text-2xl font-bold">
                Feedback about <span className="underline text-primary">{owner.name}</span>
              </h1>
            </div>
            <Button className="bg-primary hover:bg-green-600" onClick={() => setIsFeedbackModalOpen(true)}>
              Leave feedback
            </Button>
          </div>

          {/* Reviews List */}
          <div className="space-y-6 bg-white">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg p-6">
                <div className="bg-[#F8F8F8] p-3 mb-3 rounded-xl">
                    {/* Review Header */}
                    <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                        src={review.user.profileImage}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold">{review.user.name}</h3>
                    </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-gray-700 mb-3">{review.text}</p>
                </div>

                {/* Review Image (if any) */}
                {review.image && (
                  <div className="mb-3">
                    <Image
                      src={review.image}
                      alt="Review image"
                      width={300}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <span>{review.date}</span>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    Like
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                  {review.likes > 0 && (
                    <div className="flex items-center gap-1 text-primary">
                      <ThumbsUp className="w-4 h-4 fill-primary" />
                      {review.likes}
                    </div>
                  )}
                </div>

                {/* Replies */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4 pl-10 space-y-4">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={reply.user.profileImage}
                              alt={reply.user.name}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold">{reply.user.name}</h4>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{reply.text}</p>
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                          <span>{reply.date}</span>
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

                {/* Reply Input */}
                <div className="mt-4 pl-10">
                  <div className="flex items-center gap-2 border rounded-sm p-2 bg-[#F8F8F8]">
                    <input type="text" placeholder="Write a reply..." className="flex-1 outline-none text-sm px-2" />
                    <button className="text-gray-400 hover:text-gray-600">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="bg-primary text-white rounded-full p-1.5">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg p-6 sticky top-20">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-full p-2 text-primary">
                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.73438 10.75C8.73438 9.14627 9.37145 7.60822 10.5055 6.47421C11.6395 5.3402 13.1775 4.70313 14.7812 4.70312H28.8906C31.7417 4.70313 34.476 5.83571 36.492 7.85173C38.508 9.86774 39.6406 12.602 39.6406 15.4531V22.8438C39.6406 24.4475 39.0035 25.9855 37.8695 27.1195C36.7355 28.2535 35.1975 28.8906 33.5938 28.8906H14.7812C13.1775 28.8906 11.6395 28.2535 10.5055 27.1195C9.37145 25.9855 8.73438 24.4475 8.73438 22.8438V10.75Z" fill="#12B76A"/>
                    <path d="M4.03125 15.4531C4.03125 13.8494 4.66833 12.3113 5.80234 11.1773C6.93635 10.0433 8.47439 9.40625 10.0781 9.40625H28.8906C30.4944 9.40625 32.0324 10.0433 33.1664 11.1773C34.3004 12.3113 34.9375 13.8494 34.9375 15.4531V27.5469C34.9375 29.1506 34.3004 30.6887 33.1664 31.8227C32.0324 32.9567 30.4944 33.5938 28.8906 33.5938H22.3197L13.9817 39.8986C12.6541 40.9024 10.75 39.9551 10.75 38.2902V33.5938H10.0781C8.47439 33.5938 6.93635 32.9567 5.80234 31.8227C4.66833 30.6887 4.03125 29.1506 4.03125 27.5469V15.4531Z" fill="url(#paint0_radial_528_13042)"/>
                    <defs>
                    <radialGradient id="paint0_radial_528_13042" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-3.10137 -0.10213) rotate(49.5625) scale(57.1563 102.959)">
                    <stop stopColor="#12B76A"/>
                    <stop offset="0.535" stopColor="#1DEA8A"/>
                    <stop offset="1" stopColor="#12B76A"/>
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
