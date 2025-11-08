import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../../../../utils/baseUrl";

const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,

  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({

    getAllCategories: builder.query({
      query: () => ({
        url: "/category/all-categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
} = categoryApi;

export default categoryApi;