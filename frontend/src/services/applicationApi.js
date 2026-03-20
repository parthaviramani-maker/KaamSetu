import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const applicationApi = createApi({
    reducerPath: 'applicationApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Application'],
    endpoints: (builder) => ({

        // Worker — apply to a job
        applyJob: builder.mutation({
            query: (body) => ({ url: '/applications', method: 'POST', body }),
            invalidatesTags: [{ type: 'Application', id: 'MY' }],
        }),

        // Worker — my applications (populated with job info)
        getMyApplications: builder.query({
            query: () => '/applications/my',
            providesTags: [{ type: 'Application', id: 'MY' }],
        }),

        // Employer — applicants for a specific job
        getJobApplicants: builder.query({
            query: (jobId) => `/applications/job/${jobId}`,
            providesTags: (result, error, jobId) => [{ type: 'Application', id: jobId }],
        }),

        // Employer — approve / reject an application
        // Pass { id, status, jobId } — jobId used for cache invalidation only
        updateStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/applications/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { jobId }) => [
                { type: 'Application', id: jobId },
            ],
        }),
    }),
});

export const {
    useApplyJobMutation,
    useGetMyApplicationsQuery,
    useGetJobApplicantsQuery,
    useUpdateStatusMutation,
} = applicationApi;
