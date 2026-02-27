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

        // If 401 (Unauthorized) and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const refreshUrl = process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`
                    : 'http://localhost:5000/api/v1/auth/refresh';

                const response = await axios.get(refreshUrl, {
                    withCredentials: true,
                });

                if (response.data.status === 'success') {
                    const { token } = response.data;
                    localStorage.setItem('token', token);

                    // Update header and retry
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear data and redirect to login
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    // Only redirect if not already on the login page to avoid reloads
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
