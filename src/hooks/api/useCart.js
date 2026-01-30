import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';

export const useCart = (isAuthenticated) => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await api.get('/api/cart/');
            let cartData = [];
            if (Array.isArray(response.data)) {
                cartData = response.data;
            } else if (response.data && Array.isArray(response.data.results)) {
                cartData = response.data.results;
            } else if (response.data && Array.isArray(response.data.cart_items)) {
                cartData = response.data.cart_items;
            }
            return cartData.map(item => ({
                id: item.id,
                name: item.food_name,
                image: item.food_image,
                price: item.food_price,
                quantity: item.quantity,
                total_price: item.total_price,
                ...item
            }));
        },
        enabled: !!isAuthenticated, 
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (item) => {
            await api.post('/api/cart/', {
                food: item.id,
                quantity: 1
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (itemId) => {
            await api.delete(`/api/cart/${itemId}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useUpdateCartQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ itemId, quantity }) => {
            if (quantity <= 0) {
                await api.delete(`/api/cart/${itemId}/`);
                return;
            }
            await api.patch(`/api/cart/${itemId}/`, {
                quantity: quantity
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (cartItems) => {
            await Promise.all(cartItems.map(item => api.delete(`/api/cart/${item.id}/`)));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderData, cartItems }) => {
            console.log("Creating order with data:", orderData);
            const orderResponse = await api.post('/api/orders/', orderData);
            const orderId = orderResponse.data.id;

            console.log("Fetching payment link for order:", orderId);
            const paymentResponse = await api.get(`/api/orders/${orderId}/pay/`);
            const paymentUrl = paymentResponse.data.short_url || paymentResponse.data.pay_url;

            return { orderId, paymentUrl };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};
