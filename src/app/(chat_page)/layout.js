"use client";
import React, { useState } from "react";
import "../globals.css";
import ChatSideNav from "@/components/chat/ChatSideNav";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Menu, X } from "lucide-react";
import { Toaster } from "sonner";

const ChatLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
      <div className="min-h-screen bg-gray-50">
         <Toaster position="top-right" richColors />
        <div className="mb-8">
          <Navbar />
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-24 left-6 z-50 p-2 rounded-lg bg-[#00786f] shadow-lg"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>

        {/* Main Content */}
        <div className="project_container flex justify-center items-start p-4 pt-20 md:pt-4">
          <div className="w-full flex gap-6 shadow-xl rounded-xl p-4 bg-white min-h-[600px]">
            {/* Sidebar */}
            <div
              className={`fixed top-0 left-0 h-full w-80 bg-white z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:w-96 
              ${open ? "translate-x-0" : "-translate-x-full"} md:block shadow-lg md:shadow-none`}
            >
              <div className="h-full overflow-y-auto">
                <ChatSideNav onMobileItemClick={() => setOpen(false)} />
              </div>
            </div>

            {/* Overlay for mobile */}
            {open && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setOpen(false)}
              />
            )}

            {/* Right Content - Chat Area */}
            <div className="flex-1 h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
              {children}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Footer />
        </div>
      </div>
  );
};

export default ChatLayout;