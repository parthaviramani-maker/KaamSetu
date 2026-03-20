import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const jobApi = createApi({
    reducerPath: 'jobApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Job'],
    endpoints: (builder) => ({

        // Worker / Agent / Admin — open jobs list
        getAllJobs: builder.query({
            query: (params = {}) => ({ url: '/jobs', params }),
            providesTags: [{ type: 'Job', id: 'ALL' }],
        }),

        // Employer — my posted jobs
        getMyJobs: builder.query({
            query: () => '/jobs/my',
            providesTags: [{ type: 'Job', id: 'MY' }],
        }),

        // Employer — post new job
        createJob: builder.mutation({
            query: (body) => ({ url: '/jobs', method: 'POST', body }),
            invalidatesTags: [{ type: 'Job', id: 'MY' }],
        }),

        // Employer — close a job
        closeJob: builder.mutation({
            query: (id) => ({ url: `/jobs/${id}/close`, method: 'PUT' }),
            invalidatesTags: [{ type: 'Job', id: 'MY' }],
        }),
    }),
});

export const {
    useGetAllJobsQuery,
    useGetMyJobsQuery,
    useCreateJobMutation,
    useCloseJobMutation,
} = jobApi;
