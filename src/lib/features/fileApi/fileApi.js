// fileApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";


const fileApi = createApi({
  reducerPath: "fileApi",
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
  tagTypes: ["File"],
  endpoints: (builder) => ({
    uploadConversationFiles: builder.mutation({
      query: (formData) => ({
        url: "/file/upload-conversation-files",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["File"],
    }),
  }),
});

export const {
  useUploadConversationFilesMutation,
} = fileApi;

export default fileApi;