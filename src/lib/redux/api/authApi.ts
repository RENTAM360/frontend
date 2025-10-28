import { BusinessRegisterRequest, BusinessRegisterResponse } from "../types/auth"
import { baseApi } from "./baseApi"
import { Feedback } from "./feedbackApi"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  gender: string
  dob: string
}

export interface ForgotPasswordCredentials {
  email: string
}

export interface ResetPasswordCredentials {
  code: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
  data: string
}

interface ForgotPasswordResponse {
  message: string;
}

interface Role {
  name: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  dob: string
  gender: string
  email: string
  feedbacks: Feedback[]
  phone: string
  address: string
  country: string
  role: Role
  isVerify: boolean
  isBvnVerify: boolean
  isNinVerify: boolean
  _id: string
  bio: string
  message: string
  account: boolean
  avatar: string
  coverPhoto: string
  createdAt: string
}

export interface OtherUserProfile {
  firstName: string
  lastName: string
  dob: string
  gender: string
  phone: string
  email: string
  avatar: string
  address: string
  isVerify: boolean
  resetCode: string
  resetTokenTime: string
  role: Role
  isNinVerify: boolean
  isBvnVerify: boolean
  kycVerify: boolean
  rating: number
  account: boolean
  bio: string
  preference: string
  accountType: "personal" | "business"
  businessName?: string
  businessAddress?: string
  cacNumber?: string
  businessType?: string
  status: "active" | "inactive" | "suspended"
  createdAt: string
  coverPhoto: string
  feedbacks: Feedback[]
  message: string
  country: string
  _id: string
}

// interface BusinessStaff {
//   firstName: string
//   lastName: string
//   gender: string
//   email: string
// }

// interface BusinessOwner {
//   firstName: string
//   lastName: string
//   gender: string
//   email: string
// }

// interface Business {
//   email: string
//   phone: string
//   name: string
//   address: string
//   staff: BusinessStaff[]
//   owner: BusinessOwner
// }

export interface ProfileResponse {
  data: {
    user: UserProfile | OtherUserProfile
  }
  account: {
    bankName: string
    accountNumber: string
  }
} 

// Request type for updating user profile
export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  dob: string
  gender: string
}

// Response type from profile update
export interface UpdateProfileResponse {
  status: number
  message: string
  data: {
    user: {
      firstName: string
      lastName: string
      dob: string
      gender: string
      email: string
      phone: string
      role: {
        name: string
      }
    }
  }
}

interface ImageUploadResponse {
  message: string;
  data: string[];
}

interface ResendEmailRequest {
  email: string
}

interface ResendEmailResponse {
  message: string
}

 interface userProfile {
  data: {
    user: OtherUserProfile
    account: {
      bankName: string
      accountNumber: string
    }
  }
 }

export interface UpdatePhoneRequest {
  phone: string
}

export interface VerifyPhoneRequest {
  code: string
}

export interface PhoneUpdateResponse {
  status: number
  message: string
  data: {
    message: string
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: "/auth/signup-web",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    uploadImage: builder.mutation<ImageUploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: "/media/upload/image",
          method: "POST",
          body: formData,
        };
      },
    }),

    registerBusiness: builder.mutation<
      BusinessRegisterResponse,
      BusinessRegisterRequest
    >({
      query: (body) => ({
        url: "/auth/business",
        method: "POST",
        body,
      }),
    }),

    resendSignupEmail: builder.mutation<ResendEmailResponse, ResendEmailRequest>({
      query: (data) => ({
        url: "/auth/signup-resend-email",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordCredentials>({
      query: (data) => ({
        url: "/auth/forget-password-web",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordCredentials>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "profile/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAccount: builder.mutation<{ status: number; message: string }, string>({
      query: (userId) => ({
        url: `/profile/user/me?userId=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    getOtherUserProfile: builder.query<userProfile, string>({
      query: (userId) => `/profile/user/${userId}`,
      providesTags: ["User"],
    }),

    updatePhone: builder.mutation<PhoneUpdateResponse, UpdatePhoneRequest>({
      query: (body) => ({
        url: "/profile/phone",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    verifyPhone: builder.mutation<PhoneUpdateResponse, VerifyPhoneRequest>({
      query: (body) => ({
        url: "/profile/verify-phone",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    googleLogin: builder.query<{ url: string }, void>({
      query: () => ({
        url: "/auth/google",
        method: "GET",
      }),
    }),
  }),
})

export const { 
  useLoginMutation, 
  useRegisterMutation,
  useUploadImageMutation, 
  useRegisterBusinessMutation, 
  useGetProfileQuery, 
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation, 
  useResendSignupEmailMutation,
  useUpdateProfileMutation,
  useGetOtherUserProfileQuery, 
  useUpdatePhoneMutation,
  useVerifyPhoneMutation, 
  useGoogleLoginQuery,
  useLazyGoogleLoginQuery,
  useDeleteAccountMutation,
} = authApi
