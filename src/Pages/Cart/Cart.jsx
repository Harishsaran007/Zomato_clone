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

import { getProvinces } from '@/services/addressService';

const DEFAULT_FOOD_IMAGE = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, placeOrder } = useCart();

    const getImage = (url) => {
        return url && url.trim() !== '' ? url : DEFAULT_FOOD_IMAGE;
    };

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const { user } = useAuth();

    // Fetch addresses
    React.useEffect(() => {
        const fetchAddresses = async () => {
            if (user) {
                try {
                    const data = await getProvinces();
                    setAddresses(data);
                    // Select default address if available
                    const defaultAddress = data.find(addr => addr.is_default);
                    if (defaultAddress) {
                        setSelectedAddressId(defaultAddress.id);
                    } else if (data.length > 0) {
                        setSelectedAddressId(data[0].id);
                    }
                } catch (error) {
                    console.error("Failed to fetch addresses", error);
                }
            }
        };
        fetchAddresses();
    }, [user]);

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert("Please select a delivery address");
            return;
        }

        const result = await placeOrder(selectedAddressId);
        if (!result.success) {
            alert(result.message);
        }
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

            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
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

            {/* Delivery Address Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                {addresses.length === 0 ? (
                    <div className="text-gray-500">
                        No addresses found.
                        {/* Note: In a real app we'd open the add address modal here, but simpler to just say go to profile/navbar */}
                        <p className="text-sm mt-2">Please add an address from the Navbar.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`border p-4 rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-red-500 bg-red-50' : 'hover:border-gray-300'}`}
                                onClick={() => setSelectedAddressId(addr.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-red-500' : ''}`}>
                                        {selectedAddressId === addr.id && <div className="h-2 w-2 rounded-full bg-red-500" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{addr.label}</p>
                                        <p className="text-sm text-gray-600">{addr.address_line}, {addr.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span>&#8377;{getCartTotal().toFixed(2)}</span>
                </div>
                <Button
                    className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white h-12 text-lg"
                    onClick={handlePlaceOrder}
                    disabled={cartItems.length === 0 || !selectedAddressId}
                >
                    Proceed to Checkout
                </Button>
            </div>
        </div>
    );
};

export default Cart;
