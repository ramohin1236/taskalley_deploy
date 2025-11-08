import { MapPin, Star } from "lucide-react";
import Image from "next/image";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer">
      {/* Image */}
      <div className="relative">
        <Image
          src={service.images?.[0] || "/default-service.jpg"}
          width={600}
          height={400}
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {service.category?.name || "Service"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin className="w-4 h-4 text-[#115E59]" />
            <span className="text-black">{service.city || service.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{service.averageRating || "New"}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Price */}
        {service.price && (
          <p className="text-gray-800 font-semibold text-lg mb-3">
            N {service.price}
          </p>
        )}

        {/* Book Now Button */}
        <button className="w-full bg-[#E6F4F1] text-[#115E59] px-4 py-2 rounded-md font-medium transition transform duration-300 hover:scale-105">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;