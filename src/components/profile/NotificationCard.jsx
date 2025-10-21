import Image from 'next/image'
import React from 'react'

const NotificationCard = ({ name, task, time, image }) => {
  return (
     <div className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <p className="text-gray-700 text-lg sm:text-base text-center md:text-left">
          <span className="font-semibold text-emerald-900 text-xl">{name}</span>{" "}
          <span className='text-lg'>has submitted an offer on your task:</span>{" "} 
          <span className="font-semibold text-emerald-900">"{task}"</span>.
        </p>
        <span className="text-gray-400 text-lg sm:text-sm mt-1">{time}</span>
      </div>
    </div>
  )
}

export default NotificationCard