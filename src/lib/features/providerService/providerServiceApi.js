import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const providerServiceApi = createApi({
  reducerPath: "providerServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl()}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const accessToken = state?.auth?.accessToken || getTokens().accessToken;
      if (accessToken) {
        headers.set("Authorization", `${accessToken}`);
      } else {
        console.log(" No access token found");
      }
      return headers;
    },
  }),
  tagTypes: ["ProviderService"],
  endpoints: (builder) => ({
    createService: builder.mutation({
      query: (formData) => {
        console.log("Form Data From API Layer:", formData);
        return {
          url: "/service/create-service",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ProviderService"], 
    }),

    getMyService: builder.query({
      query: () => ({
        url: "/service/my-service",
        method: "GET",
      }),
      providesTags: ["ProviderService"],
    }),

    getServiceById: builder.query({
      query: (serviceId) => ({
        url: `/service/get-single-service/${serviceId}`,
        method: "GET"
      }),
      providesTags: ["ProviderService"], 
    }),

    toggleServiceActiveInactive: builder.mutation({
      query: (serviceId) => ({
        url: `/service/active-inactive/${serviceId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ProviderService"],
    }),

    deleteService: builder.mutation({
      query: (serviceId) => ({
        url: `/service/delete-service/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProviderService"],
    }),

    updateService: builder.mutation({
      query: (formData) => {
        console.log("Update Service Form Data From API Layer:", formData);
        return {
          url: "/service/update-service",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["ProviderService"],
    }),
  }),
});

export const { 
  useCreateServiceMutation, 
  useGetMyServiceQuery, 
  useGetServiceByIdQuery,
  useToggleServiceActiveInactiveMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation
} = providerServiceApi;

export default providerServiceApi;