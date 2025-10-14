import { baseApi } from "./baseApi"

// Define the equipment interface based on your actual API response
export interface Equipment {
  _id: string
  name: string
  category: Array<{
    _id: string
    name: string
  }>
  media: string[]
  rating: number
  // Additional fields that might be added later
  pricePerDay?: number
  description?: string
  location: {
    coordinates: {
      coordinates: [number, number]
      type: "Point"
    }
  }
  owner?: {
    id: string
    name: string
    verified?: boolean
  }
  availability?: boolean
  createdAt?: string
  updatedAt?: string
}

// API response interface matching your actual response
export interface EquipmentResponse {
  status: number
  message: string
  data: {
    equipments: Equipment[]
    totalCount: number
  }
}

// Query parameters interface
export interface EquipmentQueryParams {
  page?: number
  limit?: number
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  location?: string
  userId?: string 
}

// Transformed equipment interface for components (to maintain compatibility)
export interface TransformedEquipment {
  id: string
  title: string
  name: string
  category: string
  categoryId: string
  pricePerDay: number
  rating: number
  imageUrl: string
  media: string[]
  description?: string
  location: {
    coordinates: {
      coordinates: [number, number]
      type: "Point"
    }
  }
  owner?: {
    id: string
    name: string
    verified?: boolean
  }
  availability?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  _id: string;
  name: string;
}

interface CategoriesResponse {
  data: Category[];
  message: string;
  status: number;
}

export interface Review {
  _id: string
  rating: number
  comment: string
  user: {
    _id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
}

export interface EquipmentDetail {
  _id: string
  name: string
  category: Array<{
    _id: string
    name: string
  }>
  media: string[]
  rating: number
  reviewCount: number
  description: string
  address: string
  location: {
    coordinates: {
      coordinates: [number, number]
      type: "Point"
    }
  }
  pricePerDay: number
  availability: boolean
  user: {
    _id: string
    firstName: string
    lastName: string
    kycVerify: boolean
    avatar: string
    isVerify: boolean
    phone: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

export interface EquipmentDetailResponse {
  status: number
  message: string
  data: {
    equipent: EquipmentDetail // Note: API has typo "equipent" instead of "equipment"
    review: Review[] | null
  }
}

export interface TransformedEquipmentDetail {
  id: string
  title: string
  name: string
  category: string
  categoryId: string
  pricePerDay: number
  rating: number
  reviewCount: number
  imageUrl: string
  media: string[]
  description: string
  address: string
  location: {
    coordinates: {
      coordinates: [number, number]
      type: "Point"
    }
  }
  owner: {
    id: string
    name: string
    firstName: string
    lastName: string
    verified: boolean | null
    avatarUrl: string
    phone: string
  }
  availability: boolean
  reviews: Review[] | null
  createdAt: string
  updatedAt: string
}

export interface AddEquipmentRequest {
  name: string
  description: string
  pricePerDay: number
  category: string
  media: string[]
  address: string
  shipping?: number
  quantity?: number
}

export interface AddEquipmentResponse {
  status: number
  message: string
  data: Equipment
}

export interface UpdateEquipmentRequest {
  name?: string
  description?: string
  pricePerDay?: number
  category?: string
  media?: string[]
  address?: string
  shipping?: number
  quantity?: number
}

export interface UpdateEquipmentResponse {
  message: string
  data: Equipment
}

export interface DeleteEquipmentResponse {
  message: string
}

export interface CreateReviewRequest {
  comment: string
  rating: number
  media?: string[]
}

export interface CreateReviewResponse {
  message: string
  data: Review
}

export interface LikeReviewResponse {
  message: string
  data: object
}

export interface ReviewRepliesResponse {
  status: string
  message: string
  data: {
    replies: Array<{
      _id: string
      comment: string
      rating?: number
      media?: string[]
      user: {
        _id: string
        firstName: string
        lastName: string
        avatarUrl?: string
      }
      createdAt: string
      updatedAt: string
    }>
  }
}

export interface CreateReplyRequest {
  comment: string
  rating?: number
  media?: string[]
}

export interface CreateReplyResponse {
  message: string
  data: object
}

interface BookingRequest {
  startDate: string
  endDate: string
  quantity?: number
  shipping?: boolean
}

interface BookingResponse {
  status: number;
  message: string;
  data: {
    booking: {
      owner: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      customer: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      quantity: number;
      startDate: string; // ISO date string
      endDate: string;   // ISO date string
      payment: boolean;
      dispute: boolean;
      isCompleted: boolean;
      _id: string;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      __v: number;
    };
    paymentInitialization: {
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    };
  };
}

interface ImageUploadResponse {
  message: string;
  data: string[];
}

export interface ReportUserRequest {
  reason: string
}

export interface ReportUserResponse {
  status: number
  message: string
  data: Record<string, unknown>
}


// Create the API slice
export const equipmentApi = baseApi.injectEndpoints({
 
  endpoints: (builder) => ({
    // Get all equipment
    getEquipments: builder.query<
      { equipments: TransformedEquipment[]; totalCount: number },
      EquipmentQueryParams | void
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()

        if (params?.page) searchParams.append("page", params.page.toString())
        if (params?.limit) searchParams.append("limit", params.limit.toString())
        if (params?.categoryId) searchParams.append("categoryId", params.categoryId)
        if (params?.minPrice) searchParams.append("minPrice", params.minPrice.toString())
        if (params?.maxPrice) searchParams.append("maxPrice", params.maxPrice.toString())
        if (params?.search) searchParams.append("search", params.search)
        if (params?.location) searchParams.append("location", params.location)
        if (params?.userId) searchParams.append("userId", params.userId)

        const queryString = searchParams.toString()
        return `equipment${queryString ? `?${queryString}` : ""}`
      },
      providesTags: ["Equipment"],
      transformResponse: (response: EquipmentResponse) => {
        console.log("🔄 Raw API Response:", response)

        const transformedEquipments = response.data.equipments.map((item: Equipment) => ({
          id: item._id,
          title: item.name,
          name: item.name,
          category: item.category[0]?.name || "Uncategorized",
          categoryId: item.category[0]?._id || "",
          pricePerDay: item.pricePerDay || 50000,
          rating: item.rating,
          imageUrl: item.media[0] || "/placeholder.svg",
          media: item.media,
          description: item.description,
          location: item.location,
          owner: item.owner,
          availability: item.availability,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))

        console.log("✅ Transformed Equipment:", transformedEquipments)

        return {
          equipments: transformedEquipments,
          totalCount: response.data.totalCount,
        }
      },
    }),

    // Get single equipment by ID
    getEquipmentById: builder.query<TransformedEquipmentDetail, string>({
      query: (id) => {
        const endpoint = `equipment/${id}`
        console.log("🌐 Making API call for equipment ID:", id)
        console.log("🌐 Full API URL:", `http://13.247.232.234/api/v1/dev/${endpoint}`)
        return endpoint
      },
      providesTags: (result, error, id) => [{ type: "Equipment", id }],
      transformResponse: (response: EquipmentDetailResponse) => {
        console.log("🔄 Equipment Detail Response:", response)

        // Check if response has the expected structure
        if (!response || !response.data || !response.data.equipent) {
          console.error("❌ Invalid response structure:", response)
          throw new Error("Invalid response structure - missing data.equipent")
        }

        const item = response.data.equipent
        console.log("🔄 Equipment detail item from API:", item)

        const transformed: TransformedEquipmentDetail = {
          id: item._id,
          title: item.name,
          name: item.name,
          category: item.category[0]?.name || "Uncategorized",
          categoryId: item.category[0]?._id || "",
          pricePerDay: item.pricePerDay || 50000, 
          rating: item.rating,
          reviewCount: item.reviewCount,
          imageUrl: item.media[0] || "/placeholder.svg",
          media: item.media,
          description: item.description,
          address: item.address,
          location: item.location,
          owner: {
            id: item.user._id,
            name: `${item.user.firstName} ${item.user.lastName}`,
            firstName: item.user.firstName,
            lastName: item.user.lastName,
            verified: item.user.isVerify || null,
            avatarUrl: item.user.avatar,
            phone: item.user.phone
          },
          availability: item.availability,
          reviews: response.data.review,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }

        console.log("✅ Transformed Equipment Detail:", transformed)
        return transformed
      },
      transformErrorResponse: (response: { status: number; data: unknown }) => {
        console.error("❌ API Error Response:", response)
        return response
      },
    }),

    bookEquipment: builder.mutation<BookingResponse, { equipmentId: string; bookingData: BookingRequest }>({
      query: ({ equipmentId, bookingData }) => ({
        url: `equipment/${equipmentId}/book`,
        method: "POST",
        body: bookingData,
      }),
    }),

    // Search equipment
    searchEquipments: builder.query<{ equipments: TransformedEquipment[]; totalCount: number }, string>({
      query: (searchTerm) => `equipment?search=${encodeURIComponent(searchTerm)}`,
      providesTags: ["Equipment"],
      transformResponse: (response: EquipmentResponse) => {
        const transformedEquipments = response.data.equipments.map((item: Equipment) => ({
          id: item._id,
          title: item.name,
          name: item.name,
          category: item.category[0]?.name || "Uncategorized",
          categoryId: item.category[0]?._id || "",
          pricePerDay: item.pricePerDay || 50000,
          rating: item.rating,
          imageUrl: item.media[0] || "/placeholder.svg",
          media: item.media,
          description: item.description,
          location: item.location,
          owner: item.owner,
          availability: item.availability,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))

        return {
          equipments: transformedEquipments,
          totalCount: response.data.totalCount,
        }
      },
    }),

    // Get equipment by category
    getEquipmentsByCategoryId: builder.query<{ equipments: TransformedEquipment[]; totalCount: number }, string>({
      query: (categoryId) => `equipment?categoryId=${encodeURIComponent(categoryId)}`,
      providesTags: ["Equipment"],
      transformResponse: (response: EquipmentResponse) => {
        const transformedEquipments = response.data.equipments.map((item: Equipment) => ({
          id: item._id,
          title: item.name,
          name: item.name,
          category: item.category[0]?.name || "Uncategorized",
          categoryId: item.category[0]?._id || "",
          pricePerDay: item.pricePerDay || 50000,
          rating: item.rating,
          imageUrl: item.media[0] || "/placeholder.svg",
          media: item.media,
          description: item.description,
          location: item.location,
          owner: item.owner,
          availability: item.availability,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))

        return {
          equipments: transformedEquipments,
          totalCount: response.data.totalCount,
        }
      },
    }),
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "equipment/category",
      providesTags: ["Equipment"],
    }),
    createCategory: builder.mutation<{ status: number; message: string; data: Category }, { name: string }>({
      query: (body) => ({
        url: "equipment/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Equipment"],
    }),

    deleteCategory: builder.mutation<{ status: number; message: string }, string>({
      query: (categoryId) => ({
        url: `equipment/category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Equipment"],
    }),

    addEquipment: builder.mutation<AddEquipmentResponse, AddEquipmentRequest>({
      query: (body) => ({
        url: "equipment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Equipment"],
    }),
    uploadEquipmentImages: builder.mutation<ImageUploadResponse, File[]>({
      query: (files) => {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append("image", file)   
        })

        return {
          url: "/media/upload/image",
          method: "POST",
          body: formData,
        };
      },
    }),
    createEquipmentReview: builder.mutation<CreateReviewResponse, { equipmentId: string; review: CreateReviewRequest }>(
      {
        query: ({ equipmentId, review }) => ({
          url: `equipment/${equipmentId}/reviews`,
          method: "POST",
          body: review,
        }),
        invalidatesTags: (result, error, { equipmentId }) => [{ type: "Equipment", id: equipmentId }, "Equipment"],
      },
    ),

    // Get equipment reviews
    getEquipmentReviews: builder.query<{ reviews: Review[]; totalCount: number }, string>({
      query: (equipmentId) => `equipment/${equipmentId}/reviews`,
      providesTags: (result, error, equipmentId) => [{ type: "Equipment", id: equipmentId }, "Equipment"],
      transformResponse: (response: {
        status: string
        message: string
        data: { reviews: Review[]; totalCount: number }
      }) => {
        return response.data
      },
    }),

    // Like a review
    likeReview: builder.mutation<LikeReviewResponse, string>({
      query: (reviewId) => ({
        url: `equipment/reviews/${reviewId}`,
        method: "POST",
      }),
      invalidatesTags: ["Equipment"],
    }),

    // Get review replies
    getReviewReplies: builder.query<ReviewRepliesResponse["data"], string>({
      query: (reviewId) => `equipment/reviews/${reviewId}`,
      providesTags: (result, error, reviewId) => [{ type: "Review", id: reviewId }],
    }),

    // Create reply to review
    createReviewReply: builder.mutation<
      CreateReplyResponse,
      { equipmentId: string; reviewId: string; reply: CreateReplyRequest }
    >({
      query: ({ equipmentId, reviewId, reply }) => ({
        url: `equipment/${equipmentId}/reviews/${reviewId}`,
        method: "POST",
        body: reply,
      }),
      invalidatesTags: (result, error, { reviewId, equipmentId }) => [
        { type: "Review", id: reviewId },
        { type: "Equipment", id: equipmentId },
        "Equipment",
      ],
    }),

    updateEquipment: builder.mutation<UpdateEquipmentResponse, { id: string; data: UpdateEquipmentRequest }>({
      query: ({ id, data }) => ({
        url: `equipment/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Equipment", id }, "Equipment"],
    }),

    // Delete equipment mutation
    deleteEquipment: builder.mutation<DeleteEquipmentResponse, string>({
      query: (id) => ({
        url: `equipment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Equipment", id }, "Equipment"],
    }),

    bookmarkEquipment: builder.mutation<
      { status: number; message: string; data: { equipmentId: string; bookmarked: boolean } },
      string
    >({
      query: (equipmentId) => ({
        url: `equipment/${equipmentId}/bookmark`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmarks"],
    }),

    removeBookmarkEquipment: builder.mutation<
      { status: number; message: string; data: { equipmentId: string; bookmarked: boolean } },
      string
    >({
      query: (equipmentId) => ({
        url: `equipment/${equipmentId}/bookmark`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),

    getBookmarkedEquipments: builder.query<
      {
        status: string
        message: string
        data: {
          bookmarks: Equipment[]
          pagination: {
            currentPage: number
            totalPages: number
            totalItems: number
            itemsPerPage: number
            hasNextPage: boolean
            hasPrevPage: boolean
          }
        }
      },
      { page?: number; limit?: number } | void
    >({
      query: (params = {}) => {
        const query = new URLSearchParams()
        const p = params ?? {}
        if (p.page) query.append("page", p.page.toString())
        if (p.limit) query.append("limit", p.limit.toString())
        return `equipment/bookmarks${query.toString() ? `?${query.toString()}` : ""}`
      },
      providesTags: ["Bookmarks"],
    }),

    reportUser: builder.mutation<
      ReportUserResponse,
      { equipmentId: string; reportedId: string; report: ReportUserRequest }
    >({
      query: ({ equipmentId, reportedId, report }) => ({
        url: `equipment/${equipmentId}/report/${reportedId}`,
        method: "POST",
        body: report,
      }),
    }),

    getAddressSuggestions: builder.query<{ data: string[]; message: string; status: string }, string>({
      query: (address) => ({
        url: `equipment/autocomplete/address?address=${encodeURIComponent(address)}`,
        method: "GET",
      }),
    }),

  }),
})

// Export hooks for usage in functional components
export const {
  useGetEquipmentsQuery,
  useGetEquipmentByIdQuery,
  useSearchEquipmentsQuery,
  useAddEquipmentMutation,
  useUploadEquipmentImagesMutation,
  useGetEquipmentsByCategoryIdQuery,
  useGetCategoriesQuery,
  useLazyGetEquipmentsQuery,
  useLazySearchEquipmentsQuery,
  useCreateEquipmentReviewMutation,
  useGetEquipmentReviewsQuery,
  useLikeReviewMutation,
  useGetReviewRepliesQuery,
  useCreateReviewReplyMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
  useBookEquipmentMutation,
  useReportUserMutation,
  useGetAddressSuggestionsQuery,
  useBookmarkEquipmentMutation,
  useRemoveBookmarkEquipmentMutation,
  useGetBookmarkedEquipmentsQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = equipmentApi
