import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link } from 'react-router-dom';

const DEFAULT_FOOD_IMAGE = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

    const getImage = (url) => {
        return url && url.trim() !== '' ? url : DEFAULT_FOOD_IMAGE;
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12 text-center">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                <div className="bg-gray-50 rounded-xl p-12">
                    <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
                    <Link to="/">
                        <Button className="bg-red-500 hover:bg-red-600 text-white">
                            Browse Restaurants
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Cart</h1>
                <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                >
                    Clear Cart
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map((item) => (
                            <TableRow key={`${item.hotelId}-${item.id}`}>
                                <TableCell>
                                    <img
                                        src={getImage(item.image)}
                                        alt={item.name}
                                        className="w-16 h-16 rounded-md object-cover"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.hotelName}</p>
                                    </div>
                                </TableCell>
                                <TableCell>&#8377;{item.price}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, item.hotelId, item.quantity - 1)}
                                            className="h-8 w-8 p-0"
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, item.hotelId, item.quantity + 1)}
                                            className="h-8 w-8 p-0"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    &#8377;{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFromCart(item.id, item.hotelId)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span>&#8377;{getCartTotal().toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white h-12 text-lg">
                    Proceed to Checkout
                </Button>
            </div>
        </div>
    );
};

export default Cart;
