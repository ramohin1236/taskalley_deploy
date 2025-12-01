// services/chatApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

export const chatApi = createApi({
  reducerPath: "chatApi",
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
  tagTypes: ["Chat", "Message"],
  endpoints: (builder) => ({
    getChatList: builder.query({
      query: () => {
        return {
          url: `/conversation/get-chat-list`,
          method: "GET",
        };
      },
      providesTags: ["Chat"],
    }),

    getMessages: builder.query({
      query: (conversationId) => {
        return {
          url: `/message/get-messages/${conversationId}`,
          method: "GET",
        };
      },
      providesTags: ["Message"],
    }),

    startConversation: builder.mutation({
      query: (conversationData) => ({
        url: "/conversation/start-conversation",
        method: "POST",
        body: conversationData,
      }),
      invalidatesTags: ["Chat"],
    }),

    markAsSeen: builder.mutation({
      query: (data) => ({
        url: "/message/mark-seen",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message", "Chat"],
    }),
  }),
});

export const {
  useGetChatListQuery,
  useGetMessagesQuery,
  useStartConversationMutation,
  useMarkAsSeenMutation,
} = chatApi;
