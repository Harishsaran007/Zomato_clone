import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

export const useRestaurant = (id) => {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: async () => {
            const response = await api.get(`/api/hotels/${id}/`);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useRestaurantMenu = (id) => {
    return useQuery({
        queryKey: ['restaurant', id, 'menu'],
        queryFn: async () => {
            const response = await api.get(`/api/hotels/${id}/foods/`);
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.results)) return response.data.results;
            return [];
        },
        enabled: !!id,
    });
};
