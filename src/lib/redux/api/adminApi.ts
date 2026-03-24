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
    raw: {
      equipment: { _id: { year: number; month: number }; count: number }[]
      bookings: { _id: { year: number; month: number }; count: number }[]
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
    name?: string
    description?: string
    pricePerDay?: number
    media?: string[]
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

export interface ReportBankAccount {
  _id: string
  bankName: string
  accountNumber: string
  accountName?: string
  bank: string
  default: boolean
}

export interface GetReportByIdResponse {
  message: string
  data: {
    report: Report
    bank: ReportBankAccount[]
  }
}

export interface ApiMessageResponse {
  message: string
}

export interface PlatformSettings {
  _id: string
  singletonKey: string
  platformName: string
  supportEmail: string
  defaultCurrency: string
  logoUrl: string
  cardPaymentEnabled: boolean
  transferEnabled: boolean
  adminCommissionPercentage: number
  lastUpdatedBy: string
  createdAt: string
  updatedAt: string
}

export interface GetPlatformSettingsResponse {
  message: string
  data: PlatformSettings
}

export interface UpdateGeneralSettingsPayload {
  platformName?: string
  supportEmail?: string
  defaultCurrency?: string
  logoUrl?: string
  cardPaymentEnabled?: boolean
  transferEnabled?: boolean
}

export interface UpdateGeneralSettingsResponse {
  message: string
  data: PlatformSettings
}

export interface UserTransaction {
  _id: string;
  type?: string;
  totalPaid: number;
  paidCustomer?: number;
  ref: string;
  status: string;
  text?: string;
  isCredit?: boolean;
  transactionStatus?: string;
  isCompleted: boolean;
  time?: string;
  createdAt: string;
  booking?: {
    _id: string;
    equipment?: {
      _id: string;
      name: string;
    };
  };
}

export interface UserBank {
  accountNumber: string;
  accountName?: string; 
  bank: string;
  bankName: string
}

export interface RentedEquipmentItem {
  _id: string;
  isCompleted: boolean;
  equipment: {
    _id?: string;
    name?: string;
    media?: { url: string }[];
    pricePerDay?: number;
    category?: string;
  };
}

export interface GetRentedEquipmentResponse {
  message: string;
  data: RentedEquipmentItem[];
}

export interface AdminUser {
  _id: string
  fullName: string
  email: string
  roleName: string
  createdAt: string
}

export interface NewAdminRequest {
  fullName: string
  email: string
  password: string
  role: string
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
    getPlatformSettings: builder.query<GetPlatformSettingsResponse, void>({
      query: () => "/admin/settings",
    }),

    updateGeneralSettings: builder.mutation<UpdateGeneralSettingsResponse, UpdateGeneralSettingsPayload>({
      query: (payload) => ({
        url: "/admin/settings/general",
        method: "PATCH",
        body: payload,
      }),
    }),
    updatePaymentSettings: builder.mutation<
      { message: string; data: { _id: string; adminCommissionPercentage: number; updatedAt: string } },
      { adminCommissionPercentage: number }
    >({
      query: (body) => ({
        url: "/admin/settings/payment",
        method: "PATCH",
        body,
      }),
    }),
    unsuspendUser: builder.mutation<{ message: string; data: { _id: string; isSuspended: boolean } }, string>({
      query: (userId) => ({
        url: `/admin/user/unsuspend/${userId}`,
        method: "GET",
      }),
    }),
    getUserBanks: builder.query<{ message: string; data: UserBank[] }, string>({
      query: (userId) => `/admin/user/banks/${userId}`,
    }),
    getUserTransactions: builder.query<{ message: string; data: { history: UserTransaction[]; total: number; page: number; limit: number } }, { userId: string; page?: number; limit?: number; type?: string; startDate?: string; endDate?: string }>({
      query: ({ userId, page = 1, limit = 10, type, startDate, endDate }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (type) params.append("type", type);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return `/admin/user/transactions/${userId}?${params.toString()}`;
      },
    }),
    getAdmins: builder.query<{ message: string; data: { admins: AdminUser[]; total: number } }, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("limit", limit.toString())
        if (search) params.append("search", search)
        return `/admin/user/admins?${params.toString()}`
      },
    }),
    createAdmin: builder.mutation<{ message: string; data: object }, NewAdminRequest>({
      query: (body) => ({
        url: "/admin/user/admins",
        method: "POST",
        body,
      }),
    }),
    getRentedEquipment: builder.query<GetRentedEquipmentResponse, string>({
      query: (userId) => `/admin/user/rented-equipment/${userId}`,
    }),
    getUserWallet: builder.query<{ message: string; data: { wallet: { total: number; available: number }; history: UserTransaction[] } }, string>({
      query: (userId) => `/admin/user/wallet/${userId}`,
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
    useGetPlatformSettingsQuery,
    useUpdateGeneralSettingsMutation,
    useUpdatePaymentSettingsMutation,
    useUnsuspendUserMutation, 
    useGetUserBanksQuery, 
    useGetUserTransactionsQuery,
    useGetAdminsQuery,
    useCreateAdminMutation,
    useGetRentedEquipmentQuery,
    useGetUserWalletQuery,
} = adminApi
