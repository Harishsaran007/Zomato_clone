import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';

export const useAddress = (isEnabled) => {
    return useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const response = await api.get('/api/address/');
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.results)) return response.data.results;
            return [];
        },
        enabled: isEnabled,
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (addressData) => {
            const response = await api.post('/api/address/', addressData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.patch(`/api/address/${id}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await api.delete(`/api/address/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};
