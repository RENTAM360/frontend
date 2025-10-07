import { baseApi } from "./baseApi"

export interface DashboardStats {
  thisMonth: number
  lastMonth: number
  compare: number
}

export interface GetAdminDashboardResponse {
  message: string
  data: {
    totalMoney: DashboardStats
    totalPending: DashboardStats
    totalCompleted: DashboardStats
    totalItems: DashboardStats
    activeItems: DashboardStats
    completed: DashboardStats
    users: DashboardStats
    reports: DashboardStats
  }
}

export interface GetAdminTotalUsersResponse {
  message: string
  data: DashboardStats
}

export interface GetAdminUserChartResponse {
  message: string
  data: {
    labels: string[]
    data: number[]
    chartData: { month: string; count: number }[]
  }
}

export interface GetAdminEquipmentChartResponse {
  message: string
  data: {
    labels: string[]
    datasets: { label: string; data: number[] }[]
    meta: {
      xAxisLabel: string
      yAxisLabel: string
      legend: string[]
    }
  }
}

export interface GetAdminActiveStatusResponse {
  message: string
  data: {
    active: DashboardStats
    inActive: DashboardStats
  }
}

export interface GetAdminSuspendedUsersResponse {
  message: string
  data: DashboardStats
}

export interface User {
  _id: string
  email: string
  createdAt: string
  status: string
  phone: string
  firstName: string
  lastName: string
  roleName: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface GetAdminUsersResponse {
  message: string
  data: {
    total: number
    users: User[]
  }
  meta: PaginationMeta
}

export interface ReportUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  roleName: string
  status: string
}

export interface Report {
  _id: string
  reporter: ReportUser
  reported: ReportUser
  reason: string
  equipment: {
    _id: string
    title?: string
    description?: string
  }
  status?: "pending" | "resolved"
  createdAt: string
}

export interface GetReportsResponse {
  message: string
  data: {
    reports: Report[]
    total: number
  }
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

export interface GetReportByIdResponse {
  message: string
  data: {
    report: Report
    bank: []
  }
}

export interface ApiMessageResponse {
  message: string
}



export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<GetAdminDashboardResponse, void>({
      query: () => "/admin/user/dashboard",
    }),
    getAdminTotalUsers: builder.query<GetAdminTotalUsersResponse, void>({
      query: () => "/admin/user/total",
    }),
    getAdminUserChart: builder.query<GetAdminUserChartResponse, void>({
      query: () => "/admin/user/chart",
    }),
    getAdminEquipmentChart: builder.query<GetAdminEquipmentChartResponse, void>({
      query: () => "/admin/user/equipment/chart",
    }),
    getAdminActiveStatus: builder.query<GetAdminActiveStatusResponse, void>({
      query: () => "/admin/user/active-status",
    }),

    getAdminSuspendedUsers: builder.query<GetAdminSuspendedUsersResponse, void>({
      query: () => "/admin/user/suspended",
    }),

    getAdminUsers: builder.query<
      GetAdminUsersResponse,
      { filter?: string; page?: number; limit?: number; search?: string }
    >({
      query: ({ filter, page = 1, limit = 10, search }) => {
        const params = new URLSearchParams()
        if (filter) params.append("filter", filter)
        if (page) params.append("page", String(page))
        if (limit) params.append("limit", String(limit))
        if (search) params.append("search", search)

        return `/admin/user?${params.toString()}`
      },
    }),
    getReports: builder.query<GetReportsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/admin/report/reports?page=${page}&limit=${limit}`,
    }),
    getReportById: builder.query<GetReportByIdResponse, string>({
      query: (reportId) => `/admin/report/${reportId}`,
    }),
    resolveReport: builder.mutation<GetReportByIdResponse, string>({
      query: (reportId) => ({
        url: `/admin/report/resolve/${reportId}`,
        method: "GET",
      }),
    }),
    suspendUser: builder.mutation<ApiMessageResponse, string>({
      query: (userId) => ({
        url: `/admin/user/suspend/${userId}`,
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation<ApiMessageResponse, string>({
      query: (userId) => ({
        url: `/admin/user/delete/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
    useGetAdminDashboardQuery,
    useGetAdminTotalUsersQuery,
    useGetAdminUserChartQuery,
    useGetAdminEquipmentChartQuery,
    useGetAdminActiveStatusQuery,
    useGetAdminSuspendedUsersQuery,
    useGetAdminUsersQuery,
    useGetReportsQuery,
    useGetReportByIdQuery,
    useResolveReportMutation,
    useSuspendUserMutation,
    useDeleteUserMutation,
} = adminApi
