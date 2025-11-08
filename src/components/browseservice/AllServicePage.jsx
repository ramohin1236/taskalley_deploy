// components/browseservice/AllServicePage.jsx
"use client";
import React from "react";
import { LuMapPin } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { IoTimerOutline } from "react-icons/io5";
import ServiceCard from "@/components/browseservice/ServiceCard";
import userImage from "../../../public/task_img.png";
import Link from "next/link";
import { useGetAllTasksQuery } from "@/lib/features/task/taskApi";

const AllServicePage = () => {
  const { data: tasksData, isLoading, error } = useGetAllTasksQuery({
    page: 1,
    limit: 10,
  });

  const formatTaskData = (task) => {
    return {
      id: task._id,
      userImaage: task.customer?.profile_image || userImage,
      serviceName: task.title,
      category: task.category?.name || "General",
      userName: task.customer?.name || "Unknown User",
      mapIcon: <LuMapPin />,
      place: task.address || task.city || "Location not specified",
      calenderIcon: <SlCalender />,
      city: task.city || "City not specified",
      monthIcon: <IoTimerOutline />,
      month: task.preferredDate 
        ? new Date(task.preferredDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }) + (task.preferredTime ? ` ${task.preferredTime}` : '')
        : "Schedule not set",
      open: task.status === "OPEN_FOR_BID" ? "open" : "closed",
      close: task.status === "OPEN_FOR_BID" ? "close" : "closed",
      price: `$${task.budget || "0"}`,
      description: task.description,
      totalOffer: task.totalOffer || 0,
      status: task.status,
    };
  };

  if (isLoading) {
    return (
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex flex-col gap-4 max-h-[850px] overflow-y-auto">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex flex-col gap-4 shadow-xl rounded-md p-6 bg-gray-100 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5"></div>
            </div>
            <div className="flex gap-1.5 items-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div className="flex gap-1 flex-col">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex items-center justify-center max-h-[850px]">
        <div className="text-red-500 text-center">
          <p>Error loading tasks</p>
          <p className="text-sm">{error?.data?.message || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  const tasks = tasksData?.data?.result || [];

  if (tasks.length === 0) {
    return (
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex items-center justify-center max-h-[850px]">
        <div className="text-gray-500 text-center">
          <p>No tasks available</p>
          <p className="text-sm">Check back later for new tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex flex-col gap-4 max-h-[850px] overflow-y-auto"> 
        {tasks.map((task) => (
          <div key={task._id}>
            <Link href={`/browseservice/${task._id}`}>
              <ServiceCard data={formatTaskData(task)} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllServicePage;