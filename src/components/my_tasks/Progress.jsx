import React from "react";
import TaskInfoSection from "./TaskInfoSection";
import TaskDetailsSection from "./TaskDetailsSection";
import PricingSection from "./PricingSection";
import ProgressBarComponent from "./ProgressBarComponent";
import CancellationStatusComponent from "./CancellationStatusComponent";
import DateExtensionRequestSection from "./DateExtensionRequestSection";
import { useCompleteTaskMutation } from "@/lib/features/task/taskApi"; // Adjust import path
import { toast } from "sonner";

// cancellationStatus should be
// cancellationStatus = "in-progress"
// cancellationStatus = "accepted"
// cancellationStatus = "rejected"
// cancellationStatus = null

const Progress = ({
  cancellationStatus = null,
  extensionStatus = null,
  bidsData,
  taskDetails
}) => {
  const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();

  const formatDate = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const offeredDate = taskDetails?.createdAt ? formatDate(taskDetails.createdAt) : "";
  const inProgressDate = (taskDetails?.status === "IN_PROGRESS" || taskDetails?.status === "ASSIGNED")
    ? formatDate(taskDetails?.updatedAt || taskDetails?.createdAt)
    : "";
  const completedDate = taskDetails?.status === "COMPLETED" ? formatDate(taskDetails?.updatedAt) : "";

  const isInProgress = taskDetails?.status === "IN_PROGRESS" || taskDetails?.status === "ASSIGNED";
  const isCompleted = taskDetails?.status === "COMPLETED";

  const steps = [
    { id: 1, label: "Offered", date: offeredDate, completed: true },
    { id: 2, label: "In Progress", date: inProgressDate, completed: isInProgress || isCompleted },
    { id: 3, label: "Completed on", date: completedDate, completed: isCompleted },
  ];

  const progressWidth = isCompleted ? "100%" : (isInProgress ? "66.67%" : "33.33%");

  const assignedTo = (() => {
    if (taskDetails?.provider && typeof taskDetails.provider === "object" && taskDetails.provider.name) {
      return taskDetails.provider.name;
    }
    const providerId = typeof taskDetails?.provider === "string" ? taskDetails.provider : null;
    if (providerId && Array.isArray(bidsData?.data)) {
      const matchedBid = bidsData.data.find(
        (b) => b?.provider?._id === providerId
      );
      if (matchedBid?.provider?.name) {
        return matchedBid.provider.name;
      }
    }
    return "Not assigned";
  })();

  const location =
    taskDetails?.address ||
    taskDetails?.city ||
    "Location not specified";

  const dateLabel = taskDetails?.preferredDate
    ? new Date(taskDetails.preferredDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + (taskDetails?.preferredTime ? ` ${taskDetails.preferredTime}` : "")
    : "Schedule not set";

  const description =
    taskDetails?.description || "No description available.";

  const budget = taskDetails?.budget;

  const handleMarkAsComplete = async () => {
    if (!taskDetails?._id) {
      toast.error("Task ID not found");
      return;
    }

    if (!confirm("Are you sure you want to mark this task as complete?")) {
      return;
    }

    try {
      const result = await completeTask(taskDetails._id).unwrap();
      
      if (result.success) {
        toast.success("Task marked as complete successfully!");
        
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error(error?.data?.message || "Failed to mark task as complete. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Task Info Section */}
      <TaskInfoSection
        assignedTo={assignedTo}
        location={location}
        dateLabel={dateLabel}
      />

      {/* Task Details Section */}
      <TaskDetailsSection description={description} />

      {/* Pricing Section */}
      <PricingSection budget={budget} />

      {/* Progress Bar */}
      <ProgressBarComponent steps={steps} progressWidth={progressWidth} />

      {/* Cancellation Status Section (conditional) */}
      <div>
        <CancellationStatusComponent cancellationStatus={cancellationStatus} />
        <DateExtensionRequestSection extensionStatus={extensionStatus} />
      </div>

      {/* Mark as Complete Button - Only show if task is not already completed */}
      {!isCompleted && (
        <div className="flex justify-start">
          <button 
            onClick={handleMarkAsComplete}
            disabled={isCompleting}
            className={`px-6 py-2.5 rounded-md transition-colors font-medium cursor-pointer ${
              isCompleting 
                ? "bg-gray-400 text-white cursor-not-allowed" 
                : "bg-[#115E59] hover:bg-teal-700 text-white"
            }`}
          >
            {isCompleting ? "Marking Complete..." : "Mark As Complete"}
          </button>
        </div>
      )}

      {/* Show message if task is already completed */}
      {isCompleted && (
        <div className="flex justify-start">
          <div className="px-6 py-2.5 bg-green-100 text-green-800 rounded-md font-medium">
            ✓ Task Completed
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;