"use client";
import { useState } from "react";
import popularcateIcon from "../../../../../public/popularcate.svg";
import Image from "next/image";
import srvcporvider from "../../../../../public/women.svg";
import Bids from "@/components/my_tasks/Bids";
import Progress from "@/components/my_tasks/Progress";
import Completed from "@/components/my_tasks/Completed";
import Cancelled from "@/components/my_tasks/Cancelled";
import { Handshake } from "lucide-react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";

const TaskDetails = () => {
  const status = ["Bids", "Progress", "Completed", "Cancelled"];

  const [currentStatus, setCurrentStatus] = useState("Bids");

  return (
    <div className="project_container mx-auto px-3 py-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <Link
        href="/my_task"
        className="flex items-center gap-4 ">
          <FaArrowLeftLong className="text-color text-xl font-bold"/>
          <p className="font-semibold text-md md:text-xl text-color">
            Back To My Tasks
          </p>
        </Link>
      
        <div>
          {currentStatus === "Progress" && (
            <div>
              {" "}
             
            </div>
          )}
          {currentStatus === "Progress" && (
            <div>
              {" "}
              <Link
                href="/resolution"
                className="px-6 py-2.5 bg-[#E6F4F1] text-teal-800 border border-teal-800 rounded-md  transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-12"
              >
                <Handshake className="text-sm font-semibold"/>
                Resolution Center
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {/* Task Title */}
        <h1 className="text-2xl font-bold">Help move a couch</h1>
        <p className="text-sm text-gray-500">Task ID #1233</p>

        {/* Status + Image */}
        <div className="flex gap-3 mt-4 flex-col items-start">
          <p className="py-2 px-4 border text-sm bg-[#FFEDD5] text-[#F97316] rounded-lg">
            Open for {currentStatus}
          </p>
          <Image
            src={srvcporvider}
            alt="task"
            className="w-40 h-24 rounded-lg object-cover"
          />
        </div>

        {/* Conditional Sections */}
        <div className="mt-4">
          {currentStatus === "Bids" && <Bids />}
          {currentStatus === "Progress" && <Progress />}
          {currentStatus === "Completed" && <Completed />}
          {currentStatus === "Cancelled" && <Cancelled />}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
