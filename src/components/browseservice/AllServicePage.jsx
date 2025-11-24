"use client";
import React from "react";
import ServiceCard from "@/components/browseservice/ServiceCard";
import userImage from "../../../public/task_img.png";
import Link from "next/link";
import { useGetAllTasksQuery } from "@/lib/features/task/taskApi";
import { usePathname } from 'next/navigation';

const AllServicePage = ({ filters }) => {
  const pathname = usePathname();
  const currentTaskId = pathname.split('/').pop(); 
  const {
    data: tasksData,
    isLoading,
    error,
  } = useGetAllTasksQuery({
    page: 1,
    limit: 100,
    searchTerm: filters.search || "",
    category: filters.category || "",
    sortBy: filters.sort || "",
  });

const filteredTasks = React.useMemo(() => {
  if (!tasksData?.data?.result) return [];
  
  let tasks = tasksData.data.result;
  
  // Price filter
  if (filters.minPrice || filters.maxPrice) {
    tasks = tasks.filter(task => {
      const taskBudget = task.budget || 0;
      const minPrice = parseInt(filters.minPrice) || 0;
      const maxPrice = parseInt(filters.maxPrice) || Infinity;
      
      return taskBudget >= minPrice && taskBudget <= maxPrice;
    });
  }
  
  // Location and distance filter
  if (filters.location && filters.location.location) {
    const searchLocation = filters.location.location.toLowerCase();
    const searchDistance = filters.location.distance || 20;
    
    tasks = tasks.filter(task => {
      const taskLocation = (task.city + ' ' + task.address).toLowerCase();
      return taskLocation.includes(searchLocation);
      // এখানে actual distance calculation logic add করতে পারেন
    });
  }
  
  return tasks;
}, [tasksData, filters]);


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
        ? new Date(task.preferredDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
        : "Schedule not set",
      open: task.status === "OPEN_FOR_BID" ? "open" : "closed",
      close: task.status === "OPEN_FOR_BID" ? "close" : "closed",
      price: `$${task.budget || "0"}`,
      description: task.description,
      totalOffer: task.totalOffer || 0,
      status: task.status,
    };
  };

  // if (isLoading) {
  // }

  // if (error) {
  // }

  const tasks = filteredTasks;

  if (tasks.length === 0) {
    return (
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex items-center justify-center max-h-[850px]">
        <div className="text-gray-500 text-center">
          <p>No tasks found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex flex-col gap-4 max-h-[850px] overflow-y-auto">
        {tasks.map((task) => (
          <div key={task._id}>
            <Link href={`/browseservice/${task?._id}`}>
              <ServiceCard 
                task={task} 
                isActive={currentTaskId === task?._id}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllServicePage;