import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // For cookies/refresh tokens
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach token if available
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh or Logout
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRequest = originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/logout') ||
            originalRequest.url?.includes('/auth/refresh');

        // If 401 (Unauthorized), not an auth request, and not already retried
        if (error.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                console.log('API: Attempting token refresh...');
                const refreshUrl = process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`
                    : 'http://localhost:5000/api/v1/auth/refresh';

                const response = await axios.get(refreshUrl, {
                    withCredentials: true,
                });

                if (response.data.status === 'success') {
                    console.log('API: Refresh success');
                    const token = response.data.token || response.data.accessToken;
                    if (token) {
                        localStorage.setItem('token', token);
                        // Update header and retry
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, clear data and redirect
                console.error('API: Refresh failed, redirecting to login', refreshError);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
            }
        }

        // For auth requests or failed refresh, just reject
        if (isAuthRequest && error.response?.status === 401) {
            console.warn('API: Auth request failed with 401');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        }

        console.error('API Error:', error.response?.status, error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default api;
