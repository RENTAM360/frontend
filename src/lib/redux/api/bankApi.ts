import { baseApi } from "./baseApi"

export interface Bank {
  id: number
  name: string
  slug: string
  code: string
  longcode?: string
}

export interface GetBanksResponse {
  status: boolean
  message: string
  data: {
    status: boolean
    data: Bank[]
  }
}

export interface ResolveBankRequest {
  bank: string
  accountNumber: string
  bankName: string
}

export interface ResolveBankResponse {
  status: number,
    message: string
    data: {
        account_number: string,
        account_name: string,
        bank_id: number
    }
}

export interface AddBankRequest {
  bank: string
  accountNumber: string
  bankName: string
}

export interface AddBankResponse {
    message: string
    data: {
        bank: string
        accountNumber: string
    }
}

export interface VerifyNinRequest {
  nin: string
}

export interface VerifyBvnRequest {
  bvn: string
}

export interface VerifyNinResponse {
  status: number
  message: string
  data: {
    message: string
    kycStatus: boolean
    data: Record<string, unknown>
  }
}

export const bankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanks: builder.query<GetBanksResponse, void>({
      query: () => "/profile/banks",
    }),

    resolveBank: builder.mutation<ResolveBankResponse, ResolveBankRequest>({
      query: (body) => ({
        url: "/profile/resolve-bank",
        method: "POST",
        body,
      }),
    }),

    addBank: builder.mutation<AddBankResponse, AddBankRequest>({
      query: (body) => ({
        url: "/profile/add-bank",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),

    verifyNin: builder.mutation<VerifyNinResponse, VerifyNinRequest>({
      query: (body) => ({
        url: "/profile/verify-nin",
        method: "POST",
        body,
      }),
    }),
    verifyBvn: builder.mutation<VerifyNinResponse, VerifyBvnRequest>({
      query: (body) => ({
        url: "/profile/verify-bvn",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const {
  useGetBanksQuery,
  useResolveBankMutation,
  useAddBankMutation,
  useVerifyNinMutation,
  useVerifyBvnMutation,
} = bankApi
