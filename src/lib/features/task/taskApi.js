import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const taskApi = createApi({
  reducerPath: "taskApi",
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
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/task/create-task",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: taskData,
      }),
      invalidatesTags: ["Task"],
    }),

    getAllTasks: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        category = "",
        sortBy = "",
        location = "",
      }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (category) params.append("category", category);
        if (location) params.append("location", location);

        if (sortBy) {
          if (sortBy === "price_low_high") {
            params.append("sortBy", "budget");
            params.append("sortOrder", "asc");
          } else if (sortBy === "price_high_low") {
            params.append("sortBy", "budget");
            params.append("sortOrder", "desc");
          } else {
            params.append("sortBy", sortBy);
          }
        }

        return {
          url: `/task/all-task?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Task"],
    }),

    getTaskById: builder.query({
      query: (id) => ({
        url: `/task/single-task/${id}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),
    getMyTasks: builder.query({
      query: ({ page = 1, limit = 10, status = "", searchTerm = "" } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (status) params.append("status", status);
        if (searchTerm) params.append("searchTerm", searchTerm);

        return {
          url: `/task/my-task?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Task"],
    }),
        completeTask: builder.mutation({
      query: (taskId) => ({
        url: "/task/complete-task",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: { taskId },
      }),
      invalidatesTags: ["Task"],
    }),
  }),

 
});

export const {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useGetMyTasksQuery,
  useCompleteTaskMutation
} = taskApi;

export default taskApi;
