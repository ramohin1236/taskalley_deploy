import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const bidApi = createApi({
  reducerPath: "bidApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        // Backend expects token without "Bearer " prefix
        headers.set("Authorization", `${accessToken}`);
      }else {
        console.log(" No access token found");
      }
      return headers;
    },
  }),
  tagTypes: ["Bid"],
  endpoints: (builder) => ({
    createBid: builder.mutation({
      query: (bidData) => ({
        url: "/bid/create-bid",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bidData,
      }),
      invalidatesTags: ["Bid"],
    }),

    // getTaskBids: builder.query({
    //   query: (taskId) => ({
    //     url: `/bid/bids-by-task-id/${taskId}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Bid"],
    // }),

     getBidsByTaskId: builder.query({
      query: (taskId) => ({
        url: `/bid/bids-by-task-id/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Bid"],
    }),

    acceptBid: builder.mutation({
      query: (payload) => ({
        url: `/task/accept-TaskBy-Customer`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: payload, 
      }),
      invalidatesTags: ["Bid"],
    }),
  }),
});

export const { 
  useCreateBidMutation, 
  useGetBidsByTaskIdQuery, 
  useAcceptBidMutation 
} = bidApi;

export default bidApi;