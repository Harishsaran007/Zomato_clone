import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import { Button } from '../ui/Button'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

const DEFAULT_HOTEL_IMAGE = "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg";
const DEFAULT_FOOD_IMAGE = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg";

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
                    axios.get(`/api/hotels/${id}/`),
                    axios.get(`/api/hotels/${id}/foods/`)
                ]);

                setHotel(hotelRes.data);
                setMenu(menuRes.data);
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
                src={getImage(hotel.image_url, DEFAULT_HOTEL_IMAGE)}
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
                                    src={getImage(item.image, DEFAULT_FOOD_IMAGE)}
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
