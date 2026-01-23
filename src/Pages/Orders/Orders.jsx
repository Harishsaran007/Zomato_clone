import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from '@/Components/ui/Button';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/');
            const sortedOrders = response.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError("Failed to load orders");
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading orders...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <p className="text-gray-500 text-lg mb-6">No orders found</p>
                    <Link to="/">
                        <Button className="bg-red-500 hover:bg-red-600 text-white">
                            Browse Restaurants
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Total Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        &#8377;{parseFloat(order.total_price).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default Orders;
