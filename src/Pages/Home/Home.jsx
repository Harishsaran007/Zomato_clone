import React, { useRef } from "react";
import Restaurant from "@/Components/Restaurant/Restaurant";
import Deliver from "@/Components/Deliver/Deliver";
import restaurant_image from "../../assets/Restaurant1.jpg";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import RestaurantSkeleton from "@/Components/Restaurant/RestaurantSkeleton";
import { useHotels } from "@/hooks/api/useHotels";

const Home = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useHotels();

  const sentinelRef = useRef(null);

  useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, sentinelRef);

  const getHotelImage = (imageUrl) => {
    return imageUrl && imageUrl.trim() !== "" ? imageUrl : restaurant_image;
  };

  const hotels = data?.pages.flatMap((page) => page.results) || [];

  if (status === 'error') {
    return (
      <div className="flex justify-center py-4 text-red-500">
        Failed to load hotels. Please try again later.
      </div>
    );
  }

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
        {(status === 'pending' || isFetchingNextPage) &&
          Array.from({ length: 4 }).map((_, index) => (
            <RestaurantSkeleton key={`skeleton-${index}`} />
          ))}
      </div>


      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="h-4 flex justify-center items-center"
        >
        </div>
      )}
    </div>
  );
};

export default Home;
