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

        // Admin 2FA — get authorized emails list
        getAuthorizedEmails: builder.query({
            query: () => '/users/me/authorized-emails',
            providesTags: ['User'],
        }),

        // Admin 2FA — update authorized emails list
        updateAuthorizedEmails: builder.mutation({
            query: (emails) => ({ url: '/users/me/authorized-emails', method: 'PUT', body: { emails } }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetMeQuery,
    useUpdateMeMutation,
    useDeleteMeMutation,
    useGetAuthorizedEmailsQuery,
    useUpdateAuthorizedEmailsMutation,
} = userApi;
