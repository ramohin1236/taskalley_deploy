"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";
import { Menu, X } from "lucide-react";
import ProfileSideNav from "@/components/profile/ProfileSideNav";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import StoreProvider from "../StoreProvider";

const ProfileLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when sidebar is open on mobile/tablet
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <Navbar />
      <div className="mb-12 md:max-w-10/12 mx-auto flex justify-center items-center">
        <div className="flex shadow-lg rounded-xl overflow-hidden min-h-[900px] w-full p-4">
          {/* Toggle Button - Now visible for mobile AND tablet */}
          <button
            onClick={toggleSidebar}
            className={`
                lg:hidden fixed top-6 left-6 z-50 
                bg-white hover:bg-gray-50 active:bg-gray-100
                p-3 rounded-xl shadow-lg hover:shadow-xl
                transition-all duration-300 ease-in-out
                transform hover:scale-105 active:scale-95
                border border-gray-200 mt-16
              `}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <div
              className={`transition-transform duration-300 ease-in-out  ${
                open ? "rotate-180" : "rotate-0"
              }`}
            >
              {open ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </div>
          </button>

          {/* Sidebar - Hidden on mobile and tablet, visible on desktop */}
          <div
            className={`
              lg:block
              ${
                open
                  ? `fixed inset-y-0 left-0 z-40 
                   transform transition-all duration-300 ease-out
                   translate-x-0 opacity-100`
                  : "lg:relative lg:translate-x-0 lg:opacity-100 fixed inset-y-0 left-0 z-40 transform -translate-x-full opacity-0 lg:pointer-events-auto pointer-events-none"
              }
            `}
          >
            <ProfileSideNav
              open={open}
              onClose={() => setOpen(false)}
              className="h-full"
            />
          </div>

          {/* Overlay - Visible for mobile and tablet */}
          {open && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden transition-opacity duration-300 ease-out"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Content */}
          <main className="flex-1 bg-white shadow-inner rounded-r-lg">
            <StoreProvider>
              <div className="lg:pt-0 h-full">{children}</div>
            </StoreProvider>
          </main>
        </div>
      </div>
      <div>
        <Footer />
      </div>

      {/* Enhanced styles */}
      <style jsx>{`
        /* Smooth icon transition */
        .icon-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom scrollbar for sidebar */
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }

        /* Tablet specific styles */
        @media (min-width: 768px) and (max-width: 1023px) {
          /* Ensure sidebar takes full height on tablet when open */
          .sidebar-container {
            height: 100vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProfileLayout;
