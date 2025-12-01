"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import srvcporvider from "../../../../../public/women.svg";
import Bids from "@/components/my_tasks/Bids";
import Progress from "@/components/my_tasks/Progress";
import Completed from "@/components/my_tasks/Completed";
import Cancelled from "@/components/my_tasks/Cancelled";
import { Handshake, Calendar, MapPin, DollarSign, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { useGetTaskByIdQuery } from "@/lib/features/task/taskApi";
import { useGetBidsByTaskIdQuery } from "@/lib/features/bidApi/bidApi";
import ResolutionModal from "@/components/my_tasks/ResolutionModal";
import { useGetQuestionsByTaskIdQuery } from "@/lib/features/question/questionApi";

const TaskDetails = () => {
  const params = useParams();
  const taskId = params.id;
  const [currentStatus, setCurrentStatus] = useState("Bids");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: taskData,
    isLoading,
    error
  } = useGetTaskByIdQuery(taskId);
  const taskDetails = taskData?.data;

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions
  } = useGetQuestionsByTaskIdQuery(taskId, {
    skip: !taskId,
  });

  const tabForStatus = useMemo(() => {
    const backendStatus = taskDetails?.status;
    if (!backendStatus) return "Bids";
    switch (backendStatus) {
      case "OPEN_FOR_BID":
        return "Bids";
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "Progress";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "Bids";
    }
  }, [taskDetails?.status]);

  useEffect(() => {
    setCurrentStatus(tabForStatus);
  }, [tabForStatus]);

  const {
    data: bidsData,
    isLoading: isLoadingBids,
    error: bidsError,
    refetch: refetchBids
  } = useGetBidsByTaskIdQuery(taskId);

  // Status badge configuration
  const getStatusConfig = (status) => {
    const config = {
      "OPEN_FOR_BID": { 
        color: "bg-blue-50 text-blue-700 border-blue-200", 
        text: "Open for bids",
        badgeColor: "bg-blue-500"
      },
      "ASSIGNED": { 
        color: "bg-purple-50 text-purple-700 border-purple-200", 
        text: "Assigned",
        badgeColor: "bg-purple-500"
      },
      "IN_PROGRESS": { 
        color: "bg-orange-50 text-orange-700 border-orange-200", 
        text: "In Progress",
        badgeColor: "bg-orange-500"
      },
      "COMPLETED": { 
        color: "bg-green-50 text-green-700 border-green-200", 
        text: "Completed",
        badgeColor: "bg-green-500"
      },
      "CANCELLED": { 
        color: "bg-red-50 text-red-700 border-red-200", 
        text: "Cancelled",
        badgeColor: "bg-red-500"
      }
    };
    return config[status] || config["OPEN_FOR_BID"];
  };

  const statusConfig = getStatusConfig(taskDetails?.status);

  // Get available status tabs based on current backend status
  const getAvailableStatusTabs = () => {
    const backendStatus = taskDetails?.status;
    
    switch (backendStatus) {
      case "OPEN_FOR_BID":
        return ["Bids"];
      case "ASSIGNED":
      case "IN_PROGRESS":
        return ["Progress"];
      case "COMPLETED":
        return ["Completed"];
      case "CANCELLED":
        return ["Cancelled"];
      default:
        return ["Bids"];
    }
  };

  const availableTabs = getAvailableStatusTabs();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Task</h2>
          <p className="text-gray-600 mb-4">Failed to load task details. Please try again.</p>
          <Link
            href="/my_task"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FaArrowLeftLong />
            Back to My Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/my_task"
              className="inline-flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 hover:border-teal-200 group"
            >
              <FaArrowLeftLong className="text-teal-600 text-lg font-bold group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                Back To My Tasks
              </span>
            </Link>
          </div>

          {currentStatus === "Progress" && (
            <button
              onClick={() => setShowResolutionModal(true)}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-teal-800 cursor-pointer group"
            >
              <Handshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Resolution Center</span>
            </button>
          )}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Task Header */}
          <div className="p-6 lg:p-8 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {taskDetails?.title}
                </h1>
                <p className="text-sm text-gray-500 font-mono bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                  {taskDetails?._id}
                </p>
                
                {/* Status and Info Grid */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${statusConfig.color}`}>
                    <div className={`w-2 h-2 rounded-full ${statusConfig.badgeColor} animate-pulse`}></div>
                    {statusConfig.text}
                  </span>
                  
                  {taskDetails?.budget && (
                    <div className="flex items-center gap-2 text-gray-700">
                      
                      <span className="font-semibold text-xl">₦ {taskDetails.budget}</span>
                    </div>
                  )}
                  
                 
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {taskDetails?.task_attachments?.length > 0 && (
            <div className="p-6 lg:p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Attachments</h3>
              
              {/* Main Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={taskDetails.task_attachments[activeImageIndex] || srvcporvider}
                  alt="Task image"
                  width={800}
                  height={400}
                  className="w-full h-64 lg:h-96 object-cover"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              {taskDetails.task_attachments.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {taskDetails.task_attachments.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeImageIndex === index 
                          ? 'border-teal-500 ring-2 ring-teal-200' 
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <Image
                        src={img || srvcporvider}
                        alt={`Task thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Task Description */}
          {taskDetails?.description && (
            <div className="p-6 lg:p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                {taskDetails.description}
              </p>
            </div>
          )}

          {/* Dynamic Content Section */}
          <div className="p-6 lg:p-8">
            <div className="min-h-[400px]">
              {currentStatus === "Bids" && (
                <Bids 
                  taskDetails={taskDetails} 
                  bidsData={bidsData} 
                  questionsData={questionsData}
                />
              )}
              {currentStatus === "Progress" && (
                <Progress 
                  taskId={taskId} 
                  taskDetails={taskDetails} 
                  bidsData={bidsData}
                />
              )}
              {currentStatus === "Completed" && (
                <Completed 
                  taskDetails={taskDetails} 
                  bidsData={bidsData} 
                />
              )}
              {currentStatus === "Cancelled" && (
                <Cancelled 
                  taskDetails={taskDetails} 
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <ResolutionModal 
          taskId={taskId}
          taskDetails={taskDetails}
          onClose={() => setShowResolutionModal(false)}
        />
      )}
    </div>
  );
};

export default TaskDetails;