"use client";

import Image from "next/image";
import popularcateIcon from "../../../public/popularcate.svg";
import { useState } from "react";
import srvcporvider from "../../../public/women.svg";
import mapPin from "../../../public/mapPin.svg";
import Link from "next/link";
import righArrowIcon from "../../../public/whitearrow.svg";

const categories = [
  {
    name: "Cleaning",
    services: [
      {
        id: 1,
        title: "Office Cleaning Service From",
        location: "New York, USA",
        rating: 4.5,
        image: { srvcporvider },
      },
      {
        id: 2,
        title: "Office Cleaning Service",
        location: "New York, USA",
        rating: 4.5,
        image: { srvcporvider },
      },
      {
        id: 3,
        title: "Window Washing (3 BHK)",
        location: "New York, USA",
        rating: 4.5,
        image: { srvcporvider },
      },
    ],
  },
  {
    name: "Plumbing",
    services: [
      {
        id: 4,
        title: "Pipe Fixing Service",
        location: "California, USA",
        rating: 4.7,
        image: { srvcporvider },
      },
      {
        id: 5,
        title: "Bathroom Leak Repair",
        location: "Texas, USA",
        rating: 4.6,
        image: { srvcporvider },
      },
    ],
  },
  {
    name: "Appliances",
    services: [
      {
        id: 6,
        title: "AC Installation",
        location: "Florida, USA",
        rating: 4.8,
        image: { srvcporvider },
      },
      {
        id: 7,
        title: "Washing Machine Repair",
        location: "Chicago, USA",
        rating: 4.4,
        image: { srvcporvider },
      },
    ],
  },
  {
    name: "Painting",
    services: [
      {
        id: 8,
        title: "House Painting Service",
        location: "Los Angeles, USA",
        rating: 4.9,
        image: { srvcporvider },
      },
    ],
  },
  {
    name: "Moving",
    services: [
      {
        id: 9,
        title: "Packers & Movers",
        location: "New Jersey, USA",
        rating: 4.3,
        image: { srvcporvider },
      },
    ],
  },
  {
    name: "Furniture",
    services: [
      {
        id: 10,
        title: "Custom Furniture Assembly",
        location: "Seattle, USA",
        rating: 4.6,
        image: { srvcporvider },
      },
    ],
  },
];

const PopularService = () => {

  const [activeTab, setActiveTab] = useState("Cleaning");

  const activeCategory = categories.find((cat) => cat.name === activeTab);

  return (
    <section className="max-w-[1240px] mx-auto px-4">
      <div className="flex flex-col gap-16">
        <div className="mt-16 md:mt-44 flex flex-col gap-5 md:flex-row justify-between md:items-center">
          {/* top header */}
          <div>
            <div className="flex items-center gap-4 ">
              <Image
                src={popularcateIcon}
                alt="Popular Category "
                height={24}
              />
              <p className="font-semibold text-md md:text-xl text-color pb-3">
                SERVICES
              </p>
            </div>
            <h3 className="font-semibold text-2xl md:text-4xl flex flex-col gap-6">
              Popular Service Provider
            </h3>
          </div>

          {/* Cards */}
        </div>

        <div className="">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat.name)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                  activeTab === cat.name
                    ? "bg-[#115e59] text-white"
                    : "bg-[#e6f4f1]  hover:bg-brand_color"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeCategory?.services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition"
              >
                <div className="relative">
                  <Image
                    src={service.image.srvcporvider.src}
                    alt={service.title}
                    width={400}
                    height={250}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <span className="absolute top-3 left-3 bg-[#e0d9d0] px-3 py-1 rounded-sm text-md font-semibold shadow text-[#115e59]">
                    {activeTab}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-black">
                    <div className="flex items-center gap-1">
                      {" "}
                      <Image src={mapPin} alt="Location" height={20} />{" "}
                      {service.location}
                    </div>
                    <span>⭐ {service.rating}</span>
                  </div>
                  <h3 className="font-medium text-xl mt-2">{service.title}</h3>
                  <button className="mt-6 px-4 py-2 bg-[#E6F4F1] hover:text-white rounded-md hover:bg-teal-800 text-[#115e59] cursor-pointer font-medium transition transform duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <Link
            href="/service-listing"
            className="px-4 py-3 md:px-6 md:py-4 md:text-xl font-semibold bg-[#115e59] text-white rounded-sm hover:bg-teal-800 transition transform duration-300 hover:scale-105 flex items-center justify-center gap-3"
          >
            Explore More
            <Image
              src={righArrowIcon}
              alt="Popular Category"
              className="w-3 md:w-4"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularService;
