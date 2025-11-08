"use client";

import React from "react";
import { useState } from "react";
import service_main_image from "../../../../../public/main_home.jpg";
import service_second from "../../../../../public/service_second.png";

import Image from "next/image";
import InfoProvider from "@/components/serviceprovider/InfoProvider";
import ServiceTabs from "@/components/serviceprovider/ServiceTabs";
import BookingCard from "@/components/serviceprovider/BookingCard";

const ServiceDetails = () => {
  const [activeTab, setActiveTab] = useState("Description");

  return (
    <div className="project_container mx-auto lg:p-6 overflow-clip">
      {/* Header */}
      <div className="px-6 mt-8">
        {/* heading part */}
        <div className="flex flex-col flex-co gap-3 mb-6">
          <div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Cleaning
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Office Cleaning Service
          </h1>
        </div>

        {/* Image Grid */}
        <div className="flex flex-wrap flex-col lg:flex-row gap-4 mb-6">
          {/* Main large image */}
          <div className="flex-1">
            <Image
              src={service_main_image}
              height={800}
              alt="Professional cleaner vacuuming office"
              className="w-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            {/* Smaller images */}

            <div className="grid grid-cols-2 gap-4">
              <Image
                src={service_second}
                alt="Window cleaning"
                className="w-full h-36 md:h-60  object-cover rounded-lg"
              />
              <Image
                src={service_second}
                alt="Office cleaning"
                className="w-full h-36 md:h-60 object-cover rounded-lg"
              />
              <Image
                src={service_second}
                alt="Window cleaning"
                className="w-full h-36 md:h-60 object-cover rounded-lg"
              />

              <Image
                src={service_second}
                alt="Office cleaning"
                className="w-full h-36 md:h-60 object-cover rounded-lg"
              />
            </div>

            <div className="flex gap-4"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <InfoProvider />

            <ServiceTabs />
          </div>
        </div>

        {/* Right Sidebar */}
        <BookingCard />
      </div>
    </div>
  );
};

export default ServiceDetails;
