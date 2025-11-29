"use client";
import React, { useState } from "react";
import { Check, GitPullRequest, X, Download, Eye } from "lucide-react";
import Image from "next/image";
import client from "../../../public/client.png";
import { useGetCancellationRequestByTaskQuery } from "@/lib/features/cancelApi/cancellationApi";


const CancellationStatusComponent = ({ taskId, taskDetails, isServiceProvider = false }) => {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  
  // Fetch cancellation request data from API
  const { 
    data: cancellationData, 
    isLoading, 
    error 
  } = useGetCancellationRequestByTaskQuery(taskId);

  const cancellationRequest = cancellationData?.data;

  // console.log("Cancellation Request Data:", cancellationRequest);

  if (!cancellationRequest || cancellationRequest.status !== "PENDING") {
    return null;
  }

  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isPDFFile = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf');
  };

  const getFileType = (url) => {
    if (isImageFile(url)) return 'image';
    if (isPDFFile(url)) return 'pdf';
    return 'document';
  };

  const handlePreviewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };

  const handleDownloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'evidence-file';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "PENDING":
        return {
          statusText: "In Progress",
          statusColor: "text-blue-600",
          button: {
            text: "View Request Details",
            color: "bg-[#115e59] hover:bg-teal-700",
          },
        };
      case "ACCEPTED":
        return {
          statusText: "Accepted By Service Provider",
          statusColor: "text-green-600",
          button: {
            text: "Request For Refund",
            color: "bg-[#115e59] hover:bg-teal-700",
          },
        };
      case "REJECTED":
        return {
          statusText: "Rejected By Service Provider",
          statusColor: "text-red-600",
          button: {
            text: "Request Ruling on Dispute",
            color: "bg-[#115E59] hover:bg-teal-700",
          },
        };
      default:
        return {
          statusText: "In Progress",
          statusColor: "text-blue-600",
          button: {
            text: "View Details",
            color: "bg-[#115e59] hover:bg-teal-700",
          },
        };
    }
  };

  const statusDisplay = getStatusDisplay(cancellationRequest.status);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <>
      <div className="bg-[#E6F4F1] rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-white rounded-full p-2 hidden lg:block">
            <GitPullRequest className="w-5 h-5 text-[#115E59]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cancellation Request Status
            </h3>

            {/* Requested By Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-16 h-16">
                  <Image 
                    src={cancellationRequest.requestedBy?.profile_image || client} 
                    alt="requester" 
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Requested By</p>
                  <p className="text-gray-600 text-sm">
                    {cancellationRequest.requestedBy?.name || "Customer"}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {formatDate(cancellationRequest.createdAt)}
              </p>
            </div>

            {/* Cancellation Reason */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Cancellation Reason
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {cancellationRequest.reason}
              </p>
              {cancellationRequest.description && (
                <div className="mt-3">
                  <h5 className="font-medium text-gray-900 mb-1">Additional Description:</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {cancellationRequest.description}
                  </p>
                </div>
              )}
            </div>

            {/* Evidence Display with Preview */}
            {cancellationRequest.evidence && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Supporting Evidence
                </h4>
                <div className="rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Image Preview */}
                    {isImageFile(cancellationRequest.evidence) && (
                      <div className="flex-shrink-0">
                        <div 
                          className="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-[#115E59] transition-colors"
                          onClick={() => handlePreviewImage(cancellationRequest.evidence)}
                        >
                          <Image 
                            src={cancellationRequest.evidence} 
                            alt="Evidence preview" 
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">Click to enlarge</p>
                      </div>
                    )}
                    
                    {/* File Info and Actions */}
                    <div className="flex-1">
                      {/* PDF Preview Placeholder */}
                      {isPDFFile(cancellationRequest.evidence) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <span className="text-red-500 text-lg">📄</span>
                            <div>
                              <p className="text-sm font-medium text-gray-700">PDF Document</p>
                              <p className="text-xs text-gray-500">Click download to view the PDF file</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Other Document Types */}
                      {!isImageFile(cancellationRequest.evidence) && !isPDFFile(cancellationRequest.evidence) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-lg">📎</span>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Document File</p>
                              <p className="text-xs text-gray-500">Click download to view the file</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div className="w-6 h-6 bg-[#115E59] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Cancellation Status
                  </p>
                  <p className={`text-sm ${statusDisplay.statusColor}`}>
                    {statusDisplay.statusText}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Last updated: {formatDate(cancellationRequest.updatedAt)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className={`px-6 py-2.5 text-white rounded-md transition-colors font-medium cursor-pointer ${statusDisplay.button.color}`}>
                {statusDisplay.button.text}
              </button>

              {/* Service Provider Actions */}
              {isServiceProvider && cancellationRequest.status === "PENDING" && (
                <>
                  <button className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium cursor-pointer">
                    Accept Request
                  </button>
                  <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium cursor-pointer">
                    Reject Request
                  </button>
                </>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#115E59]"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-700 text-sm">
                  Failed to load cancellation request details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 cursor-pointer z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden">
              <Image 
                src={selectedImage} 
                alt="Evidence preview" 
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            
            {/* Download button in modal */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleDownloadFile(selectedImage, `evidence-image-${taskId}`)}
                className="flex items-center gap-2 px-4 py-2 bg-[#115E59] text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CancellationStatusComponent;