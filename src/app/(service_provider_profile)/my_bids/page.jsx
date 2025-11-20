// MyBids.jsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import srvcporvider from "../../../../public/women.svg";
import popularcateIcon from "../../../../public/popularcate.svg";
import Link from "next/link";
import BidCard from "@/components/Bids/BidCard";
import { useGetMyBidsQuery } from "@/lib/features/bidApi/bidApi";

const bidStatusCategories = [
  {
    name: "OPEN_FOR_BID",
    displayName: "Open for Bid",
    description: "Tasks that are currently open for bidding"
  },
  {
    name: "IN_PROGRESS", 
    displayName: "In Progress",
    description: "Tasks that are currently being worked on"
  },
  {
    name: "COMPLETED",
    displayName: "Completed Tasks",
    description: "Tasks that have been completed"
  },
  {
    name: "CANCELLED",
    displayName: "Cancelled Tasks",
    description: "Tasks that have been cancelled"
  },
  {
    name: "DISPUTE",
    displayName: "Dispute Tasks",
    description: "Tasks that are in dispute"
  },
  {
    name: "LATE",
    displayName: "Late Tasks",
    description: "Tasks that are running late"
  },
  {
    name: "bidMade",
    displayName: "Bids Made",
    description: "Bids you have placed on tasks"
  },
  {
    name: "bidReceived",
    displayName: "Bids Received",
    description: "Bids received on your tasks"
  }
];

const MyBids = () => {
  const [activeTab, setActiveTab] = useState("bidMade");
  const { data, isLoading, error, refetch } = useGetMyBidsQuery(activeTab);

  // Get the display name for the active tab
  const getActiveTabDisplayName = () => {
    const activeCategory = bidStatusCategories.find(cat => cat.name === activeTab);
    return activeCategory ? activeCategory.displayName : activeTab;
  };

  const getActiveTabDescription = () => {
    const activeCategory = bidStatusCategories.find(cat => cat.name === activeTab);
    return activeCategory ? activeCategory.description : "";
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Refresh data when tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  if (isLoading) {
    return (
      <section className="max-w-[1240px] mx-auto px-4 pb-28">
        <div className="flex flex-col gap-8">
          <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
            <div>
              <div className="flex items-center gap-4">
                <Image
                  src={popularcateIcon}
                  alt="Popular Category"
                  height={24}
                  width={24}
                />
                <p className="font-semibold text-md md:text-xl text-color pb-3">
                  My Bids
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-[1240px] mx-auto px-4 pb-28">
        <div className="flex flex-col gap-8">
          <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
            <div>
              <div className="flex items-center gap-4">
                <Image
                  src={popularcateIcon}
                  alt="Popular Category"
                  height={24}
                  width={24}
                />
                <p className="font-semibold text-md md:text-xl text-color pb-3">
                  My Bids
                </p>
              </div>
            </div>
          </div>
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Bids</h2>
            <p className="text-gray-600 mb-4">
              {error?.data?.message || "There was an error loading your bids."}
            </p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-2 bg-[#115e59] text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const tasks = data?.data?.result || [];
  const totalTasks = data?.data?.meta?.total || 0;

  return (
    <section className="max-w-[1240px] mx-auto px-4 pb-28">
      <div className="flex flex-col gap-8">
        <div className="mt-16 md:mt-20 flex flex-col gap-5 md:flex-row justify-between md:items-center">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src={popularcateIcon}
                alt="Popular Category"
                height={24}
                width={24}
              />
              <p className="font-semibold text-md md:text-xl text-color pb-3">
                My Bids
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Manage and track all your bids and tasks in one place
            </p>
          </div>
          
          {/* Summary Stats */}
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-lg font-bold text-[#115e59]">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {bidStatusCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleTabChange(cat.name)}
                className={`px-4 md:px-6 py-2 rounded-md text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                  activeTab === cat.name
                    ? "bg-[#115e59] text-white"
                    : "bg-[#e6f4f1] hover:bg-[#115e59] hover:text-white"
                }`}
              >
                {cat.displayName}
              </button>
            ))}
          </div>

          {/* Active Tab Info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {getActiveTabDisplayName()}
            </h2>
            <p className="text-gray-600">
              {getActiveTabDescription()}
            </p>
          </div>

          {/* Bids Grid */}
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <Image
                  src={srvcporvider}
                  alt="No bids"
                  width={80}
                  height={80}
                  className="mx-auto mb-4 opacity-50"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No {getActiveTabDisplayName()} Found
                </h3>
                <p className="text-gray-600 mb-4">
                  {getActiveTabDescription() || `You don't have any ${getActiveTabDisplayName().toLowerCase()} at the moment.`}
                </p>
                {activeTab === "bidMade" && (
                  <Link 
                    href="/browseservice" 
                    className="inline-block px-6 py-2 bg-[#115e59] text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Browse Tasks to Bid
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Results Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {tasks.length} of {totalTasks} tasks
                </p>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <BidCard key={task._id} task={task} />
                ))}
              </div>

              {/* Pagination - You can implement this later */}
              {data?.data?.meta?.totalPage > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <button className="px-3 py-2 bg-gray-200 rounded-md text-sm">
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm">
                      Page {data.data.meta.page} of {data.data.meta.totalPage}
                    </span>
                    <button className="px-3 py-2 bg-gray-200 rounded-md text-sm">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBids;