import React, { useState, useEffect } from 'react'
import Restaurant from '@/Components/Restaurant/Restaurant'
import Deliver from '@/Components/Deliver/Deliver';
import api from '@/utils/api';
import restaurant_image from "../../assets/Restaurant1.jpg"


const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/hotels/');
        if (Array.isArray(response.data)) {
          setHotels(response.data);
        } else if (response.data && Array.isArray(response.data.results)) {
          setHotels(response.data.results);
        } else {
          console.error("Unexpected API response format:", response.data);
          setHotels([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const getHotelImage = (imageUrl) => {
    return imageUrl && imageUrl.trim() !== '' ? imageUrl : restaurant_image;
  };

  if (loading) {
    return (
      <div>
        <Deliver />
        <div className="px-6 py-6 flex justify-center items-center min-h-[300px]">
          <div className="text-gray-500 text-lg">Loading hotels...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Deliver />
        <div className="px-6 py-6 flex justify-center items-center min-h-[300px]">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Deliver />
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.isArray(hotels) && hotels.filter(hotel => hotel.is_active).map((hotel) => (
          <Restaurant
            key={hotel.id}
            id={hotel.id}
            img={getHotelImage(hotel.image_url)}
            name={hotel.name}
            cuisine={hotel.address}
            rating="4.2"
            time="30"
          />
        ))}
      </div>
    </div>
  )
}

export default Home
