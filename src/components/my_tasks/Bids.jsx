import React, { useState } from 'react'
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { BsChatLeftText } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa6";
import srvcporvider from "../../../public/women.svg";
import Image from 'next/image';
import { toast } from "sonner";
import { useAcceptBidMutation } from '@/lib/features/bidApi/bidApi';
import { useAuth } from '@/components/auth/useAuth';

const questions = [
  {
    id: 1,
    name: "Ronald Richards",
    date: "24 January, 2023",
    message:
      "I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase!",
  },
  {
    id: 2,
    name: "Ronald Richards",
    date: "24 January, 2023",
    message:
      "Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?Does this task include moving the couch upstairs too, or just ground floor?",
  },
];

const Bids = ({ taskDetails, bidsData, questionsData }) => {
 
  const info = bidsData?.data.result

  const [activeTab, setActiveTab] = useState("bids");
  const [acceptBid, { isLoading: isAcceptingBid }] = useAcceptBidMutation();
  
  const [taskStatus, setTaskStatus] = useState(taskDetails?.status || "OPEN_FOR_BID");
  const { user } = useAuth();
  const router = useRouter();

  const handleAcceptBid = async (bidId) => {
    if (taskStatus !== "OPEN_FOR_BID") {
      toast.error("Task is no longer open for bids.");
      return;
    }
    if (!confirm("Are you sure you want to accept this bid?")) return;
    try {
      const result = await acceptBid({ bidID: bidId }).unwrap();
      console.log("new url",result)
      if (result?.success) {
        console.log("Bid accept response:", result);
        const paymentLink = result?.data?.paymentLink;
        const reference = result?.data?.reference;

        toast.success(
          paymentLink
            ? "Bid accepted! Redirecting to payment..."
            : "Bid accepted successfully!",
          {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
            duration: 3500,
          }
        );

        if (paymentLink && typeof window !== "undefined") {
          window.open(paymentLink, "_blank");
        }

        if (reference) {
          console.log("Payment reference:", reference);
        }

        setTaskStatus(result?.data?.status || "IN_PROGRESS");
      }
    } catch (error) {
      console.error("Failed to accept bid:", error);
      toast.error(error?.data?.message || "Failed to accept bid. Please try again.", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #ef4444",
        },
        duration: 3000,
      });
    }
  };

  const handleChatClick = (bid) => {
    console.log("clickk",bid)
   
    if ((taskStatus || taskDetails?.status) !== "IN_PROGRESS") {
      toast.info("Chat is available only while the task is In Progress.");
      return;
    }

    // Determine receiverId - pick the other participant (not the current user)
    const providerId = bid?.provider?._id || bid?.provider || bid?.providerId;
    const customerId = taskDetails?.customer?._id || taskDetails?.customer || taskDetails?.customerId;
    let resolvedReceiverId = null;
    // If both exist, prefer the other user
    if (providerId && customerId) {
      resolvedReceiverId = (providerId === user?._id || providerId === user?.id) ? customerId : providerId;
    } else {
      resolvedReceiverId = providerId || customerId;
    }
    const receiverId = resolvedReceiverId;

    if (!receiverId) {
      toast.error("Unable to find user to chat with");
      return;
    }

    // Navigate to chat page with receiverId
    router.push(`/chat?receiverId=${receiverId}`);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8 border rounded-2xl p-6 bg-white shadow mt-8 items-center">
        {/* Left side */}
        <div className="flex-1 space-y-6">
          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex items-center justify-center">
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">Location</p>
              <p className="text-sm text-gray-600">{taskDetails?.address}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex items-center justify-center">
              <MdDateRange size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">
                To Be Done On
              </p>
              <p className="text-sm text-gray-600">
                {taskDetails?.preferredDate
                  ? new Date(taskDetails.preferredDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "No date selected"}
              </p>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-black">
              Details
            </h3>
            <p className="text-gray-600 text-sm leading-6">
              {taskDetails?.description}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-auto">
          <div className="bg-[#E6F4F1] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="mb-4">
              <p className="text-gray-500">Task budget</p>
              <p className="text-2xl font-bold text-black">₦ {taskDetails?.budget}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button className="px-6 py-2 border-2 border-[#115e59] rounded-md hover:bg-[#115e59] hover:text-white transition transform duration-300 cursor-pointer">
                Edit Task
              </button>
              <button
                href="/construction"
                className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer"
              >
                Remove Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-3 ">
        <button
          onClick={() => setActiveTab("bids")}
          className={`pb-2 ${activeTab === "bids"
              ? "border-b-2 bg-[#115E59] px-6 rounded-md py-2 text-white cursor-pointer"
              : "text-black bg-[#E6F4F1] px-6 rounded-md py-2 cursor-pointer"
            }`}
        >
          Bids
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-2 ${activeTab === "questions"
              ? "border-b-2 bg-[#115E59] px-6 rounded-md py-2 text-white cursor-pointer"
              : "text-black bg-[#E6F4F1] px-6 rounded-md py-2 cursor-pointer"
            }`}
        >
          Questions
        </button>
      </div>

      {/* Bids / Questions */}
      <div className="mt-4 space-y-4">
        {activeTab === "bids" &&
          info?.map((bid) => (
            <div
              key={bid._id || bid.id}
              className="flex flex-col lg:flex-row gap-4 p-4 border rounded-lg"
            >
              {/* left side */}
              <div className="flex flex-col justify-between gap-10 bg-[#E6F4F1] rounded-xl px-4 py-4 ">
                <div className="flex flex-wrap lg:justify-between items-center gap-4 md:gap-8">
                  <div className="w-14 h-14 md:w-24 md:h-24  rounded-full overflow-clip">
                    <Image
                      src={srvcporvider}
                      alt={bid.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="">
                    <h4 className="font-semibold md:text-xl">{bid?.provider.name}</h4>
                    <p className="flex items-center text-gray-500 gap-1 text-sm md:text-base">
                      <FaStar className="text-yellow-500 text-sm md:text-base" />{" "}
                      (0 Reviews)
                    </p>
                  </div>
                  <div>
                    {" "}
                    <p className="font-semibold text-xl md:text-3xl">
                     ₦ {bid.price}
                    </p>
                  </div>
                </div>
                {/* accept and chat button */}
                <div className="flex flex-col sm:flex-row gap-3  ">
                  {taskStatus === "OPEN_FOR_BID" && (
                    <button
                      onClick={() => handleAcceptBid(bid._id)}
                      disabled={isAcceptingBid}
                      className={`px-6 py-2 border-2 rounded-md transition transform duration-300 ${
                        !isAcceptingBid
                          ? "border-[#115e59] text-[#115e59] hover:bg-[#115e59] hover:text-white cursor-pointer"
                          : "border-gray-300 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isAcceptingBid ? "Accepting..." : "Accept the Bid"}
                    </button>
                  )}
                  <button
                    onClick={() => handleChatClick(bid)}
                    className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center"
                  >
                    <BsChatLeftText />
                    Chat Now
                  </button>
                </div>
              </div>
              {/* right side */}

              <div className="flex-1">
                <p className="text-gray-600 text-sm mt-2">{bid.details}</p>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-500">{bid.date}</p>
                </div>
                <div className="flex flex-col md:flex-row  justify-between md:items-center mt-16 gap-5"></div>
              </div>
            </div>
          ))}

        {activeTab === "questions" &&
          questionsData?.data?.map((q) => (
            <div
            key={q._id}
            className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Image
              src={q?.provider?.profile_image || q?.user?.profileImage }
              alt={q?.user?.name || "User"}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">
                  {q?.provider?.name || "Anonymous"}
                </h3>
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(q.createdAt)}
                </span>
              </div>

              {/* Question */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-1">Q:</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {q.details}
                </p>
                
                {/* Question Image */}
                {q.question_image && (
                  <div className="mt-2">
                    <img
                      src={q.question_image}
                      alt="Question attachment"
                      className="max-w-xs rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Answer */}
              {q.answer && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-green-700">
                      Task Poster Response:
                    </span>
                    {q.answeredAt && (
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(q.answeredAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {q.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
          ))}
      </div>
    </div>
  )
}

export default Bids