import React from 'react'
import Restaurant from '@/Components/Restaurant/Restaurant'
import food1 from "../../assets/food1.jpg";
import food2 from "../../assets/food2.jpeg";
import food3 from "../../assets/food3.jpg";
import food4 from "../../assets/food4.jpg";
import food5 from '../../assets/food5.jpg';
import Deliver from '@/Components/Deliver/Deliver';
const restaurants = [
  {
    img: food1,
    name: "Domino's Pizza",
    cuisine: "Pizza, Fast Food",
    rating: "4.2",
    time: "30",
  },
  {
    img: food2,
    name: "Burger King",
    cuisine: "Burgers, Snacks",
    rating: "4.0",
    time: "25",
  },
  {
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
  {
    img: food4,
    name: "Amma Mess",
    cuisine: "Idly, Vada",
    rating: "4.2",
    time: "30",
  },
  {
    img: food5,
    name: "Grill Night",
    cuisine: "Chicken, Mutton",
    rating: "4.0",
    time: "25",
  },
  {
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
  {
    img: food1,
    name: "Domino's Pizza",
    cuisine: "Pizza, Fast Food",
    rating: "4.2",
    time: "30",
  },
  {
    img: food2,
    name: "Burger King",
    cuisine: "Burgers, Snacks",
    rating: "4.0",
    time: "25",
  },
  {
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
  {
    img: food4,
    name: "Amma Mess",
    cuisine: "Idly, Vada",
    rating: "4.2",
    time: "30",
  },
  {
    img: food5,
    name: "Grill Night",
    cuisine: "Chicken, Mutton",
    rating: "4.0",
    time: "25",
  },
  {
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
];



const Home = () => {
  return (
    <div> 
      <Deliver />
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {restaurants.map((res, index) => (
          <Restaurant
            key={index}
            img={res.img}
            name={res.name}
            cuisine={res.cuisine}
            rating={res.rating}
            time={res.time}
          />
        ))}
      </div>

    </div>
  )
}

export default Home
