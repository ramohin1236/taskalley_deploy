import React from 'react'
import client from "../../../../public/client.png";
import NotificationCard from '@/components/profile/NotificationCard';
import { ArrowLeft } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { IoIosNotifications } from 'react-icons/io';


 const notifications = [
    {
      name: "Tyler S.",
      task: "Test Task",
      time: "FRI AT 16:44 PM",
      image: client,
    },
    {
      name: "Tyler S.",
      task: "Test Task",
      time: "FRI AT 16:44 PM",
      image: client,
    },
    {
      name: "Tyler S.",
      task: "Test Task",
      time: "FRI AT 16:44 PM",
      image: client,
    },
    {
      name: "Tyler S.",
      task: "Test Task",
      time: "FRI AT 16:44 PM",
      image: client,
    },
    {
      name: "Tyler S.",
      task: "Test Task",
      time: "FRI AT 16:44 PM",
      image: client,
    },
    {
      name: "Tyler S.",
      task: "Test Task",
      time: "FRI AT 16:44 PM",
      image: client,
    },
    {
      name: "Tyler S.",
      task: "Test Task",
      time: "FRI AT 16:44 PM",
      image: client,
    },
  ];


const ServiceProviderNotificaiton = () => {
  return (
     <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="flex items-center gap-2">
         <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <IoIosNotifications className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
        <h2 className=" text-gray-700 text-2xl font-bold">Notifications</h2>
      </div>
      <div className="grid grid-cols-1 items-center gap-2 mb-6 py-6">
        {notifications.map((note, index) => (
          <NotificationCard key={index} {...note} />
        ))}
      </div>
    </div>
  )
}

export default ServiceProviderNotificaiton