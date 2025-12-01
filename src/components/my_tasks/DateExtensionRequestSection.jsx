import React from "react";
import {
  Calendar,
  ArrowLeftRight,
  Check,
  GitPullRequest,
  X,
} from "lucide-react";
import client from "../../../public/client.png";
import Image from "next/image";

const DateExtensionRequestSection = ({ extensionStatus }) => {
  console.log("extentionstatus",extensionStatus)
  const getExtensionContent = () => {
    if (!extensionStatus) return null;

    switch (extensionStatus) {
      case "in-progress":
        return {
          statusText: "In Progress",
          statusColor: "text-green-600",
          statusIcon: <Check className="w-4 h-4 text-white" />,
          statusBgColor: "bg-green-700",
          button: {
            text: "Cancel The Request",
            color: "bg-[#115e59] hover:bg-teal-700",
          },
          showMarkComplete: true,
        };
      case "accepted":
        return {
          statusText: "Approved By Service Provider",
          statusColor: "text-[#115e59]",
          statusIcon: <Check className="w-4 h-4 text-white" />,
          statusBgColor: "bg-[#115e59]",
          button: null,
          showMarkComplete: true,
        };
      case "rejected":
        return {
          statusText: "Rejected By Service Provider",
          statusColor: "text-red-600",
          statusIcon: <X className="w-4 h-4 text-white" />,
          statusBgColor: "bg-red-600",
          button: null,
          showMarkComplete: false,
          rejectionReason:
            "The proposed extension cannot be granted due to project deadlines and client commitments.",
        };
      default:
        return null;
    }
  };

  const content = getExtensionContent();
  if (!content) return null;

  return (
    <div className="bg-[#E6F4F1] border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <div className="bg-white rounded-full p-2 hidden lg:block">
          <GitPullRequest className="w-5 h-5 text-green-900" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            You Request Change of Task Completion Date
          </h3>

          {/* Requested By Section */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="w-16 h-16">
                <Image src={client} alt="client" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Requested By</p>
                <p className="text-gray-600 text-sm">Me</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">15 May 2020 8:00 am</p>
          </div>

          {/* Current and New Date Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6  border px-4 py-2 rounded-2xl">
            {/* Current Date */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Current Completion Date
              </h4>
              <div className=" rounded-lg p-3 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 text-sm">
                  15 May 2020 8:00 am
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* New Proposed Date */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                New Proposed Date
              </h4>
              <div className=" rounded-lg p-3 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 text-sm">
                  15 May 2020 8:00 am
                </span>
              </div>
            </div>
          </div>

          {/* Reason for Request */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">
              Reason For Request
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              I request the immediate cancellation of the project due to
              repeated breaches: poor communication, multiple missed meetings,
              delays without real progress, and deliverables not meeting agreed
              standards. I request a full refund and preservation of all
              evidence in accordance with Fiverr's Terms of Service, Article
              5.3.
            </p>
          </div>

          {/* Extension Status */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${content.statusBgColor}`}
              >
                {content.statusIcon}
              </div>
              <div>
                <p className="font-medium text-gray-900">Extension Status</p>
                <p className={`text-sm ${content.statusColor}`}>
                  {content.statusText}
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">15 May 2020 8:00 am</p>
          </div>

          {/* Rejection Reason */}
          {extensionStatus === "rejected" && content.rejectionReason && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Reason For Rejection :
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {content.rejectionReason}
              </p>
            </div>
          )}

          {/* Action Button */}
          {content.button && (
            <button className="px-6 py-2.5 bg-[#115E59] hover:bg-teal-700 text-white rounded-md transition-colors font-medium cursor-pointer">
              {content.button.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateExtensionRequestSection;
