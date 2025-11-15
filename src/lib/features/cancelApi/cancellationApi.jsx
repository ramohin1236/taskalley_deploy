import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const cancellationApi = createApi({
  reducerPath: "cancellationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cancellation"],
  endpoints: (builder) => ({
    createCancellationRequest: builder.mutation({
      query: (cancellationData) => {
        const formData = new FormData();
    
        formData.append('data', JSON.stringify({
          task: cancellationData.taskId,
          reason: cancellationData.reason,
          description: cancellationData.description
        }));

        if (cancellationData.evidence) {
          formData.append('reject_evidence', cancellationData.evidence);
        }

        return {
          url: "/cancel-request/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Cancellation"],
    }),
     getCancellationRequestByTask: builder.query({
      query: (taskId) => ({
        url: `/cancel-request/byTask/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Cancellation"],
    }),
  }),
});

export const {
  useCreateCancellationRequestMutation,
  useGetCancellationRequestByTaskQuery
} = cancellationApi;

export default cancellationApi;