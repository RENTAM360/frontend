import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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
  price?: number
  description?: string
  location?: string
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
}

// Transformed equipment interface for components (to maintain compatibility)
export interface TransformedEquipment {
  id: string
  title: string
  name: string
  category: string
  categoryId: string
  price: number
  rating: number
  imageUrl: string
  media: string[]
  description?: string
  location?: string
  owner?: {
    id: string
    name: string
    verified?: boolean
  }
  availability?: boolean
  createdAt?: string
  updatedAt?: string
}

// Create the API slice
export const equipmentApi = createApi({
  reducerPath: "equipmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://13.247.232.234/api/v1/dev/",
    prepareHeaders: (headers) => {
      // Add any auth headers if needed { getState }
      // const token = (getState() as RootState).auth.token
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`)
      // }
      headers.set("Content-Type", "application/json")
      headers.set("Accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["Equipment"],
  endpoints: (builder) => ({
    // Get all equipment
    getEquipments: builder.query<
      { equipments: TransformedEquipment[]; totalCount: number },
      EquipmentQueryParams | void
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()

        if (params.page) searchParams.append("page", params.page.toString())
        if (params.limit) searchParams.append("limit", params.limit.toString())
        if (params.categoryId) searchParams.append("categoryId", params.categoryId)
        if (params.minPrice) searchParams.append("minPrice", params.minPrice.toString())
        if (params.maxPrice) searchParams.append("maxPrice", params.maxPrice.toString())
        if (params.search) searchParams.append("search", params.search)
        if (params.location) searchParams.append("location", params.location)

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
          price: item.price || 50000, // Default price since it's missing from API
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
    getEquipmentById: builder.query<TransformedEquipment, string>({
      query: (id) => `equipment/${id}`,
      providesTags: (result, error, id) => [{ type: "Equipment", id }],
      transformResponse: (response: { status: number; message: string; data: Equipment }) => {
        const item = response.data
        return {
          id: item._id,
          title: item.name,
          name: item.name,
          category: item.category[0]?.name || "Uncategorized",
          categoryId: item.category[0]?._id || "",
          price: item.price || 50000,
          rating: item.rating,
          imageUrl: item.media[0] || "/placeholder.svg",
          media: item.media,
          description: item.description,
          location: item.location,
          owner: item.owner,
          availability: item.availability,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }
      },
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
          price: item.price || 50000,
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
          price: item.price || 50000,
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
     getCategories: builder.query<Array<{ _id: string; name: string }>, void>({
      query: () => "equipment/category",
      providesTags: ["Equipment"],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetEquipmentsQuery,
  useGetEquipmentByIdQuery,
  useSearchEquipmentsQuery,
  useGetEquipmentsByCategoryIdQuery,
  useGetCategoriesQuery,
  useLazyGetEquipmentsQuery,
  useLazySearchEquipmentsQuery,
} = equipmentApi
