import React from "react";
import service_provider from "../../../public/client.png";
import { Mail, Shield, Star, User } from "lucide-react";
import Image from "next/image";

const InfoProvider = ({ provider, averageRating, totalRating }) => {
  const providerName = provider?.name || "Service Provider";
  const providerEmail = provider?.email || "Email not available";
  const providerImage = provider?.avatar || provider?.profileImage || service_provider;
  const ratingValue = typeof averageRating === "number" ? averageRating : 0;
  const ratingLabel = ratingValue ? ratingValue.toFixed(1) : "New";
  const totalReviews = totalRating ?? 0;

  return (
    <div className="flex flex-col md:flex-row justify-between lg:items-baseline md:items-start lg:gap-20 md:mb-6 border-b pb-6">
      {/* left side image and name */}
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="relative h-20 w-20 md:h-24 md:w-24">
          <Image
            src={providerImage}
            alt={providerName}
            fill
            sizes="96px"
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            {/* <User className="w-4 h-4 text-[#115e59]" /> */}
            {providerName}
          </h2>
          <p className="text-gray-600 text-sm md:text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            {providerEmail}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row w-full md:w-auto items-start md:items-center lg:items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{ratingLabel}</span>
          <span className="text-gray-500">
            {totalReviews ? `(${totalReviews} Reviews)` : "(No reviews)"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#00786f]">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Verified Provider</span>
        </div>
      </div>
    </div>
  );
};

export default InfoProvider;
