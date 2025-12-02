"use client";
import React from 'react';
import {usePathname } from 'next/navigation';
import ChatInterface from '../page';


const ChatDetails = () => {
  const path = usePathname();
  const userId =  path.split("/")[2]

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
          <p className="text-gray-600 mt-2">The conversation you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <ChatInterface userId={userId} />;
}

export default ChatDetails;