import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const serviceApi = createApi({
  reducerPath: "serviceApi",
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
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => ({
        url: `/service/all-service`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),

    getServiceById: builder.query({
      query: (id) => ({
        url: `/service/get-single-service/${id}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
  }),
});

export const { useGetAllServicesQuery, useGetServiceByIdQuery } = serviceApi;

export default serviceApi;
