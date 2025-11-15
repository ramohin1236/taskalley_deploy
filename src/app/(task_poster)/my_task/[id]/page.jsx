"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import srvcporvider from "../../../../../public/women.svg";
import Bids from "@/components/my_tasks/Bids";
import Progress from "@/components/my_tasks/Progress";
import Completed from "@/components/my_tasks/Completed";
import Cancelled from "@/components/my_tasks/Cancelled";
import { Handshake } from "lucide-react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { useGetTaskByIdQuery } from "@/lib/features/task/taskApi";
import { useGetBidsByTaskIdQuery } from "@/lib/features/bidApi/bidApi";
import ResolutionModal from "@/components/my_tasks/ResolutionModal";

const TaskDetails = () => {
  const params = useParams();
  const taskId = params.id;
  const [currentStatus, setCurrentStatus] = useState("Bids");
  const [showResolutionModal, setShowResolutionModal] = useState(false); // Modal state
  
  const status = ["Bids", "Progress", "Completed", "Cancelled"];
  
  const {
    data: taskData,
    isLoading,
    error
  } = useGetTaskByIdQuery(taskId);
  const taskDetails = taskData?.data;
  console.log(taskDetails)

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

  return (
    <div className="project_container mx-auto px-3 py-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <Link
          href="/my_task"
          className="flex items-center gap-4 ">
          <FaArrowLeftLong className="text-color text-xl font-bold" />
          <p className="font-semibold text-md md:text-xl text-color">
            Back To My Tasks
          </p>
        </Link>

        <div>
          {currentStatus === "Progress" && (
            <div>
              <button
                onClick={() => setShowResolutionModal(true)}
                className="px-6 py-2.5 bg-[#E6F4F1] text-teal-800 border border-teal-800 rounded-md transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-12"
              >
                <Handshake className="text-sm font-semibold" />
                Resolution Center
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h1 className="text-2xl font-bold pb-3">{taskDetails?.title}</h1>
        <p className="text-sm text-gray-500">{taskDetails?._id}</p>

        <div className="flex gap-3 mt-4 flex-col items-start">
          {/* Status badge based on backend status */}
          <p className="py-2 px-4 border text-sm rounded-lg
            bg-[#FFEDD5] text-[#F97316]">
            {taskDetails?.status === "OPEN_FOR_BID" && "Open for bids"}
            {taskDetails?.status === "ASSIGNED" && "Assigned"}
            {taskDetails?.status === "IN_PROGRESS" && "In Progress"}
            {taskDetails?.status === "COMPLETED" && "Completed"}
            {taskDetails?.status === "CANCELLED" && "Cancelled"}
          </p>
          <div className="flex flex-wrap gap-2">
            {
              taskDetails?.task_attachments?.map((img, index) => (
                <Image
                  key={index}
                  src={img || srvcporvider}
                  height={100}
                  width={100}
                  alt="task"
                  className="w-full md:h-96 md:w-96 rounded-lg object-cover"
                />
              ))
            }
          </div>
        </div>

        <div className="mt-4">
          {currentStatus === "Bids" && <Bids taskDetails={taskDetails} bidsData={bidsData}/>}
          {currentStatus === "Progress" && <Progress taskId={taskId} taskDetails={taskDetails} bidsData={bidsData}/>}
          {currentStatus === "Completed" && <Completed taskDetails={taskDetails} bidsData={bidsData} />}
          {currentStatus === "Cancelled" && <Cancelled taskDetails={taskDetails} />}
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