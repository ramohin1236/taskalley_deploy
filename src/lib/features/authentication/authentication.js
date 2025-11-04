import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storeTokens } from "@/utils/auth";
import baseUrl from "../../../../utils/baseUrl";

const authentication = createApi({
    reducerPath: 'authentication',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${baseUrl()}`,
        
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Authentication'],
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(args, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.data) {
                        const { accessToken, refreshToken } = data.data;
                        storeTokens(accessToken, refreshToken);
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
            transformResponse: (response) => {
                return {
                    success: response.success,
                    message: response.message,
                    data: response.data,
                    isAddressProvided: response.data?.isAddressProvided
                };
            },
            invalidatesTags: ['Authentication'],
        })
    }),
});

export const { useLoginUserMutation } = authentication;
export default authentication;