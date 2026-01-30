import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

export const useHotels = () => {
    return useInfiniteQuery({
        queryKey: ['hotels'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await api.get(`/api/hotels/?page=${pageParam}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.next) {
                const url = new URL(lastPage.next);
                const page = url.searchParams.get('page');
                return page ? parseInt(page) : undefined;
            }  
            return undefined;
        },
        initialPageParam: 1,
    });
};

export const useSearchHotels = (query) => {
    return useQuery({
        queryKey: ['hotels', 'search', query],
        queryFn: async () => {
            const response = await api.get(`/api/hotels/?search=${query}`);
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.results)) return response.data.results;
            return [];
        },
        enabled: !!query && query.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSearchFoods = (query) => {
    return useQuery({
        queryKey: ['foods', 'search', query],
        queryFn: async () => {
            const response = await api.get(`/api/foods/?search=${query}`);
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.results)) return response.data.results;
            return [];
        },
        enabled: !!query && query.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });
};
