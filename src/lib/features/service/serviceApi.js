import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";

const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
  }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        category = "",
        sortBy = "",
      }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (category) params.append("category", category);
        if (sortBy) params.append("sortBy", sortBy);

        return {
          url: `/service/all-service?${params.toString()}`,
          method: "GET",
        };
      },
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
