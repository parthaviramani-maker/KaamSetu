import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithLogout from '../store/baseQuery';

export const walletApi = createApi({
    reducerPath: 'walletApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Wallet'],
    endpoints: (builder) => ({

        // Get balance + recent 10 transactions
        getWalletBalance: builder.query({
            query: () => '/wallet/balance',
            providesTags: [{ type: 'Wallet', id: 'BALANCE' }],
        }),

        // Top-up wallet via QR + password
        topupWallet: builder.mutation({
            query: (body) => ({ url: '/wallet/topup', method: 'POST', body }),
            invalidatesTags: [{ type: 'Wallet', id: 'BALANCE' }, { type: 'Wallet', id: 'TXN' }],
        }),

        // Full transaction history
        getTransactions: builder.query({
            query: (params = {}) => ({ url: '/wallet/transactions', params }),
            providesTags: [{ type: 'Wallet', id: 'TXN' }],
        }),
    }),
});

export const {
    useGetWalletBalanceQuery,
    useTopupWalletMutation,
    useGetTransactionsQuery,
} = walletApi;
