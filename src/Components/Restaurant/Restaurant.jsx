import React from 'react'
import { Link } from 'react-router-dom';

const Restaurant = ({ id, img, name, cuisine, rating, time }) => {
  return (
    <Link to={`/restaurant/${id}`} className="block">
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
        <img
          src={img}
          className="w-full h-40 object-cover"
        />

        <div className="p-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">{name}</h3>
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
              {rating} &#9733;
            </span>
          </div>

          <p className="text-xs text-gray-500">{cuisine}</p>
          <p className="text-xs text-gray-400 mt-1">{time} mins</p>
        </div>
      </div>
    </Link>
  );
};

export default Restaurant;

