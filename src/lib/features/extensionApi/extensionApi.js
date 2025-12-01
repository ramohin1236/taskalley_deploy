// extensionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";
import { getTokens } from "@/utils/auth";

const extensionApi = createApi({
  reducerPath: "extensionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
      } else {
        console.log("No access token found");
      }
      return headers;
    },
  }),
  tagTypes: ["Extension"],
  endpoints: (builder) => ({
    createExtensionRequest: builder.mutation({
      query: (extensionData) => ({
        url: "/extension-request/create",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: extensionData,
      }),
      invalidatesTags: ["Extension"],
    }),

    getExtensionRequestsByTaskId: builder.query({
      query: (taskId) => ({
        url: `/extension-request/task/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Extension"],
    }),

    updateExtensionStatus: builder.mutation({
      query: ({ requestId, status, extensionReason = "", rejectDetails = "" }) => ({
        url: `/extension-request/update/${requestId}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: { status, extensionReason, rejectDetails },
      }),
      invalidatesTags: ["Extension"],
    }),
  }),
});

export const {
  useCreateExtensionRequestMutation,
  useGetExtensionRequestsByTaskIdQuery,
  useUpdateExtensionStatusMutation,
} = extensionApi;

export default extensionApi;