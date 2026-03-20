import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['User'],
    endpoints: (builder) => ({

        // Get my full profile
        getMe: builder.query({
            query: () => '/users/me',
            providesTags: ['User'],
        }),

        // Update name / phone
        updateMe: builder.mutation({
            query: (body) => ({ url: '/users/me', method: 'PUT', body }),
            invalidatesTags: ['User'],
        }),

        // Delete account
        deleteMe: builder.mutation({
            query: () => ({ url: '/users/me', method: 'DELETE' }),
        }),
    }),
});

export const {
    useGetMeQuery,
    useUpdateMeMutation,
    useDeleteMeMutation,
} = userApi;
