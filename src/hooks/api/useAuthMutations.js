import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post('/token/', credentials);
            return response.data;
        },
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: async (userData) => {
            const response = await api.post('/api/users/', userData);
            return response.data;
        },
    });
};

export const useUserDetails = (userId, isEnabled) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const response = await api.get(`/api/users/${userId}/`);
            if (Array.isArray(response.data)) return response.data[0];
            if (response.data && Array.isArray(response.data.results)) return response.data.results[0];
            return response.data;
        },
        enabled: !!userId && isEnabled,
    });
};
