"use client";
import React, { useState } from "react";
import { Calendar, MapPin, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/useAuth";
import { useSocketContext } from "@/app/context/SocketProvider";

const TaskInfoSection = ({ assignedTo, location, taskDetails, bidsData }) => {
  const router = useRouter();
  const { user } = useAuth();
    const { socket, isConnected ,sendMessageSoket, seenMessage} = useSocketContext();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleChatClick = () => {
    if (!user?.role) {
      toast.error("Please log in to access the chat feature.");
      return;
    }

    setIsModalOpen(true); 
  };

  const handleSend = () => {
     const userID =  user?.role !== "customer" ? taskDetails?.customer?._id : taskDetails?.provider?._id ;
     if(!message.trim()){
      toast.error("Message cannot be empty");
      return;
     }
     if(!userID){
      toast.error("Unable to identify the recipient.");
      return;
     }

   const data =  {
    text:message,
    imageUrl:[""],
    pdfUrl:[""],
    receiver:userID
  }

 const res = sendMessageSoket(data);
 
  setMessage(""); 
  setIsModalOpen(false)
  router.push("/chat")
  };

  return (
    <div className="flex flex-col md:flex-row justify-between">
      {/* LEFT SIDE */}
      <div>
        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
            <User className="w-4 md:w-6 h-4 md:h-6 text-[#115E59]" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold">Assigned To</p>
            <p className="text-[#6B7280] text-sm">{assignedTo || "Not assigned"}</p>
          </div>
        </div>

        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
            <MapPin className="text-[#115E59] text-sm md:text-xl" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold">Location</p>
            <p className="text-[#6B7280] text-sm">{location || "Location not specified"}</p>
          </div>
        </div>

        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3 ">
            <Calendar className="text-[#115E59] text-sm md:text-xl" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold">To Be Done On</p>
            <p className="text-sm text-gray-600">
              {taskDetails?.preferredDeliveryDateTime && (
                <span className="text-sm">
                  {new Date(taskDetails.preferredDeliveryDateTime).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <button
          onClick={handleChatClick}
          disabled={taskDetails?.status && taskDetails.status !== "IN_PROGRESS"}
          className={`px-6 py-2.5 rounded-md transition transform duration-300 hover:scale-105 flex gap-2 items-center justify-center mt-12 ${
            taskDetails?.status && taskDetails.status !== "IN_PROGRESS"
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-[#115e59] text-white hover:bg-teal-800 cursor-pointer"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat Now
        </button>
      </div>

      {/* ✅ CHAT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md p-5 rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Chat Box</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {/* Message Input */}
            <textarea
              className="w-full border rounded-md p-3 h-24 outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            {/* Send Button */}
            <button
              onClick={handleSend}
              className="w-full mt-3 bg-[#115e59] text-white py-2 rounded-md hover:bg-teal-800 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInfoSection;
