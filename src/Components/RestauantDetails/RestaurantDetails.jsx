import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '@/utils/api'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import { Button } from '../ui/button'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import hotel_image from '../../assets/Restaurant1.jpg'
import food_image from '../../assets/food4.jpg'

const RestaurantDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [hotel, setHotel] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [hotelRes, menuRes] = await Promise.all([
                    api.get(`/api/hotels/${id}/`),
                    api.get(`/api/hotels/${id}/foods/`)
                ]);

                setHotel(hotelRes.data);

                let menuData = [];
                if (Array.isArray(menuRes.data)) {
                    menuData = menuRes.data;
                } else if (menuRes.data && Array.isArray(menuRes.data.results)) {
                    menuData = menuRes.data.results;
                }
                setMenu(menuData);
                setError(null);
            } catch (err) {
                console.error('Error fetching restaurant details:', err);
                setError('Failed to load restaurant details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const getImage = (url, defaultImg) => {
        return url && url.trim() !== '' ? url : defaultImg;
    };

    const handleAddToCart = async (item) => {
        const success = await addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            hotelId: hotel.id,
            hotelName: hotel.name,
        });
        if (success) {
            showToast(`${item.name} added to cart`, 'success');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error || !hotel) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error || 'Restaurant not found'}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-6">
            <h1 className='text-3xl font-bold mb-6'>Restaurant Details</h1>
            <img
                src={getImage(hotel.image_url, hotel_image)}
                alt={hotel.name}
                className='w-full h-72 object-cover rounded-xl mb-6'
            />

            <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-semibold">{hotel.name}</h2>
                <p className="text-gray-600">{hotel.address} | {hotel.city}</p>
                <p> 4.2 &#9733;&#9733;&#9733;&#9733;&#9734;</p>
                <p> 30 mins </p>
            </div>

            <h2 className='text-xl font-semibold mb-4'>Menu</h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead >Image</TableHead>
                        <TableHead>Dish Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {menu.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell >
                                <img
                                    src={getImage(item.image, food_image)}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-md object-cover"
                                />
                            </TableCell>
                            <TableCell className='font-medium'>{item.name}</TableCell>
                            <TableCell>&#8377;{item.price} </TableCell>
                            <TableCell className="text-right">
                                <Button onClick={() => handleAddToCart(item)}>Add</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default RestaurantDetails
