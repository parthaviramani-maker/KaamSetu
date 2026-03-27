import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['User', 'AuthorizedEmails', 'BankDetails'],
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
            providesTags: ['AuthorizedEmails'],
        }),

        // Admin 2FA — update authorized emails list
        updateAuthorizedEmails: builder.mutation({
            query: (emails) => ({ url: '/users/me/authorized-emails', method: 'PUT', body: { emails } }),
            invalidatesTags: ['AuthorizedEmails'],
        }),

        // Google OAuth users only — set a password for the first time (enables wallet top-up)
        setPassword: builder.mutation({
            query: (body) => ({ url: '/users/set-password', method: 'POST', body }),
        }),

        // Bank details for withdrawal
        getBankDetails: builder.query({
            query: () => '/users/me/bank-details',
            providesTags: ['BankDetails'],
        }),

        updateBankDetails: builder.mutation({
            query: (body) => ({ url: '/users/me/bank-details', method: 'PUT', body }),
            invalidatesTags: ['BankDetails'],
        }),

        // All users list (for transfer dropdown)
        getUsersList: builder.query({
            query: () => '/users/list',
            providesTags: ['User'],
        }),

        // Avatar — upload (multipart/form-data)
        uploadAvatar: builder.mutation({
            query: (formData) => ({
                url: '/users/me/avatar',
                method: 'POST',
                body: formData,
                formData: true,
            }),
            invalidatesTags: ['User'],
        }),

        // Avatar — remove
        removeAvatar: builder.mutation({
            query: () => ({ url: '/users/me/avatar', method: 'DELETE' }),
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
    useSetPasswordMutation,
    useGetBankDetailsQuery,
    useUpdateBankDetailsMutation,
    useGetUsersListQuery,
    useUploadAvatarMutation,
    useRemoveAvatarMutation,
} = userApi;
