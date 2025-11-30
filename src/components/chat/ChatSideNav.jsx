// components/chat/ChatSideNav.jsx
"use client";
import { Menu, Search, ArrowLeft } from "lucide-react";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useGetChatListQuery } from "@/lib/features/chatApi/chatApi";
import { useSocket } from "@/components/context/socketProvider";
import { useGetMyProfileQuery } from "@/lib/features/auth/authApi";

const ChatSideNavContent = ({ onMobileItemClick }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { socket, isConnected } = useSocket();
  const { data: profileData } = useGetMyProfileQuery();
  const myUserId = profileData?.data?._id;
  
  const { data: chatListData, isLoading, refetch } = useGetChatListQuery();
  
  // Ensure conversations is always an array - API returns data.data
  const conversations = React.useMemo(() => {
    const responseData = chatListData?.data;
    if (Array.isArray(responseData)) {
      return responseData;
    }
    if (responseData && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    if (responseData && Array.isArray(responseData.conversations)) {
      return responseData.conversations;
    }
    if (responseData && Array.isArray(responseData.list)) {
      return responseData.list;
    }
    return [];
  }, [chatListData]);

  // Listen for conversation updates via socket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const onConversation = () => {
      refetch();
    };

    const onNewMessage = () => {
      // When a new message arrives, refetch chat list to update last message
      refetch();
    };

    const messageEventName = myUserId ? `message-${myUserId}` : null;

    socket.on("conversation", onConversation);
    if (messageEventName) {
      socket.on(messageEventName, onNewMessage);
    }
    // Also listen to general message event
    socket.on("message", onNewMessage);
    
    return () => {
      socket.off("conversation", onConversation);
      if (messageEventName) {
        socket.off(messageEventName, onNewMessage);
      }
      socket.off("message", onNewMessage);
    };
  }, [socket, isConnected, refetch, myUserId]);

  // Filter conversations based on search
  const filteredConversations = React.useMemo(() => {
    if (!Array.isArray(conversations)) return [];
    
    return conversations.filter((conv) => {
      if (!searchQuery) return true;
      const userName = conv?.userData?.name || "";
      const lastMessage = conv?.lastMessage?.text || "";
      return userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  const handleConversationClick = (conversation) => {
    const conversationId = conversation._id;
    const receiverId = conversation?.userData?._id;
    
    if (conversationId) {
      router.push(`/chat?conversationId=${conversationId}${receiverId ? `&receiverId=${receiverId}` : ''}`);
    } else if (receiverId) {
      router.push(`/chat?receiverId=${receiverId}`);
    }
    
    // Mobile view হলে sidebar বন্ধ করুন
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  const formatLastMessage = (message) => {
    if (!message) return "No messages yet";
    if (message.text && message.text.trim()) return message.text;
    if (message.imageUrl && message.imageUrl.length > 0 && message.imageUrl[0] && message.imageUrl[0].trim() !== "") return "📷 Image";
    if (message.pdfUrl && message.pdfUrl.length > 0 && message.pdfUrl[0] && message.pdfUrl[0].trim() !== "") return "📄 PDF";
    if (message.videoUrl && message.videoUrl.length > 0 && message.videoUrl[0] && message.videoUrl[0].trim() !== "") return "🎥 Video";
    return "No messages yet";
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
    return date.toLocaleDateString();
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#115e59] focus:border-transparent bg-[#E6F4F1] text-gray-600"
            />
          </div>
        </div>

        {/* Scrollable Chat List Container */}
        <div className="w-full max-h-[calc(100vh-280px)] lg:max-h-[650px] overflow-y-auto px-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500">Loading conversations...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500 text-center">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </div>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const userData = conversation?.userData || {};
              const lastMessage = conversation?.lastMessage;
              const unseenCount = conversation?.unseenMsg || 0;
              const isActive = searchParams?.get("conversationId") === conversation._id;
              
              return (
                <div
                  key={conversation._id}
                  onClick={() => handleConversationClick(conversation)}
                  className={`flex items-center gap-3 p-4 hover:bg-[#E6F4F1] cursor-pointer rounded-2xl transition-colors ${
                    isActive ? "bg-[#E6F4F1] border-l-4 border-[#115e59]" : ""
                  }`}
                >
                  <div className="relative w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                    <img
                      src={userData?.profile_image || userData?.profileImage || "https://i.pravatar.cc/150?img=1"}
                      className="rounded-full w-full h-full object-cover"
                      alt={userData?.name || "User"}
                    />
                    {unseenCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unseenCount > 9 ? "9+" : unseenCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base lg:text-xl font-semibold truncate">
                        {userData?.name || "Unknown User"}
                      </p>
                      {lastMessage?.createdAt && (
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatTime(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs lg:text-sm text-gray-500 truncate flex-1">
                        {formatLastMessage(lastMessage)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

const ChatSideNav = ({ onMobileItemClick }) => {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading conversations...</div>}>
      <ChatSideNavContent onMobileItemClick={onMobileItemClick} />
    </Suspense>
  );
};

export default ChatSideNav;