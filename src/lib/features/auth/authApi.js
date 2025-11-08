import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";
import { getTokens, storeTokens, removeTokens } from "@/utils/auth";
import {
  setCredentials,
  logout,
  updateAddressStatus,
} from "@/lib/features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl()}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const accessToken = state?.auth?.accessToken || getTokens().accessToken;
    if (accessToken) {
      headers.set("Authorization", `${accessToken}`);
    }
    return headers;
  },
});
const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const cookieRefreshToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];

    const { refreshToken: storedRefreshToken } = getTokens();
    const refreshToken = cookieRefreshToken || storedRefreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    try {
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (
        refreshResult.data?.success &&
        refreshResult.data?.data?.accessToken
      ) {
        const newAccessToken = refreshResult.data.data.accessToken;

        storeTokens(newAccessToken, refreshToken);
        api.dispatch(
          setCredentials({
            accessToken: newAccessToken,
            refreshToken,
          })
        );

        result = await rawBaseQuery(args, api, extraOptions);
        return result;
      }

      if (refreshResult.error) {
        console.error("Token refresh response error:", refreshResult.error);
        return result;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      return result;
    }

    if (!refreshToken) {
      removeTokens();
      api.dispatch(logout());

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/user/sign-up",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, isAddressProvided } = data.data;

          dispatch(
            setCredentials({ accessToken, refreshToken, isAddressProvided })
          );

          storeTokens(accessToken, refreshToken);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "isAddressProvided",
              isAddressProvided ? "true" : "false"
            );
          }

          const cookieOptions = [
            `refreshToken=${refreshToken}`,
            "path=/",
            "max-age=2592000",
            "SameSite=Lax",
            process.env.NODE_ENV === "production" ? "Secure" : "",
          ]
            .filter(Boolean)
            .join("; ");
          document.cookie = cookieOptions;

          if (typeof window !== "undefined") {
            if (isAddressProvided) {
              window.location.href = "/";
            } else {
              window.location.href = "/verify";
            }
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),
   updateProfile: builder.mutation({
  query: (formData) => ({
    url: "/user/update-profile",
    method: "PATCH",
    body: formData,
  }),
  async onQueryStarted(args, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      if (data?.success) {
        dispatch(updateAddressStatus(true));
        if (typeof window !== "undefined") {
          localStorage.setItem("isAddressProvided", "true");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  invalidatesTags: ["Auth"],
}),
    forgetPassword: builder.mutation({
      query: (phoneData) => ({
        url: "/auth/forget-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: phoneData,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyResetOtp: builder.mutation({
      query: (otpData) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: otpData,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyUserCode: builder.mutation({
      query: (verificationData) => ({
        url: "/user/verify-code",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: verificationData,
      }),
      invalidatesTags: ["Auth"],
    }),
    // get single customer
    getMyProfile: builder.query({
      query: () => ({
        url: "/user/get-my-profile",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginUserMutation,
  useUpdateProfileMutation,
  useForgetPasswordMutation,
  useVerifyResetOtpMutation,
  useVerifyUserCodeMutation,
  useGetMyProfileQuery
} = authApi;
export default authApi;
