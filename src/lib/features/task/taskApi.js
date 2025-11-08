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
      }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (category) params.append("category", category);
        if (sortBy) params.append("sortBy", sortBy);

        return {
          url: `/task/all-task?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Task"],
    }),

    getTaskById: builder.query({
      query: (id) => ({
        url: `/task/${id}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...taskData }) => ({
        url: `/task/update-task/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: taskData,
      }),
      invalidatesTags: ["Task"],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/delete-task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),

    getUserTasks: builder.query({
      query: () => ({
        url: "/task/my-tasks",
        method: "GET",
      }),
      providesTags: ["Task"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetUserTasksQuery,
} = taskApi;

export default taskApi;
