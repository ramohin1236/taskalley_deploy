// components/chat/ChatSideNav.jsx
"use client";
import { Menu, Search, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useGetChatListQuery } from "@/lib/features/chatApi/chatApi";
import { useSocketContext } from "@/app/context/SocketProvider";
import { useAuth } from "@/components/auth/useAuth";

const ChatSideNav = ({ onMobileItemClick }) => {
  const router = useRouter();
  const { user } = useAuth();
  const {data: chatUsers, refetch}= useGetChatListQuery();
 
  const { seenMessage, onMessageReceivedForUser } = useSocketContext();

  // Auto-refetch chat list every 1 second for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Also listen for socket notifications and refetch immediately
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = onMessageReceivedForUser(user.id, (data) => {
      console.log("New message received - updating sidebar:", data);
      refetch();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, refetch]);

  const handleUserClick = (user) => {
    const data = {
    conversationId:user?.lastMessage?.conversationId,
    msgByUserId:user?.lastMessage?.msgByUserId
    }
  seenMessage(data)
  refetch();
    router.push(`/chat/${user?.userData?._id}`);
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
          {chatUsers?.data?.data.map((user) => (
            <div
              key={user?._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 p-4 hover:bg-[#E6F4F1] cursor-pointer rounded-2xl transition-colors ${!user?.lastMessage?.seen  ? "bg-green-50" : "bg-green-100 font-semibold"}`}
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
                {user?.userData?.profile_image && user?.userData?.profile_image.trim() !== "" ? (
                  <img 
                    src={user?.userData?.profile_image} 
                    alt={user?.userData?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src="/taskalley.svg" 
                    alt="TaskAlley Logo"
                    className="w-8 h-8 lg:w-10 lg:h-10"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                 {user?.unseenMsg > 0 && <div className="badge bg-[#115E59] w-6 h-6 rounded-full text-white p-2 badge-sm float-end">{user?.unseenMsg}</div>}
                <p className="text-sm lg:text-base font-semibold truncate line-clamp-1">{user?.userData?.name}</p>
                <p className="text-xs lg:text-sm text-gray-500 truncate line-clamp-1">{user?.lastMessage?.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSideNav;