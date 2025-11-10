import { baseApi } from './baseApi';

export interface TransactionMetric {
  thisMonth: number;
  lastMonth: number;
  compare: number;
}

export interface TransactionOverviewData {
  total: TransactionMetric;
  completed: TransactionMetric;
  pending: TransactionMetric;
  declined: TransactionMetric;
}

export interface TransactionOverviewResponse {
  message: string;
  data: TransactionOverviewData;
}

export interface TransactionItem {
  _id: string;
  status: string;
  transactionStatus: string;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
  userEmail: string;
  userAvatar: string;
  userName: string;
}

export interface TransactionListData {
  history: TransactionItem[];
  total: number;
  page: number;
  limit: number;
  status: string;
}

export interface TransactionListResponse {
  message: string;
  data: TransactionListData;
}

export interface TransactionDetailResponse {
  message: string;
  data: Record<string, unknown>; 
}

export interface WithdrawalActionRequest {
  transactionId: string;
  action: 'completed' | 'declined';
}

export interface WithdrawalActionResponse {
  message: string;
  data: Record<string, unknown>;
}


export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionOverview: builder.query<TransactionOverviewResponse, void>({
      query: () => ({
        url: '/admin/transaction/overview',
        method: 'GET',
      }),
      providesTags: ['Transactions'],
    }),

    getTransactions: builder.query<
      TransactionListResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        startDate?: string;
        endDate?: string;
        sort?: string;
        amountFilter?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        status,
        startDate,
        endDate,
        sort,
        amountFilter,
      }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', String(page));
        if (limit) params.append('limit', String(limit));
        if (status) params.append('status', status);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (sort) params.append('sort', sort);
        if (amountFilter) params.append('amountFilter', amountFilter);

        return {
          url: `/admin/transaction/list?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result?.data?.history
          ? [
              ...result.data.history.map((t) => ({
                type: 'Transaction' as const,
                id: t._id,
              })),
              { type: 'Transactions', id: 'LIST' },
            ]
          : [{ type: 'Transactions', id: 'LIST' }],
    }),

    getTransactionById: builder.query<TransactionDetailResponse, string>({
      query: (transactionId) => ({
        url: `/admin/transaction/${transactionId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Transaction', id }],
    }),

    actOnWithdrawal: builder.mutation<
      WithdrawalActionResponse,
      WithdrawalActionRequest
    >({
      query: ({ transactionId, action }) => ({
        url: `/admin/transaction/withdraw/${transactionId}`,
        method: 'PATCH',
        body: { action },
      }),
      invalidatesTags: (_result, _error, { transactionId }) => [
        { type: 'Transaction', id: transactionId },
        { type: 'Transactions', id: 'LIST' },
      ],
    }),
  }),

  overrideExisting: false,
});


export const {
  useGetTransactionOverviewQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useActOnWithdrawalMutation,
} = transactionsApi;
