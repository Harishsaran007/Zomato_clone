import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';


const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on initial render
        const savedCart = localStorage.getItem('zomato-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('zomato-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id && i.hotelId === item.hotelId);
            if (existingItem) {
                // Increase quantity if item already exists
                return prevItems.map((i) =>
                    i.id === item.id && i.hotelId === item.hotelId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            // Add new item with quantity 1
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId, hotelId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => !(item.id === itemId && item.hotelId === hotelId))
        );
    };

    const updateQuantity = (itemId, hotelId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId, hotelId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId && item.hotelId === hotelId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const placeOrder = async () => {
        try {
            if (cartItems.length === 0) throw new Error("Cart is empty");

            // calculate total price
            const total_price = getCartTotal();

            // Get user ID from stored user data
            const savedUser = localStorage.getItem('zomato-user');
            const tokenData = localStorage.getItem('zomato-token');

            if (!tokenData) {
                throw new Error("Please login to place an order");
            }

            // Parse saved user to get ID
            let userId = null;
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                userId = parsedUser.id;
            }

            if (!userId) {
                throw new Error("User ID not found. Please logout and login again.");
            }

            // For now, we take the hotel from the first item. 
            const hotelId = cartItems[0].hotelId;

            // 1. Create Order
            // According to api_examples.json, order creation needs: user, hotel, delivery_agent, status, total_price
            const orderData = {
                user: userId,
                hotel: hotelId,
                delivery_agent: null,
                status: "ordered",
                total_price: total_price.toFixed(2)
            };

            console.log("Creating order with data:", orderData);
            const orderResponse = await api.post('/orders/', orderData);
            console.log("Order created:", orderResponse.data);
            const orderId = orderResponse.data.id;

            // 2. Initiate Payment
            console.log("Fetching payment link for order:", orderId);
            const paymentResponse = await api.get(`/orders/${orderId}/pay/`);
            console.log("Payment response:", paymentResponse.data);

            // API returns "short_url" not "pay_url" per api_examples.json
            const paymentUrl = paymentResponse.data.short_url || paymentResponse.data.pay_url;

            if (paymentUrl) {
                // Redirect to payment
                window.location.href = paymentUrl;
            } else {
                throw new Error("Failed to get payment URL from server");
            }

            return { success: true };

        } catch (error) {
            console.error("Order placement failed:", error);
            console.error("Error response data:", error.response?.data);
            // Check for specific backend errors
            let message = "Failed to place order";
            if (error.response?.data) {
                // Handle DRF validation errors
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
