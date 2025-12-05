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
      invalidatesTags: (result, error, cancellationData) => [
        "Cancellation",
        { type: "Cancellation", id: cancellationData.taskId }
      ],
    }),
    getCancellationRequestByTask: builder.query({
      query: (taskId) => ({
        url: `/cancel-request/byTask/${taskId}`,
        method: "GET",
      }),
      providesTags: (result, error, taskId) => [
        "Cancellation",
        { type: "Cancellation", id: taskId }
      ],
    }),
    deleteCancellationRequest: builder.mutation({
      query: (id) => ({
        url: `/cancel-request/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Cancellation",
        { type: "Cancellation", id: "LIST" }
      ],
    }),
    acceptCancellationRequest: builder.mutation({
      query: (id) => ({
        url: `/cancel-request/${id}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        "Cancellation",
        { type: "Cancellation", id: "LIST" }
      ],
    }),
    rejectCancellationRequest: builder.mutation({
      query: ({ id, reason, evidence }) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify({
          status: "REJECTED",
          rejectDetails: reason
        }));
        if (evidence && evidence.length > 0) {
          Array.from(evidence).forEach((file) => {
            formData.append('reject_evidence', file);
          });
        }
        return {
          url: `/cancel-request/accept-reject/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, args) => [
        "Cancellation",
        { type: "Cancellation", id: "LIST" }
      ],
    }),
  }),
});

export const {
  useCreateCancellationRequestMutation,
  useGetCancellationRequestByTaskQuery,
  useDeleteCancellationRequestMutation,
  useAcceptCancellationRequestMutation,
  useRejectCancellationRequestMutation
} = cancellationApi;

export default cancellationApi;