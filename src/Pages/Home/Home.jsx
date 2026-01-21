import React from 'react'
import Restaurant from '@/Components/Restaurant/Restaurant'
import food1 from "../../assets/food1.jpg";
import food2 from "../../assets/food2.jpeg";
import food3 from "../../assets/food3.jpg";
import food4 from "../../assets/food4.jpg";
import food5 from '../../assets/food5.jpg';
import Deliver from '@/Components/Deliver/Deliver';
import axios from 'axios';


const restaurants = [
  {
    id:1,
    img: food1,
    name: "Domino's Pizza",
    cuisine: "Pizza, Fast Food",
    rating: "4.2",
    time: "30",
  },
  {
    id:2,
    img: food2,
    name: "Burger King",
    cuisine: "Burgers, Snacks",
    rating: "4.0",
    time: "25",
  },
  {
    id:3,
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
  {
    id:4,
    img: food4,
    name: "Amma Mess",
    cuisine: "Idly, Vada",
    rating: "4.2",
    time: "30",
  },
  {
    id:5,
    img: food5,
    name: "Grill Night",
    cuisine: "Chicken, Mutton",
    rating: "4.0",
    time: "25",
  },
  {
    id:6,
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
  {
    id:7,
    img: food1,
    name: "Domino's Pizza",
    cuisine: "Pizza, Fast Food",
    rating: "4.2",
    time: "30",
  },
  {
    id:8,
    img: food2,
    name: "Burger King",
    cuisine: "Burgers, Snacks",
    rating: "4.0",
    time: "25",
  },
  {
    id:9,
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
  {
    id: 10,
    img: food4,
    name: "Amma Mess",
    cuisine: "Idly, Vada",
    rating: "4.2",
    time: "30",
  },
  {
    id:11,
    img: food5,
    name: "Grill Night",
    cuisine: "Chicken, Mutton",
    rating: "4.0",
    time: "25",
  },
  {
    id:12,
    img: food3,
    name: "SS Hyderabad",
    cuisine: "Biryani, Indian",
    rating: "4.5",
    time: "35",
  },
];



const Home = () => {

  const [restaurants,setRestaurants] = useState([]);

  return (
    <div> 
      <Deliver />
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {restaurants.map((res) => (
          <Restaurant
            key={res.id}
            id = {res.id}
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
