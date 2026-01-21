import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '../ui/button'
import Restaurant1 from '../../assets/Restaurant1.jpg'
import food1 from '../../assets/food1.jpg';
import food2 from '../../assets/food2.jpeg';
import food3 from '../../assets/food3.jpg'
import food4 from '../../assets/food4.jpg';
import food5 from '../../assets/food5.jpg';

const restaurantData = {
  1: {
    name: "Domino's Pizza",
    cuisine: "Pizza, Fast Food",
    rating: "4.2",
    time: "30 mins",
    image:
      Restaurant1,
    menu: [
        {
            id: 1,
            name: "Margherita Pizza",
            price: "199",
            image: food1,
        },
        {
            id: 2,
            name: "Pepperoni Pizza",
            price: "299",
            image: food2,
        },
        {
            id: 3,
            name: "Farmhouse Pizza",
            price: "349",
            image: food3,
        },
        {
            id: 4,
            name: "Veggie Delight",
            price: "249",
            image: food4,
        },
        {
            id: 5,
            name: "Cheese Burst Pizza",
            price: "399",
            image: food5,
        },
        {
            id: 1,
            name: "Margherita Pizza",
            price: "199",
            image: food1,
        },
        {
            id: 2,
            name: "Pepperoni Pizza",
            price: "299",
            image: food2,
        },
        {
            id: 3,
            name: "Farmhouse Pizza",
            price: "349",
            image: food3,
        },
        {
            id: 4,
            name: "Veggie Delight",
            price: "249",
            image: food4,
        },
        {
            id: 5,
            name: "Cheese Burst Pizza",
            price: "399",
            image: food5,
        },
    ],
  },
};

const RestaurantDetails = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className='text-3xl font-bold mb-6'>Restaurant Details</h1>
        <img src={restaurantData[1].image} className='w-full h-72 object-cover round-xl mb-6' />

        <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-semibold">{restaurantData[1].name}</h2>
            <p className="text-gray-600">{restaurantData[1].cuisine}</p>
            <p> {restaurantData[1].rating} &#9733;&#9733;&#9733;&#9733;&#9734;</p>
            <p> {restaurantData[1].time} </p>
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
                {restaurantData[1].menu.map((item) =>(
                    <TableRow key={item.id}>
                        <TableCell ><img src={item.image} className="w-16 h-16 rounded-md object-cover"/></TableCell>
                        <TableCell className='font-medium'>{item.name}</TableCell>
                        <TableCell>&#8377;{item.price} </TableCell>
                        <TableCell className="text-right"><Button >Add</Button></TableCell>
                </TableRow>
                ))}               
            </TableBody>
        </Table>
    </div>
  )
}

export default RestaurantDetails
