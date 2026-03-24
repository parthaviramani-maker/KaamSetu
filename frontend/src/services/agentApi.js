import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const agentApi = createApi({
    reducerPath: 'agentApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Agent'],
    endpoints: (builder) => ({

        // Agent — unique workers placed by this agent
        getAgentWorkers: builder.query({
            query: () => '/agents/workers',
            providesTags: ['Agent'],
        }),

        // Agent — all placement records
        getAgentPlacements: builder.query({
            query: () => '/agents/placements',
            providesTags: ['Agent'],
        }),

        // Agent — commission summary
        getAgentCommission: builder.query({
            query: () => '/agents/commission',
            providesTags: ['Agent'],
        }),

        // Agent — all platform workers (for placement form dropdown)
        getAllWorkers: builder.query({
            query: () => '/agents/all-workers',
            providesTags: ['Agent'],
        }),

        // Agent — create a new placement
        createPlacement: builder.mutation({
            query: (body) => ({ url: '/agents/placements', method: 'POST', body }),
            invalidatesTags: ['Agent'],
        }),
    }),
});

export const {
    useGetAgentWorkersQuery,
    useGetAgentPlacementsQuery,
    useGetAgentCommissionQuery,
    useGetAllWorkersQuery,
    useCreatePlacementMutation,
} = agentApi;
