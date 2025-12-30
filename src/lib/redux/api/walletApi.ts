import { baseApi } from "./baseApi";

export interface WalletSummary {
  total: number;
  available: number;
}

export interface WalletTransaction {
  _id: string;
  user: string;
  status: string;
  amount: number;
  time: string;
  text: string;
  isCredit: boolean;
  totalPaid: number;
  ref: string;
  isCompleted: boolean;
  transactionStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  booking?: Booking;
  meta?: TransactionMeta;
}

export interface WalletSummaryResponse {
  status: number;
  message: string;
  data: WalletSummary;
}

export interface Equipment {
  _id: string;
  name: string;
}

export interface Booking {
  _id: string;
  equipment: Equipment;
}

export interface TransactionMeta {
  bookingId: string;
  equipmentId: string;
  paymentMethod: string;
  escrowEnabled: string;
  referrer: string;
}

export interface WalletHistoryResponse {
  status: number;
  message: string;
  data: WalletTransaction[];
}

export interface BankAccount {
  accountNumber: string;
  bank: string;
  bankName: string;
  default: boolean;
  _id?: string;
}

export interface BankAccountsResponse {
  status: number;
  message: string;
  data: BankAccount[];
}

export interface WithdrawRequest {
  amount: number;
  accountId: string;
}

export interface WithdrawResponse {
  message: string;
  data: {
    _id: string;
    transactionStatus: string;
    totalPaid: number;
    status: string;
  };
}

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get wallet summary
    getWalletSummary: builder.query<WalletSummaryResponse, void>({
      query: () => "/wallet",
      providesTags: ["Wallet"],
    }),

    // Get wallet transaction history
    getWalletHistory: builder.query<
      WalletHistoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/wallet/history",
        params: { page, limit },
      }),
      providesTags: ["Wallet"],
    }),

    // Get bank accounts
    getWalletAccounts: builder.query<BankAccountsResponse, void>({
      query: () => "/wallet/accounts",
      providesTags: ["Wallet"],
    }),

    // Initiate withdrawal
    withdraw: builder.mutation<WithdrawResponse, WithdrawRequest>({
      query: (body) => ({
        url: "/wallet/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletSummaryQuery,
  useGetWalletHistoryQuery,
  useGetWalletAccountsQuery,
  useWithdrawMutation,
} = walletApi;
