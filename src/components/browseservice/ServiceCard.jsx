import Image from "next/image";
import React from "react";

const ServiceCard = ({ data }) => {
  const getImageSource = () => {
    if (typeof data?.userImaage === 'string') {
      return data.userImaage;
    }
    return data?.userImaage?.src || '/default-avatar.png';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-green-600';
      case 'closed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col gap-4 shadow-xl rounded-md p-6 bg-white hover:shadow-2xl transition-shadow cursor-pointer border border-gray-100">
      {/* Title and Price */}
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold text-gray-800 line-clamp-1">{data?.serviceName}</p>
        <p className="text-xl font-semibold text-[#115E59]">{data?.price}</p>
      </div>

      {/* Category Badge */}
      <div className="flex justify-between items-center">
        <span className="px-2 py-1 bg-[#115E59] text-white text-xs rounded-full capitalize">
          {data?.category}
        </span>
        {data?.totalOffer > 0 && (
          <span className="text-sm text-gray-500">
            {data.totalOffer} offer{data.totalOffer > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Description */}
      {data?.description && (
        <p className="text-gray-600 text-sm line-clamp-2">
          {data.description}
        </p>
      )}

      {/* Location, Date, Time */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#115E59] flex items-center gap-1.5">
          {data?.mapIcon}{" "}
          <span className="text-[#6B7280] text-sm">{data?.place}</span>
        </p>
        <p className="text-[#115E59] flex items-center gap-1.5">
          {data?.calenderIcon}{" "}
          <span className="text-[#6B7280] text-sm">{data?.city}</span>
        </p>
        <p className="text-[#115E59] flex items-center gap-1.5">
          {data?.monthIcon}{" "}
          <span className="text-[#6B7280] text-sm">{data?.month}</span>
        </p>
      </div>

      {/* User Info */}
      <div className="flex gap-1.5 items-center pt-2 border-t border-gray-100">
        <div className="relative">
          <Image 
            src={getImageSource()} 
            alt="user avatar" 
            width={60} 
            height={60}
            className="rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>

        <div className="flex gap-1 flex-col">
          <p className="text-base font-semibold text-gray-800">{data?.userName}</p>
          <p className={`text-base font-medium ${getStatusColor(data?.open)}`}>
            {data?.open === 'open' ? 'Open for bids' : 'Closed'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;