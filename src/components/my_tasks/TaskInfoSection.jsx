"use client";
import React from "react";
import { Calendar, MapPin, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/useAuth";

const TaskInfoSection = ({ assignedTo, location, dateLabel, taskDetails, bidsData }) => {
  const router = useRouter();
  const { user } = useAuth();
console.log("taskdetailsddd",taskDetails)
  const handleChatClick = () => {

    if (!taskDetails) {
      router.push("/chat");
      return;
    }


    const status = taskDetails?.status || null;
    if (status && status !== "IN_PROGRESS") {
      toast.info("Chat is available only while the task is In Progress.");
      return;
    }
    const providerId = taskDetails?.provider?._id
    console.log("providerIddddd",providerId)



    const customerId = taskDetails?.customer?._id ;

    let receiverId = null;

    if (providerId && customerId) {

      if (user?._id && (user._id === providerId || user.id === providerId)) {
        receiverId = customerId;
      } else {
        receiverId = providerId;
      }
    } else {
      const fallbackProvider = bidsData?.data?.[0]?.provider?._id || bidsData?.data?.[0]?.provider || null;
      receiverId = providerId || customerId || fallbackProvider || null;
    }

    if (!receiverId) {
      toast.error("Unable to find user to chat with");
      return;
    }

    router.push(`/chat?receiverId=${encodeURIComponent(receiverId)}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between">
      {/* left side */}
      <div>
        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
            <User className="w-4 md:w-6 h-4 md:h-6 text-[#115E59]" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold"> Assigned To</p>
            <p className="text-[#6B7280] text-sm">{assignedTo || "Not assigned"}</p>
          </div>
        </div>
        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
            <MapPin className="text-[#115E59] text-sm md:text-xl" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold"> Location</p>
            <p className="text-[#6B7280] text-sm">{location || "Location not specified"}</p>
          </div>
        </div>
        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3 ">
            <Calendar className="text-[#115E59] text-sm md:text-xl" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold">To Be Done On</p>
            <p className="text-[#6B7280] text-sm">{dateLabel || "Schedule not set"}</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <button
          onClick={handleChatClick}
          disabled={taskDetails?.status && taskDetails.status !== "IN_PROGRESS"}
          className={`px-6 py-2.5 rounded-md transition transform duration-300 hover:scale-105 flex gap-2 items-center justify-center mt-12 ${taskDetails?.status && taskDetails.status !== "IN_PROGRESS" ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-[#115e59] text-white hover:bg-teal-800 cursor-pointer"}`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat Now
        </button>
      </div>
    </div>
  );
};

export default TaskInfoSection;