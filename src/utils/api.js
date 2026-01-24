const baseURL = import.meta.env.VITE_API_URL || 'https://render-test-gspe.onrender.com';
import axios from "axios";

const api = axios.create({
    baseURL: baseURL,
});

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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;


        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const token = localStorage.getItem('zomato-token');
                if (token) {
                    const parsedToken = JSON.parse(token);
                    const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
                        refresh: parsedToken.refresh
                    });

                    if (response.status === 200) {
                        const { access, refresh } = response.data; 

                        const newToken = {
                            ...parsedToken,
                            access: access,
                            
                            ...(refresh && { refresh })
                        };

                        localStorage.setItem('zomato-token', JSON.stringify(newToken));

                        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                localStorage.removeItem('zomato-token');
                localStorage.removeItem('zomato-user');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
