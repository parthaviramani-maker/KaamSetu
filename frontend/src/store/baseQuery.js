import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE from '../config/api';

// Base query — auto-injects Bearer token from Redux state
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth?.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Wrapper: auto-logout on 401
export const baseQueryWithLogout = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        api.dispatch({ type: 'auth/logout' });
        window.location.href = '/auth';
    }
    return result;
};

export default baseQueryWithLogout;
