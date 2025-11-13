import Image from "next/image";
import React from "react";
import { Clock, Home, MapPin } from "lucide-react";

const MyTaskCard = ({ service }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 border border-gray-200">
      {/* Top row */}
      <div className="flex justify-between items-start pb-4 border-b mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {service.title}
        </h2>
        <span className="text-gray-700 font-medium text-sm sm:text-base">
          {service.price}
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-between border-b mb-4 border-gray-200">
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span> {service.locations[0]}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Home className="w-4 h-4 text-teal-600" />
            <span>{service.locations[1]}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>{service.date}</span>
          </div>
        </div>
        {/* Category + Image */}
        <div className="flex justify-between items-center  pt-4 mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={service.image}
              alt="Category"
              width={50}
              height={50}
              className="rounded-md object-cover w-8"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {service.category}
              </p>
              <p className="text-xs text-[#F97316]">
                {service.status}{" "}
                <span className="text-gray-500">
                  • {service.offers} Offered
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer">
        View Details
      </button>
    </div>
  );
};

export default MyTaskCard;
