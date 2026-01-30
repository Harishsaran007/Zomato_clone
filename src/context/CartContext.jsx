import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import {
    useCart as useCartQuery,
    useAddToCart,
    useRemoveFromCart,
    useUpdateCartQuantity,
    useClearCart,
    usePlaceOrder as usePlaceOrderMutation
} from '@/hooks/api/useCart';

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
    const { data: cartItems = [], refetch } = useCartQuery(!!user);
    const addToCartMutation = useAddToCart();
    const removeFromCartMutation = useRemoveFromCart();
    const updateQuantityMutation = useUpdateCartQuantity();
    const clearCartMutation = useClearCart();
    const placeOrderMutation = usePlaceOrderMutation();

    const addToCart = async (item) => {
        try {
            await addToCartMutation.mutateAsync(item);
            return true;
        } catch (error) {
            console.error("Failed to add to cart:", error);
            showToast("Failed to add to cart", "error");
            return false;
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await removeFromCartMutation.mutateAsync(itemId);
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const updateQuantity = async (itemId, _, newQuantity) => {
        try {
            await updateQuantityMutation.mutateAsync({ itemId, quantity: newQuantity });
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const clearCart = async () => {
        try {
            await clearCartMutation.mutateAsync(cartItems);
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
            if (!user) throw new Error("Please login to place an order");
            if (!addressId) throw new Error("Please select a delivery address");

            const total_price = getCartTotal();
            const hotelId = cartItems[0]?.hotel || null;

            const orderData = {
                user: user.id,
                hotel: hotelId,
                delivery_agent: null,
                status: "ordered",
                total_price: total_price.toFixed(2),
                address: addressId
            };

            const { paymentUrl } = await placeOrderMutation.mutateAsync({ orderData, cartItems });

            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                throw new Error("Failed to get payment URL from server");
            }

            return { success: true };

        } catch (error) {
            console.error("Order placement failed:", error);

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
                refetch
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
