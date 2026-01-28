import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';


const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const response = await api.get('/api/cart/');
            let cartData = [];
            if (Array.isArray(response.data)) {
                cartData = response.data;
            } else if (response.data && Array.isArray(response.data.results)) {
                cartData = response.data.results;
            } else if (response.data && Array.isArray(response.data.cart_items)) {
                cartData = response.data.cart_items;
            } else {
                console.warn("Unexpected cart response format:", response.data);
                cartData = [];
            }

            const mappedItems = cartData.map(item => ({
                id: item.id,
                name: item.food_name,
                image: item.food_image,
                price: item.food_price,
                quantity: item.quantity,
                total_price: item.total_price,
                ...item
            }));
            setCartItems(mappedItems);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const addToCart = async (item) => {
        try {
            await api.post('/api/cart/', {
                food: item.id,
                quantity: 1
            });
            fetchCart();
            return true;
        } catch (error) {
            console.error("Failed to add to cart:", error);
            showToast("Failed to add to cart", "error");
            return false;
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`/api/cart/${itemId}/`);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const updateQuantity = async (itemId, _, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        try {
            await api.patch(`/api/cart/${itemId}/`, {
                quantity: newQuantity
            });
            fetchCart();
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const clearCart = async () => {
        try {
            await Promise.all(cartItems.map(item => api.delete(`/api/cart/${item.id}/`)));
            fetchCart();
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.total_price) || (parseFloat(item.price) * item.quantity)), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const placeOrder = async (addressId) => {
        try {
            if (cartItems.length === 0) throw new Error("Cart is empty");

            const total_price = getCartTotal();

            const savedUser = localStorage.getItem('zomato-user');
            const tokenData = localStorage.getItem('zomato-token');

            if (!tokenData) {
                throw new Error("Please login to place an order");
            }

            if (!addressId) {
                throw new Error("Please select a delivery address");
            }

            let userId = null;
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                userId = parsedUser.id;
            }

            if (!userId) {
                throw new Error("User ID not found. Please logout and login again.");
            }

            const hotelId = cartItems[0]?.hotel || null;

            const orderData = {
                user: userId,
                hotel: hotelId,
                delivery_agent: null,
                status: "ordered",
                total_price: total_price.toFixed(2),
                address: addressId
            };

            console.log("Creating order with data:", orderData);
            const orderResponse = await api.post('/api/orders/', orderData);
            console.log("Order created:", orderResponse.data);
            const orderId = orderResponse.data.id;

            try {
                await clearCart();
            } catch (clearErr) {
                console.warn("Failed to clear cart after order:", clearErr);

            }

            console.log("Fetching payment link for order:", orderId);
            const paymentResponse = await api.get(`/api/orders/${orderId}/pay/`);
            console.log("Payment response:", paymentResponse.data);

            const paymentUrl = paymentResponse.data.short_url || paymentResponse.data.pay_url;

            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                throw new Error("Failed to get payment URL from server");
            }

            return { success: true };

        } catch (error) {
            console.error("Order placement failed:", error);
            console.error("Error response data:", error.response?.data);

            let message = "Failed to place order";
            if (error.response?.data) {

                const errorData = error.response.data;
                if (typeof errorData === 'object') {
                    message = Object.entries(errorData)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                        .join('; ');
                } else {
                    message = errorData.detail || errorData;
                }
            } else if (error.message) {
                message = error.message;
            }
            return { success: false, message };
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                placeOrder,
                clearCart,
                getCartTotal,
                getCartItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
