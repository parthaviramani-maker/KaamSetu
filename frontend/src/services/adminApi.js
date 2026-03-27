import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Admin'],
    endpoints: (builder) => ({

        // Platform stats
        getAdminStats: builder.query({
            query: () => '/admin/stats',
            providesTags: ['Admin'],
        }),

        // All users with optional role/search filter
        getAllUsers: builder.query({
            query: (params = {}) => ({ url: '/admin/users', params }),
            providesTags: ['Admin'],
        }),

        // All jobs (admin view, all statuses, all employers)
        getAllAdminJobs: builder.query({
            query: () => '/admin/jobs',
            providesTags: ['Admin'],
        }),

        // All agents with placement & commission stats
        getAllAgents: builder.query({
            query: () => '/admin/agents',
            providesTags: ['Admin'],
        }),

        // Monthly reports — last 6 months placements + revenue
        getAdminReports: builder.query({
            query: () => '/admin/reports',
            providesTags: ['Admin'],
        }),
    }),
});

export const {
    useGetAdminStatsQuery,
    useGetAllUsersQuery,
    useGetAllAdminJobsQuery,
    useGetAllAgentsQuery,
    useGetAdminReportsQuery,
} = adminApi;
