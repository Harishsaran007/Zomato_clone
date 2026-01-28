import React, { useState, useEffect, useRef, useCallback } from "react";
import Restaurant from "@/Components/Restaurant/Restaurant";
import Deliver from "@/Components/Deliver/Deliver";
import api from "@/utils/api";
import restaurant_image from "../../assets/Restaurant1.jpg";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);

  const fetchHotels = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const response = await api.get(`/api/hotels/?page=${page}`);

      setHotels((prev) => [...prev, ...response.data.results]);
      setHasMore(Boolean(response.data.next));
      setPage((prev) => prev + 1);

      setError(null);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to load hotels. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useInfiniteScroll(fetchHotels, sentinelRef);

  const getHotelImage = (imageUrl) => {
    return imageUrl && imageUrl.trim() !== "" ? imageUrl : restaurant_image;
  };

  return (
    <div>
      <Deliver />

      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {hotels
          .filter((hotel) => hotel.is_active)
          .map((hotel) => (
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


      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-16 flex justify-center items-center"
        >
          {loading && (
            <p className="text-gray-500 text-lg">
              Loading more restaurants...
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="flex justify-center py-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default Home;
