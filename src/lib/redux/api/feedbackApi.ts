import { baseApi } from "./baseApi"

export interface FeedbackUser {
  _id: string
  firstName: string
  lastName: string
  avatar: string
  createdAt?: string
}

export type Reply = {
  _id: string
  user: string
  feedbackBy: FeedbackUser
  comment: string
  likes: number[]
  dislikes: number[]
  __v: number
}

export interface Feedback {
  _id: string
  comment: string
  feedbackBy: FeedbackUser
  rating: number
  dislikes: number
  likes: number
  reply?: Reply[]
  replyCount?: number
  __v: number
}

export interface FeedbackResponse {
  status: number
  message: string
  data: Feedback[]
}

export interface CreateFeedbackRequest {
  comment: string
  media?: string[]
  rating: number
}

export interface CreateFeedbackResponse {
  message: string
  data: Feedback
}

export interface FeedbackReply {
  _id: string
  comment: string
  rating?: number
  createdAt: string
  updatedAt: string
  dislikes: number
  likes: number
  user: {
    firstName: string
    lastName: string
    avatar: string
  }
}

export interface FeedbackRepliesResponse {
  status: number
  message: string
  data: FeedbackReply[]
}

export interface CreateReplyRequest {
  comment: string
  media?: string[]
  rating?: number
}

export interface LikeFeedbackResponse {
  message: string
  data: {
    likes: number
    dislikes: number
  }
}

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user feedbacks
    getUserFeedbacks: builder.query<FeedbackResponse, { userId: string; limit?: number; page?: number }>({
      query: ({ userId, limit = 10, page = 1 }) => ({
        url: `/profile/feedback/user/${userId}`,
        params: { limit, page },
      }),
      providesTags: (result, error, { userId }) => [
        { type: "Feedback", id: userId },
        { type: "Feedback", id: "LIST" },
      ],
    }),

    // Create feedback for user
    createUserFeedback: builder.mutation<CreateFeedbackResponse, { userId: string; feedback: CreateFeedbackRequest }>({
      query: ({ userId, feedback }) => ({
        url: `/profile/feedback/user/${userId}`,
        method: "POST",
        body: feedback,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Feedback", id: userId },
        { type: "Feedback", id: "LIST" },
      ],
    }),

    // Get feedback responses/replies
    getFeedbackReplies: builder.query<FeedbackRepliesResponse, string>({
      query: (feedbackId) => `/profile/feedback/${feedbackId}`,
      providesTags: (result, error, feedbackId) => [{ type: "Feedback", id: feedbackId }],
    }),

    // Create reply to feedback
    createFeedbackReply: builder.mutation<
      CreateFeedbackResponse,
      { userId: string; feedbackId: string; reply: CreateReplyRequest }
    >({
      query: ({ userId, feedbackId, reply }) => ({
        url: `/profile/feedback/user/${userId}/reply/${feedbackId}`,
        method: "POST",
        body: reply,
      }),
      invalidatesTags: (result, error, { feedbackId, userId }) => [
        { type: "Feedback", id: feedbackId },
        { type: "Feedback", id: userId },
      ],
    }),

    // Like/dislike feedback
    // API docs: PUT /profile/feedback/{feedbackId}/{action}
    // If you get 404, the endpoint might need userId: /profile/feedback/user/{userId}/{feedbackId}/{action}
    likeFeedback: builder.mutation<LikeFeedbackResponse, { feedbackId: string; userId: string; action: "like" | "dislike" }>({
      query: ({ feedbackId, action }) => ({
        // Using path from API docs - if 404, try: `/profile/feedback/user/${userId}/${feedbackId}/${action}`
        url: `/profile/feedback/${feedbackId}/${action}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { feedbackId, userId }) => [
        { type: "Feedback", id: feedbackId },
        { type: "Feedback", id: userId },
        { type: "Feedback", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetUserFeedbacksQuery,
  useCreateUserFeedbackMutation,
  useGetFeedbackRepliesQuery,
  useCreateFeedbackReplyMutation,
  useLikeFeedbackMutation,
} = feedbackApi
