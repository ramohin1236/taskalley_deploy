"use client";

import React from "react";
import { MapPin, Clock, Shield, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BookingCard = ({ signgleServiceData }) => {
  const router = useRouter();
  
  console.log("Provider ID:", signgleServiceData?.provider?._id);

  const handleSubmitOffer = () => {
    const providerId = signgleServiceData?.provider?._id;
    
    if (!providerId) {
      toast.warning("Provider information not available");
      return;
    }
    router.push(`/post_task?providerId=${providerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Booking Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#d6f1f0] text-[#00786f] px-3 py-1 rounded-full text-sm font-medium">
            {signgleServiceData?.category?.name || "Service"}
          </span>
        </div>

        <div className="text-gray-600 text-sm mb-2">Starts From</div>
        <div className="text-3xl font-bold text-gray-900 mb-6">
          ₦ {signgleServiceData?.price || "24.00"}
        </div>

        <div className="space-y-3">
          <Link 
            href="/chat" 
            className="w-full flex items-center justify-center gap-2 bg-white border px-4 py-3 rounded-lg hover:bg-teal-50 transition-colors border-teal-700 text-teal-700"
          >
            <MessageCircle className="w-4 h-4" />
            Chat Now
          </Link>

          <button 
            onClick={handleSubmitOffer}
            className="w-full bg-[#00786f] hover:bg-[#074641] cursor-pointer text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Submit a Offer
          </button>
        </div>
      </div>

      {/* Additional Info */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00786f]" />
            <span>Verified & Insured</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00786f]" />
            <span>7 Days Availability</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00786f]" />
            <span>{signgleServiceData?.city || "City"} Coverage</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default BookingCard;