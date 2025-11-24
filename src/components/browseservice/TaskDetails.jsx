"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  CheckCircle,
  Clock,
  XCircle,
  ImageIcon,
  X,
} from "lucide-react";
import client from "../../../public/client.png";
import Image from "next/image";
import Link from "next/link";
import BidModal from "@/components/browseservice/BidModal";
import {
  useAcceptBidMutation,
  useCreateBidMutation,
  useGetBidsByTaskIdQuery,
} from "@/lib/features/bidApi/bidApi";
import {
  useCreateQuestionMutation,
  useGetQuestionsByTaskIdQuery,
} from "@/lib/features/question/questionApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const TaskDetails = ({ task }) => {
  const [contentTab, setContentTab] = useState("Bids");
  const [taskStatus, setTaskStatus] = useState(task?.status || "OPEN_FOR_BID");
  const [newQuestion, setNewQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const role = useSelector((state) => state?.auth?.user?.role);

  const [createBid, { isLoading: isSubmittingBid }] = useCreateBidMutation();
  const [acceptBid, { isLoading: isAcceptingBid }] = useAcceptBidMutation();
  const [createQuestion, { isLoading: isSubmittingQuestion }] = useCreateQuestionMutation();

  const {
    data: bidsData,
    isLoading: isLoadingBids,
    error: bidsError,
    refetch: refetchBids
  } = useGetBidsByTaskIdQuery(task?._id);

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions
  } = useGetQuestionsByTaskIdQuery(task?._id, {
    skip: !task?._id,
  });
  const taskData = {
    title: task?.title || "Task Title",
    poster: {
      name: task?.customer?.name || "Customer",
      profile_image: task?.customer?.profile_image || client,
    },
    location: task?.city || task?.address || "Location not specified",
    dueDate: task?.preferredDate
      ? new Date(task.preferredDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
      : "Schedule not set",
    budget: task?.budget?.toString() || "0",
    description: task?.description || "No description available.",
    category: task?.category?.name || "General",
    status: task?.status || "OPEN_FOR_BID",
    totalOffer: task?.totalOffer || 0,
    createdAt: task?.createdAt
      ? new Date(task.createdAt).toLocaleDateString()
      : "Recently",
  };

  const bids = bidsData?.data.result || [];

  const questions = questionsData?.data || questionsData || [];

  const contentTabs = ["Bids", "Questions"];

  const handleBidSubmit = async (bidData) => {
    try {
      const result = await createBid(bidData).unwrap();

      if (result.success) {
       
        toast.success("Bid send successfull!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        setIsBidModalOpen(false);

        refetchBids();
      }
    } catch (error) {
      console.error("Failed to submit bid:", error);
      toast.error(
        error?.data?.message || "Failed to submit bid. Please try again.",
        {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        }
      );
    }
  };

  const handleAcceptBid = async (bidId) => {
    if ((taskStatus || taskData.status) !== "OPEN_FOR_BID") {
      toast.error("Task is no longer open for bids.");
      return;
    }
    if (!confirm("Are you sure you want to accept this bid?")) return;

    try {
      // API expects body: { bidID }
      const result = await acceptBid({ bidID: bidId }).unwrap();

      if (result.success) {
       
        toast.success("Bid accepted successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        // Update local task status to reflect UI change
        setTaskStatus(result?.data?.status || "IN_PROGRESS");
        refetchBids();
      }
    } catch (error) {
      console.error("Failed to accept bid:", error);
      toast.error(
        error?.data?.message || "Failed to accept bid. Please try again.",
        {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        }
      );
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG, GIF, WEBP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setQuestionImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setQuestionImage(null);
    setQuestionImagePreview(null);
  };

  const handleQuestionSubmit = async () => {
    if (!newQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      const formData = new FormData();
      
      // Create data object
      const questionData = {
        task: task?._id,
        details: newQuestion.trim()
      };
      
      // Append data as JSON string
      formData.append('data', JSON.stringify(questionData));
      
      // Append image if selected
      if (questionImage) {
        formData.append('question_image', questionImage);
      }

      const result = await createQuestion(formData).unwrap();

      if (result.success) {
        toast.success("Question submitted successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        
        // Reset form
        setNewQuestion("");
        setQuestionImage(null);
        setQuestionImagePreview(null);
        
        // Refetch questions
        refetchQuestions();
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
      toast.error(
        error?.data?.message || "Failed to submit question. Please try again.",
        {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        }
      );
    }
  };

  const getStatusConfig = (status) => {
    const statusConfigs = {
      OPEN_FOR_BID: {
        label: "Open for bids",
        color: "bg-orange-100 text-orange-600 border-orange-200",
        icon: <Clock className="w-4 h-4" />,
      },
      IN_PROGRESS: {
        label: "In Progress",
        color: "bg-blue-100 text-blue-600 border-blue-200",
        icon: <MessageCircle className="w-4 h-4" />,
      },
      COMPLETED: {
        label: "Completed",
        color: "bg-green-100 text-green-600 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      CANCELLED: {
        label: "Cancelled",
        color: "bg-red-100 text-red-600 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
      },
      ASSIGNED: {
        label: "Assigned",
        color: "bg-purple-100 text-purple-600 border-purple-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
    };

    return statusConfigs[status] || statusConfigs["OPEN_FOR_BID"];
  };

  const currentStatusConfig = getStatusConfig(taskStatus || taskData.status);

  // Format date function
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <Link className="flex items-center" href="/browseservice">
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-[#115e59] font-semibold">
            Back To Map
          </span>
        </Link>
      </div>

      {/* Dynamic Status Display */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${currentStatusConfig.color}`}
        >
          {currentStatusConfig.icon}
          {currentStatusConfig.label}
        </div>
      </div>

      {/* Task Header */}
      <div className="p-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {taskData.title}
        </h1>

        {/* Category Badge */}
        <div className="mb-6">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {taskData.category}
          </span>
        </div>

        {/* Poster Info */}
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={taskData.poster.profile_image}
            alt={taskData.poster.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-gray-500">Posted by</p>
            <p className="text-sm font-medium text-gray-900">
              {taskData.poster.name}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
            <MapPin className="w-4 h-4 text-[#115E59]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm text-gray-900">{taskData.location}</p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
            <Calendar className="w-4 h-4 text-[#115E59]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">To Be Done On</p>
            <p className="text-sm text-gray-900">{taskData.dueDate}</p>
          </div>
        </div>

        {/* Task Description */}
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Task Details
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {taskData.description}
          </p>
        </div>

        {/* Budget and Action */}
        <div className="flex justify-between items-center border-t pt-6">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Task budget
            </p>
            <p className="text-2xl font-bold text-gray-900">
              ₦{parseInt(taskData.budget).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {bids.length} bids received
            </p>
          </div>

          <div>
            {
              role === "provider" ? (<button
                onClick={() => setIsBidModalOpen(true)}
                className="bg-[#115E59] hover:bg-teal-700 cursor-pointer text-white py-3 px-8 rounded-lg font-medium transition-colors"
              >
                Submit A Bid
              </button>) : (<></>)
            }

          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200 sticky top-16 z-10">
        {contentTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setContentTab(tab)}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${contentTab === tab
                ? "text-white bg-[#115E59] cursor-pointer border-b-2 border-[#115E59]"
                : "text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {contentTab === "Bids" ? (
        <div>
          {/* Loading State */}
          {isLoadingBids && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* Error State */}
          {bidsError && (
            <div className="text-center py-8">
              <p className="text-gray-600">Failed to load bids.</p>
              <button
                onClick={refetchBids}
                className="mt-2 px-4 py-2 bg-[#115E59] text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Bids List */}
          {!isLoadingBids && !bidsError && (
            <>
              {bids?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No bids yet. Be the first to bid on this task!</p>
                </div>
              ) : (
                bids?.map((bid) => (
                  <div
                    key={bid._id}
                    className="flex gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <Image
                      src={bid?.provider?.profile_image || client}
                      alt={bid?.provider?.name || "Provider"}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {bid?.provider?.name || "Anonymous"}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(bid.createdAt)}
                        </span>
                       
                      </div>
                           <p className=" text-gray-400 text-xl mb-2">
                          ₦ {bid.price}
                        </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {bid?.provider?.rating || "0"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({bid?.provider?.reviewCount || "0"} Reviews)
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {bid.details || "No message provided."}
                      </p>

                      {/* Customer Accept Bid Action */}
                      {role === "customer" && (taskStatus || taskData.status) === "OPEN_FOR_BID" && (
                        <div className="mt-2">
                          <button
                            onClick={() => handleAcceptBid(bid._id)}
                            disabled={isAcceptingBid}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              !isAcceptingBid
                                ? "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {isAcceptingBid ? "Accepting..." : "Accept Bid"}
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-white">
          {/* Ask Question Form */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Image
                src={client}
                alt="Your profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask a question about this task..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#115E59] focus:border-transparent"
                  rows="3"
                />
                
                {/* Image Upload Section */}
                <div className="mt-3">
                  {questionImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={questionImagePreview}
                        alt="Question preview"
                        className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex justify-end items-center mt-3">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={!newQuestion.trim() || isSubmittingQuestion}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      newQuestion.trim() && !isSubmittingQuestion
                        ? "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isSubmittingQuestion ? "Submitting..." : "Send Question"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div>
            {/* Loading State */}
            {isLoadingQuestions && (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            )}

            {/* Error State */}
            {questionsError && (
              <div className="text-center py-8">
                <p className="text-gray-600">Failed to load questions.</p>
                <button
                  onClick={refetchQuestions}
                  className="mt-2 px-4 py-2 bg-[#115E59] text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Questions List */}
            {!isLoadingQuestions && !questionsError && (
              <>
                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No questions yet. Be the first to ask a question!</p>
                  </div>
                ) : (
                  questions.map((question) => (
                    <div
                      key={question._id}
                      className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <Image
                        src={question?.provider?.profile_image || question?.user?.profileImage || client}
                        alt={question?.user?.name || "User"}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {question?.provider?.name || "Anonymous"}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(question.createdAt)}
                          </span>
                        </div>

                        {/* Question */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-800 mb-1">Q:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {question.details}
                          </p>
                          
                          {/* Question Image */}
                          {question.question_image && (
                            <div className="mt-2">
                              <img
                                src={question.question_image}
                                alt="Question attachment"
                                className="max-w-xs rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                        </div>

                        {/* Answer */}
                        {question.answer && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-green-700">
                                Task Poster Response:
                              </span>
                              {question.answeredAt && (
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(question.answeredAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {question.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Bid Modal */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        task={task}
        onSubmit={handleBidSubmit}
        isLoading={isSubmittingBid}
      />
    </div>
  );
};

export default TaskDetails;