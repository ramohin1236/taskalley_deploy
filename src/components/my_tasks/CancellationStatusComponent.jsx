"use client";
import React, { useState } from "react";
import { Check, GitPullRequest, X, Download } from "lucide-react";
import Image from "next/image";
import client from "../../../public/client.png";
import {
  useGetCancellationRequestByTaskQuery,
  useDeleteCancellationRequestMutation,
  useAcceptCancellationRequestMutation,
  useRejectCancellationRequestMutation
} from "@/lib/features/cancelApi/cancellationApi";
import { toast } from "sonner";

// ==================== Helper Components ====================

const StatusIcon = ({ status }) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return (
        <div className="animate-pulse w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      );
    case "ACCEPTED":
      return (
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      );
    case "REJECTED":
      return (
        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">?</span>
        </div>
      );
  }
};

const FilePreview = ({ url, name, onDownload, onPreview }) => {
  const getFileIcon = () => {
    if (!url) return "📎";
    if (url.includes(".pdf")) return "📄";
    if (["jpg", "jpeg", "png", "gif", "webp"].some(ext => url.includes(ext))) return "🖼️";
    return "📎";
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
      <span className="text-gray-500">{getFileIcon()}</span>
      <span className="text-sm text-gray-600">{name}</span>
      {onPreview && (
        <button
          onClick={onPreview}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Preview
        </button>
      )}
      {onDownload && (
        <button
          onClick={onDownload}
          className="text-xs text-[#115E59] hover:text-teal-700"
        >
          Download
        </button>
      )}
    </div>
  );
};

const ActionButton = ({ onClick, variant = "primary", children, className = "" }) => {
  const baseClasses = "px-6 py-2.5 text-white rounded-md transition-colors font-medium cursor-pointer";
  
  const variantClasses = {
    primary: "bg-[#115e59] hover:bg-teal-700",
    accept: "bg-green-600 hover:bg-green-700",
    reject: "bg-red-600 hover:bg-red-700",
    delete: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// ==================== Main Component ====================

const CancellationStatusComponent = ({ taskId, isServiceProvider = false }) => {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  // API Hooks
  const { data: cancellationResponse, isLoading, error, refetch } = useGetCancellationRequestByTaskQuery(taskId);
  const [deleteCancellationRequest] = useDeleteCancellationRequestMutation();
  const [acceptCancellationRequest] = useAcceptCancellationRequestMutation();
  const [rejectCancellationRequest] = useRejectCancellationRequestMutation();

  const cancellationRequest = cancellationResponse?.data;
  console.log("Cancellation Request:", cancellationRequest)
  
  // Hide component if deleted or no request
  if (isDeleted || !cancellationRequest?._id) return null;

  // ==================== Helper Functions ====================

  const getStatusConfig = (status, requestToModel) => {
    const statusUpper = status?.toUpperCase();
    const isPending = statusUpper === "PENDING";
    const isToProvider = requestToModel === "Provider";
    
    return {
      PENDING: {
        statusText: isToProvider ? "Pending Provider Review" : "Pending Customer Review",
        statusColor: "text-yellow-600",
        bgColor: "bg-[#E6F4F1]",
        canAcceptReject: (isServiceProvider && isToProvider) || (!isServiceProvider && !isToProvider),
        canDelete: (isServiceProvider && !isToProvider) || (!isServiceProvider && isToProvider),
      },
      ACCEPTED: {
        statusText: "Request Accepted",
        statusColor: "text-green-600",
        bgColor: "bg-green-100",
        actions: [{ label: "Request For Refund", action: "refund" }]
      },
      REJECTED: {
        statusText: "Request Rejected",
        statusColor: "text-red-600",
        bgColor: "bg-red-100",
        actions: [{ label: "Request Ruling on Dispute", action: "dispute" }]
      }
    }[statusUpper] || {
      statusText: "In Progress",
      statusColor: "text-blue-600",
      bgColor: "bg-blue-100",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "";
    }
  };

  const handleFileDownload = (url, filename = "evidence") => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAction = async (actionType, extraData = null) => {
    const actionCallbacks = {
      accept: () => acceptCancellationRequest(cancellationRequest._id),
      reject: () => {
        const reason = prompt("Please provide a reason for rejection:");
        return reason ? rejectCancellationRequest({ id: cancellationRequest._id, reason }) : Promise.reject();
      },
      delete: () => deleteCancellationRequest(cancellationRequest._id),
      view: () => Promise.resolve(console.log("View details")),
      refund: () => Promise.resolve(console.log("Request refund")),
      dispute: () => Promise.resolve(console.log("Request dispute")),
    };

    try {
      const result = await actionCallbacks[actionType]().unwrap();
      console.log(`${actionType} successful, result:`, result);
      
      if (actionType !== "view" && actionType !== "refund" && actionType !== "dispute") {
        toast.success(`Cancellation request ${actionType}ed successfully`);
        
        // If delete, immediately hide component from UI
        if (actionType === "delete") {
          setIsDeleted(true);
        }
        
        // Refetch to update UI for all viewers (both requester and recipient)
        console.log("Calling refetch after action:", actionType);
        setTimeout(async () => {
          try {
            const refetchResult = await refetch();
            console.log("Refetch completed:", refetchResult);
          } catch (e) {
            console.error("Refetch error:", e);
          }
        }, 500);
      }
    } catch (error) {
      console.error(`Action failed: ${actionType}`, error);
      toast.error(error?.data?.message || `Failed to ${actionType} request`);
    }
  };

  // ==================== Render Logic ====================

  const statusConfig = getStatusConfig(
    cancellationRequest.status,
    cancellationRequest.requestToModel
  );

  const renderRequesterInfo = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
      <div className="w-12 h-12">
        <Image
          src={cancellationRequest.requestFrom?.profile_image || client}
          alt="requester"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p className="font-medium text-gray-900">Requested By</p>
        <p className="text-gray-600 text-sm">
          {cancellationRequest.requestFrom?.name || "N/A"}
        </p>
      </div>
    </div>
  );

  const renderCancellationReason = () => (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 mb-2">Cancellation Reason</h4>
      <p className="text-gray-600 text-sm leading-relaxed rounded-lg">
        {cancellationRequest.reason}
      </p>
      {cancellationRequest.cancellationReason && (
        <div className="mt-3">
          <h5 className="font-medium text-gray-900 mb-1">Additional Details:</h5>
          <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg border">
            {cancellationRequest.cancellationReason}
          </p>
        </div>
      )}
    </div>
  );

  const renderEvidence = () => {
    if (!cancellationRequest.cancellationEvidence?.length && !cancellationRequest.reject_evidence) {
      return null;
    }

    return (
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Supporting Evidence</h4>
        <div className="bg-white rounded-lg border p-4">
          {cancellationRequest.cancellationEvidence?.map((evidence, index) => (
            <FilePreview
              key={index}
              url={evidence}
              name={`Evidence ${index + 1}`}
              onDownload={() => handleFileDownload(evidence, `evidence-${index + 1}`)}
            />
          ))}
          {cancellationRequest.reject_evidence && (
            <FilePreview
              url={cancellationRequest.reject_evidence}
              name="Rejection Evidence"
              onDownload={() => handleFileDownload(cancellationRequest.reject_evidence, "reject-evidence")}
            />
          )}
        </div>
      </div>
    );
  };

  const renderStatusSection = () => (
    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <StatusIcon status={cancellationRequest.status} />
        <div>
          <p className="font-medium text-gray-900">Cancellation Status</p>
          <p className={`text-sm font-medium ${statusConfig.statusColor}`}>
            {statusConfig.statusText}
          </p>
        </div>
      </div>
      {cancellationRequest.reviewedRequestAt && (
        <div className="text-right">
          <p className="text-gray-500 text-xs">
            Reviewed: {formatDate(cancellationRequest.reviewedRequestAt)}
          </p>
        </div>
      )}
    </div>
  );

  const renderRejectionReason = () => {
    if (cancellationRequest.status.toUpperCase() !== "REJECTED" || !cancellationRequest.rejectDetails) {
      return null;
    }

    return (
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Reason for Rejection</h4>
        <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg border border-red-200">
          {cancellationRequest.rejectDetails}
        </p>
      </div>
    );
  };

  const renderActionButtons = () => {
    const { status } = cancellationRequest;
    const isPending = status.toUpperCase() === "PENDING";
    
    return (
      <div className="flex flex-wrap gap-3">
        {/* Status-based actions */}
        {statusConfig.actions?.map((action, index) => (
          <ActionButton
            key={index}
            onClick={() => handleAction(action.action)}
            variant="primary"
          >
            {action.label}
          </ActionButton>
        ))}

        {/* Accept/Reject buttons */}
        {isPending && statusConfig.canAcceptReject && (
          <>
            <ActionButton onClick={() => handleAction("accept")} variant="accept">
              Accept Request
            </ActionButton>
            <ActionButton onClick={() => handleAction("reject")} variant="reject">
              Reject Request
            </ActionButton>
          </>
        )}

        {/* Delete button */}
        {isPending && statusConfig.canDelete && (
          <ActionButton onClick={() => handleAction("delete")} variant="delete">
            Delete Request
          </ActionButton>
        )}
      </div>
    );
  };

  // ==================== Main Render ====================

  return (
    <>
      <div className={`${statusConfig.bgColor} border rounded-lg p-6 mb-6`}>
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-white rounded-full p-2 hidden lg:block">
            <GitPullRequest className="w-5 h-5 text-[#115E59]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              You requested to Cancel the task Via resolution center
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {renderRequesterInfo()}
            </div>

            {renderCancellationReason()}
            {renderEvidence()}
            {renderStatusSection()}
            {renderRejectionReason()}
            {renderActionButtons()}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#115E59]"></div>
                <span className="ml-2 text-gray-600">Loading cancellation details...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-700 text-sm">
                  Failed to load cancellation request details. Please try again.
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
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 cursor-pointer z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Evidence preview"
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <div className="flex justify-center mt-4">
              <ActionButton
                onClick={() => handleFileDownload(selectedImage, `evidence-image-${taskId}`)}
                variant="primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CancellationStatusComponent;