import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('zomato-token');
        if (token) {
            const parsedToken = JSON.parse(token);
            config.headers.Authorization = `Bearer ${parsedToken.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration (optional but recommended)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const token = localStorage.getItem('zomato-token');
                if (token) {
                    const parsedToken = JSON.parse(token);
                    const response = await axios.post('/token/refresh/', {
                        refresh: parsedToken.refresh
                    });

                    if (response.status === 200) {
                        const { access, refresh } = response.data;

                        // Update local storage
                        // Some refresh endpoints return new refresh token, some don't. 
                        // Assuming django-simplejwt returns access. 
                        // If it returns both, update both. 

                        const newToken = {
                            ...parsedToken,
                            access: access,
                            // if refresh is returned, update it too
                            ...(refresh && { refresh })
                        };

                        localStorage.setItem('zomato-token', JSON.stringify(newToken));

                        // Retry the original request
                        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed - redirect to login or handle logout
                localStorage.removeItem('zomato-token');
                localStorage.removeItem('zomato-user');
                // You might want to redirect to login page here or emit an event
                // window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;
