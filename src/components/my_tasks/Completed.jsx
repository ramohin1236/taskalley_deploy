"use client";
import React, { useState } from "react";
import { Check, Calendar } from "lucide-react";
import Image from "next/image";
import { FaCalendar, FaMapPin, FaStar } from "react-icons/fa6";
import { BsChatLeftText } from "react-icons/bs";
import srvcporvider from "../../../public/women.svg";

const Completed = ({ bidsData, taskDetails }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");


  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'pm' : 'am';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "Schedule not set";
    
    const date = formatDate(dateString);
    const time = formatTime(timeString);
    
    return time ? `${date} ${time}` : date;
  };

  const getProviderInfo = () => {
    if (taskDetails?.provider && typeof taskDetails.provider === "object") {
      return {
        name: taskDetails.provider.name,
        profile_image: taskDetails.provider.profile_image || srvcporvider
      };
    }
    
    const providerId = typeof taskDetails?.provider === "string" ? taskDetails.provider : null;
    if (providerId && Array.isArray(bidsData?.data)) {
      const matchedBid = bidsData.data.find(
        (bid) => bid?.provider?._id === providerId
      );
      if (matchedBid?.provider) {
        return {
          name: matchedBid.provider.name,
          profile_image: matchedBid.provider.profile_image || srvcporvider
        };
      }
    }
    
    return {
      name: "Not assigned",
      profile_image: srvcporvider
    };
  };

  const providerInfo = getProviderInfo();

  const steps = [
    { 
      id: 1, 
      label: "Offered", 
      date: taskDetails?.createdAt ? formatDate(taskDetails.createdAt) : "", 
      completed: true 
    },
    {
      id: 2,
      label: "In Progress",
      date: taskDetails?.updatedAt ? formatDate(taskDetails.updatedAt) : "",
      completed: true,
    },
    {
      id: 3,
      label: "Completed on",
      date: taskDetails?.updatedAt ? formatDate(taskDetails.updatedAt) : "",
      completed: true,
    },
  ];

  const progressWidth = "100%";

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between">
        {/* left side */}
        <div>
          <div className="flex mt-8 items-center gap-3">
            <Image 
              src={providerInfo.profile_image} 
              alt="Provider" 
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-base md:text-xl font-semibold">Assigned To</p>
              <p className="text-[#6B7280] text-sm">{providerInfo.name}</p>
            </div>
          </div>
          
          <div className="flex mt-8 items-center gap-3">
            <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
              <FaMapPin className="text-[#115E59] text-sm md:text-xl" />
            </div>
            <div>
              <p className="text-base md:text-xl font-semibold">Location</p>
              <p className="text-[#6B7280] text-sm">
                {taskDetails?.address || taskDetails?.city || "Location not specified"}
              </p>
            </div>
          </div>
          
          <div className="flex mt-8 items-center gap-3">
            <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
              <FaCalendar className="text-[#115E59] text-sm md:text-xl" />
            </div>
            <div>
              <p className="text-base md:text-xl font-semibold">
                To Be Done On
              </p>
              <p className="text-[#6B7280] text-sm">
                {formatDateTime(taskDetails?.preferredDate, taskDetails?.preferredTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div>
          <button className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-12">
            <BsChatLeftText />
            Chat Now
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold">Details</p>
        <p className="text-gray-700">
          {taskDetails?.description || "No description available."}
        </p>
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-4 border-b-2 border-[#dedfe2] pb-4">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Offered Price</p>
          <p className="text-base text-[#6B7280]">
            ₦{taskDetails?.budget ? parseInt(taskDetails.budget).toLocaleString() : "0"}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Discount (0%)</p>
          <p className="text-base text-[#6B7280]">₦ 0</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-[#dedfe2] border-b-2 pb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border w-full max-w-5xl mx-auto">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            <div
              className="absolute top-6 left-0 h-0.5 bg-[#115E59] z-10 transition-all duration-500"
              style={{ width: progressWidth }}
            ></div>

            {/* Steps */}
            <div className="relative z-20 flex justify-between items-start">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center"
                >
                  {/* Circle */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                      ${
                        step.completed
                          ? "bg-[#115E59] border-[#115E59]"
                          : "bg-gray-400 border-gray-400"
                      }
                    `}
                  >
                    {step.completed ? (
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>

                  {/* Label + Date */}
                  <div className="mt-3 min-w-[80px]">
                    <p
                      className={`
                        text-sm font-semibold mb-1 transition-colors duration-300
                        ${step.completed ? "text-gray-900" : "text-gray-400"}
                      `}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <div
                        className={`
                          flex items-center justify-center text-xs
                          ${step.completed ? "text-gray-600" : "text-gray-400"}
                        `}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{step.date}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Attachments */}
      {taskDetails?.task_attachments && taskDetails.task_attachments.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">Task Attachments</p>
          <div className="flex flex-wrap gap-4">
            {taskDetails.task_attachments.map((attachment, index) => (
              <div key={index} className="relative">
                <Image
                  src={attachment}
                  alt={`Task attachment ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-48 h-36 rounded-lg object-cover border"
                />
              </div>
            ))}
          </div>
        </div>
      )}
            
      {/* Review Section */}
      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
        <div className="w-16 h-16 rounded-full overflow-clip">
          <Image
            src={providerInfo.profile_image}
            alt={providerInfo.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">{providerInfo.name}</h4>
            <p className="text-sm text-gray-500">
              {taskDetails?.updatedAt ? formatDate(taskDetails.updatedAt) : ""}
            </p>
          </div>
          <div className="flex gap-1 mt-1 mb-1">
            <FaStar className="text-yellow-400"/>
            <FaStar className="text-yellow-400"/>
            <FaStar className="text-yellow-400"/>
            <FaStar className="text-yellow-400"/>
            <FaStar className="text-yellow-400"/>
          </div>
          <div>
            <p className="text-gray-600 text-sm mt-2">
              The task was completed successfully and met all expectations. {providerInfo.name} was professional 
              and delivered high-quality work within the agreed timeframe. Highly recommended for future tasks!
            </p>
          </div>
        </div>
      </div>

      {/* Feedback section */}
      <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow">
        {!showFeedback ? (
          <button
            onClick={() => setShowFeedback(true)}
            className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer"
          >
            Give Feedback
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback or comments about the completed task..."
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#115e59]"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert(`Feedback submitted: ${feedback}`);
                  setShowFeedback(false);
                  setFeedback("");
                }}
                className="px-6 py-2 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition duration-300 cursor-pointer"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedback("");
                }}
                className="px-6 py-2 border-2 border-[#115e59] rounded-md hover:bg-[#115e59] hover:text-white transition transform duration-300 cursor-pointer text-[#115e59]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Information Summary */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Task Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Task ID:</span> 
            <span className="ml-2 text-blue-700">{taskDetails?._id}</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Category:</span> 
            <span className="ml-2 text-blue-700">{taskDetails?.category?.name}</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Payment Status:</span> 
            <span className="ml-2 text-blue-700">{taskDetails?.paymentStatus}</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Total Offers:</span> 
            <span className="ml-2 text-blue-700">{taskDetails?.totalOffer || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completed;