import React from 'react'
import client from "../../../../public/client.png";
import NotificationCard from '@/components/profile/NotificationCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';


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
  ];


const Notifications = () => {
  return (
     <div className="p-4 md:p-6">
      <Link href="/profile_info" className="flex items-center gap-2 mb-6">
        <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
        <h2 className="font-medium text-gray-700">Notifications</h2>
      </Link>
      <div className="grid grid-cols-1 items-center gap-2 mb-6">
        {notifications.map((note, index) => (
          <NotificationCard key={index} {...note} />
        ))}
      </div>
    </div>
  )
}

export default Notifications