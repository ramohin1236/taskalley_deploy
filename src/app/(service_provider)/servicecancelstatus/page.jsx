"use client";

import Image from "next/image";
import { useState } from "react";
import srvcporvider from "../../../../public/women.svg";
import MyTaskCard from "@/components/my_tasks/MyTaskCard";
import popularcateIcon from "../../../../public/popularcate.svg";
import Link from "next/link";

const categories = [
  {
    name: "Ongoing Tasks",
    services: [
      {
      id: 1,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 0,
      image: srvcporvider,
    },
    {
      id: 2,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 1,
      image: srvcporvider
    },
    {
      id: 3,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 1,
      image: srvcporvider
    }
    ],
  },
  {
    name: "Bids  Made",
    services: [
      {
      id: 1,
      title: 'Help move a couch555',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 0,
      image: srvcporvider
    },
    {
      id: 2,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 1,
      image: srvcporvider
    },
    {
      id: 3,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 1,
      image: srvcporvider
    }
    ],
  },
  {
    name: "Bids  Received",
    services: [
       {
      id: 1,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'progress',
      offers: 0,
      image: srvcporvider
    },
    {
      id: 2,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'progress',
      offers: 1,
      image: srvcporvider
    },
    {
      id: 3,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'progress',
      offers: 1,
      image: srvcporvider
    }
    ],
  },
  {
    name: "Completed Tasks",
    services: [
      {
      id: 1,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'completed',
      offers: 0,
      image: srvcporvider
    },
    {
      id: 2,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'completed',
      offers: 1,
      image: srvcporvider
    },
    {
      id: 3,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'completed',
      offers: 1,
      image: srvcporvider
    }
    ],
  },
  {
    name: "Cancelled Tasks",
    services: [
       {
      id: 1,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 0,
      image: srvcporvider
    },
    {
      id: 2,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 1,
      image: srvcporvider
    },
    {
      id: 3,
      title: 'Help move a couch',
      price: '₦24.00',
      locations: ['Los Angeles, CA 90024', 'New York, USA'],
      date: '15 May 2020 8:00 am',
      category: 'Cleaning',
      status: 'Open',
      offers: 1,
      image: srvcporvider
    }
    ],
  }
];

const ServiceCancelStatus = () => {

  const [activeTab, setActiveTab] = useState("Ongoing Tasks");

  const activeCategory = categories.find((cat) => cat.name === activeTab);


  return (
    <section className="max-w-[1240px] mx-auto px-4 pb-28">
      <div className="flex flex-col gap-8">
        <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
          {/* top header */}
          <div>
            <div className="flex items-center gap-4 ">
              <Image
                   src={popularcateIcon}
                alt="Popular Category "
                height={24}
                width={24}
              />
              <p className="font-semibold text-md md:text-xl text-color pb-3">
               My Tasks
              </p>
            </div>
          
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
                className={`px-4 md:px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
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
          <div className="grid grid-cols-1 3 gap-6">
            {activeCategory?.services.map((service,index) => (
              <div key={index}><Link href={`service_tast_status/${service.id}`}><MyTaskCard  service={service} activeTab={activeTab}/></Link></div>
            ))}
          </div>
        </div>
      
      </div>
    </section>
  );
};

export default ServiceCancelStatus;
