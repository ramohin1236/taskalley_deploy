"use client";

import { useState } from "react";
import { Calendar, Ban, X } from "lucide-react";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import popularcateIcon from "../../../public/popularcate.svg";
import { toast } from "sonner";
import { useCreateCancellationRequestMutation } from "@/lib/features/cancelApi/cancellationApi";


const ResolutionModal = ({ taskId, taskDetails, onClose }) => {
  const [openModal, setOpenModal] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationDescription, setCancellationDescription] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  console.log("Resolution Modal - Task ID:", taskId);

  const [createCancellationRequest, { isLoading: isCreatingCancellation }] = useCreateCancellationRequestMutation();

  const options = [
    {
      title: "Ask Service Provider to Change Completion Date",
      icon: <Calendar className="w-6 h-6 text-color" />,
      action: () => setOpenModal("date"),
    },
    {
      title: "Request Cancellation",
      icon: <Ban className="w-6 h-6 text-color" />,
      action: () => setOpenModal("cancel"),
    },
  ];

  const handleDateExtensionSubmit = (e) => {
    e.preventDefault();

    const dateValue = e.target.date.value;
    const timeValue = e.target.time.value;
    const reasonValue = e.target.reason.value;

    const info = {
      reason: reasonValue,
      time: timeValue,
      date: dateValue,
    };
    
    localStorage.setItem("extention", JSON.stringify(info));
    toast.success("Date extension request submitted successfully!");
    setOpenModal(null);
  };

  const handleCancellationSubmit = async (e) => {
    e.preventDefault();

    if (!cancellationReason.trim()) {
      toast.error("Please select a cancellation reason");
      return;
    }

    if (!taskId) {
      toast.error("Task ID not found. Please try again from the task page.");
      return;
    }

    try {
      const result = await createCancellationRequest({
        taskId,
        reason: cancellationReason,
        description: cancellationDescription,
        evidence: evidenceFile
      }).unwrap();

      if (result.success) {
        toast.success("Cancellation request created successfully!");
        setOpenModal(null);
        setCancellationReason("");
        setCancellationDescription("");
        setEvidenceFile(null);
        setFilePreview(null);
      }
    } catch (error) {
      console.error("Failed to create cancellation request:", error);
      toast.error(error?.data?.message || "Failed to create cancellation request. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidenceFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setEvidenceFile(null);
    setFilePreview(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + (taskDetails?.preferredTime ? ` ${taskDetails.preferredTime}` : "");
    } catch (error) {
      return "Not set";
    }
  };

  return (
    <>
      {/* Main Resolution Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        ></div>
        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto p-4 md:p-6 z-10 max-h-[95vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 cursor-pointer z-20 bg-white rounded-full p-1 shadow-md"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          {/* Header */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <Image
                src={popularcateIcon}
                alt="Popular Category"
                height={24}
                width={24}
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <p className="font-semibold text-base md:text-xl text-color">
                Resolution Center
              </p>
            </div>
          </div>

          {/* Task Info */}
          <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">Task Information</h3>
            <div className="space-y-1 md:space-y-2">
              <p className="text-blue-700 text-xs md:text-sm">
                <strong>Task ID:</strong> {taskId || "Loading..."}
              </p>
              {taskDetails && (
                <>
                  <p className="text-blue-700 text-xs md:text-sm">
                    <strong>Title:</strong> {taskDetails.title}
                  </p>
                  <p className="text-blue-700 text-xs md:text-sm">
                    <strong>Due Date:</strong> {formatDate(taskDetails.preferredDate)}
                  </p>
                  <p className="text-blue-700 text-xs md:text-sm">
                    <strong>Budget:</strong> ₦{parseInt(taskDetails.budget || 0).toLocaleString()}
                  </p>
                </>
              )}
            </div>
            <p className="text-blue-600 text-xs mt-2">
              Use this center to manage task disputes, cancellations, and date changes.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-4">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={option.action}
                className="w-full flex items-center justify-between bg-[#E6F4F1] p-3 md:p-4 rounded-lg shadow-sm cursor-pointer hover:bg-[#d1f0e8] transition-colors border border-transparent hover:border-[#115E59]"
              >
                <div className="flex items-center gap-3">
                  {option.icon}
                  <span className="text-[#6B7280] text-sm md:text-base font-medium text-left">
                    {option.title}
                  </span>
                </div>
                <span className="text-color text-xl md:text-2xl flex-shrink-0">
                  <IoIosArrowForward />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Change Modal */}
      {openModal === "date" && (
        <div className="fixed inset-0 flex items-center justify-center z-[1100] p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(null)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto p-4 md:p-6 z-10 max-h-[95vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 cursor-pointer bg-white rounded-full p-1 shadow-md"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center text-gray-900 mb-2">
              Request Change Of Task Completion Date
            </h2>
            <p className="text-gray-500 text-center text-xs md:text-sm mb-4 md:mb-6">
              Submit A Request To Update The Agreed Completion Date.
            </p>

            <div className="bg-[#E6F4F1] rounded-lg p-3 md:p-4 flex items-center gap-3 mb-4 md:mb-6">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#115E59]" />
              <div>
                <p className="text-gray-900 font-medium text-sm md:text-base">
                  Current Completion Date
                </p>
                <p className="text-gray-600 text-xs md:text-sm">
                  {formatDate(taskDetails?.preferredDate)}
                </p>
              </div>
            </div>

            <form onSubmit={handleDateExtensionSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                    New Proposed Date *
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:py-3 text-sm focus:ring-2 focus:ring-[#115E59] focus:outline-none text-[#6B7280]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                    New Proposed Time *
                  </label>
                  <input
                    name="time"
                    type="time"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:py-3 text-sm focus:ring-2 focus:ring-[#115E59] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                  Reason for Request *
                </label>
                <textarea
                  name="reason"
                  rows={3}
                  required
                  placeholder="e.g., Need more time for quality work / Client requested delay"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 md:py-3 text-sm focus:ring-2 focus:ring-[#115E59] focus:outline-none text-[#6B7280] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setOpenModal(null)}
                  className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 rounded-lg border border-[#115E59] text-[#115E59] font-medium cursor-pointer hover:bg-emerald-50 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 rounded-lg bg-[#1b867f] text-white font-medium hover:bg-[#115E59] cursor-pointer text-sm md:text-base"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {openModal === "cancel" && (
        <div className="fixed inset-0 flex items-center justify-center z-[1100] p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(null)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto p-4 md:p-6 z-10 max-h-[95vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 cursor-pointer bg-white rounded-full p-1 shadow-md"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center text-gray-900 mb-2">
              Request Task Cancellation
            </h2>
            <p className="text-gray-500 text-center text-xs md:text-sm mb-4 md:mb-6">
              Submit A Cancellation Request With Supporting Details.
            </p>

            <form onSubmit={handleCancellationSubmit} className="space-y-4 md:space-y-5">
              {/* Task ID Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Task ID:</strong> {taskId}
                </p>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                  Reason for Cancellation *
                </label>
                <select 
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 md:py-3 text-sm focus:ring-2 focus:ring-[#115E59] focus:outline-none"
                >
                  <option value="">Select Reason</option>
                  <option value="Personal reasons">Personal Reasons</option>
                  <option value="Technical issues">Technical Issues</option>
                  <option value="Service provider unavailable">Service Provider Unavailable</option>
                  <option value="Budget constraints">Budget Constraints</option>
                  <option value="Changed requirements">Changed Requirements</option>
                  <option value="Poor communication">Poor Communication</option>
                  <option value="Quality concerns">Quality Concerns</option>
                  <option value="Timeline issues">Timeline Issues</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={cancellationDescription}
                  onChange={(e) => setCancellationDescription(e.target.value)}
                  placeholder="Provide detailed explanation for cancellation request..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 md:py-3 text-sm focus:ring-2 focus:ring-[#115E59] focus:outline-none text-[#6B7280] resize-none"
                />
              </div>

              {/* Evidence */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">
                  Evidence (Optional)
                </label>
                
                {/* File Upload Area */}
                {!evidenceFile ? (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-20 md:h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors p-4">
                      <span className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">📎 Click to upload document</span>
                      <span className="text-xs text-gray-500 text-center">
                        Supports: Images, PDF, Word documents
                      </span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-3 md:p-4">
                    {/* File Preview */}
                    {filePreview ? (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                        <div className="relative inline-block">
                          <Image 
                            src={filePreview} 
                            alt="File preview" 
                            width={120}
                            height={120}
                            className="rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-2 md:p-3 rounded">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-gray-400 text-lg">📄</span>
                          <div>
                            <p className="text-sm font-medium text-gray-700 truncate max-w-[150px] md:max-w-none">
                              {evidenceFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700 cursor-pointer flex-shrink-0"
                        >
                          <X size={16} className="md:w-5 md:h-5" />
                        </button>
                      </div>
                    )}
                    
                    {/* Replace file button */}
                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*,.pdf,.doc,.docx';
                        fileInput.onchange = (e) => handleFileChange(e);
                        fileInput.click();
                      }}
                      className="mt-2 text-sm text-[#115E59] hover:text-teal-700 cursor-pointer text-xs md:text-sm"
                    >
                      Replace file
                    </button>
                  </div>
                )}
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-600">
                  ⚠️ Cancelling this task may affect your account rating and refund eligibility. 
                  Please ensure this is necessary before submitting.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(null);
                    setCancellationReason("");
                    setCancellationDescription("");
                    setEvidenceFile(null);
                    setFilePreview(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 rounded-lg border border-[#115E59] cursor-pointer text-[#115E59] font-medium hover:bg-emerald-50 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCancellation || !cancellationReason}
                  className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 rounded-lg bg-[#1b867f] text-white font-medium hover:bg-[#115E59] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isCreatingCancellation ? "Submitting..." : "Submit Cancellation Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ResolutionModal;