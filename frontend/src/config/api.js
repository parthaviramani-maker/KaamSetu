// API Configuration — KaamSetu
// Auto-uses correct base URL from .env

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE     = `${API_BASE_URL}/api/v1`;

export const ENDPOINTS = {
    auth:         `${API_BASE}/auth`,
    users:        `${API_BASE}/users`,
    jobs:         `${API_BASE}/jobs`,
    applications: `${API_BASE}/applications`,
    agents:       `${API_BASE}/agents`,
    admin:        `${API_BASE}/admin`,
};

export default API_BASE;
