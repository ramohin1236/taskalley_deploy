// components/chat/ChatSideNav.jsx
"use client";
import { Menu, Search, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import Link from "next/link";

const ChatSideNav = ({ onMobileItemClick }) => {
  const router = useRouter();
  
  const chatUsers = [
    {
      id: 1,
      Name: "Lee Williamson",
      short_message: "Hey, are you available for a quick call?",
      image: "https://i.pravatar.cc/150?img=1",
      email: "lee.williamson@example.com",
      location: "New York, United States"
    },
    {
      id: 2,
      Name: "Eleanor Pena",
      short_message: "Yes, that's gonna work, hopefully.",
      image: "https://i.pravatar.cc/150?img=2",
      email: "eleanor.pena@example.com",
      location: "Los Angeles, United States"
    },
    {
      id: 3,
      Name: "Jacob Jones",
      short_message: "I'll send you the files by tonight.",
      image: "https://i.pravatar.cc/150?img=3",
      email: "jacob.jones@example.com",
      location: "Chicago, United States"
    },
    {
      id: 4,
      Name: "Theresa Webb",
      short_message: "Can we move the meeting to tomorrow?",
      image: "https://i.pravatar.cc/150?img=4",
      email: "theresa.webb@example.com",
      location: "Miami, United States"
    }
  ];

  const handleUserClick = (user) => {
    // URL-এ user ID সহ navigate করুন
    router.push(`/chat/${user.id}`);
    
    // Mobile view হলে sidebar বন্ধ করুন
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="relative pt-36 md:pt-0 ">
        {/* Mobile Back Button */}
        <div className="lg:hidden px-2">
          <Link
            href='/'
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <ArrowLeft className="w-5 h-5 text-[#00786f]" />
            <span className="font-medium text-gray-700">Back</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 border-b pb-4 px-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#115e59] focus:border-transparent bg-[#E6F4F1] text-gray-600"
            />
          </div>
        </div>

        {/* Scrollable Chat List Container */}
        <div className="w-full max-h-[calc(100vh-280px)] lg:max-h-[650px] overflow-y-auto px-2">
          {chatUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="flex items-center gap-3 p-4 hover:bg-[#E6F4F1] cursor-pointer rounded-2xl transition-colors"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 overflow-clip">
                <img
                  src={user.image}
                  className="rounded-full w-full h-full object-cover"
                  alt={user.Name}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-base lg:text-xl font-semibold truncate">{user.Name}</p>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{user.short_message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSideNav;