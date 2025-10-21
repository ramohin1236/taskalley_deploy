"use client";
import React, { useState } from "react";
import { ArrowLeft, Copy, Share, Check } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { TbDiscount } from "react-icons/tb";

const ReferServiceDiscounts = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("my-discounts");
  const [copied, setCopied] = useState(false);

  // Sample referral data
  const referralData = [
    {
      type: "Got a referral",
      status: "Active",
      value: "₦0.00",
      appliedDate: "—",
    },
    {
      type: "Got a referral",
      status: "Used",
      value: "₦0.00",
      appliedDate: "Jul 15, 2025",
    },
    {
      type: "Joined with a referral",
      status: "Used",
      value: "₦0.00",
      appliedDate: "Jul 15, 2025",
    },
  ];

  const referralCode = "TASK-USR123";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-50";
      case "used":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareLink = () => {
    const shareUrl = `https://taskalley.com/refer/${referralCode}`;

    if (navigator.share) {
      navigator.share({
        title: "Join TaskAlley",
        text: "Join me on TaskAlley and get rewards!",
        url: shareUrl,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Referral link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
         <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <TbDiscount className="text-3xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
          Referrals & Discounts
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        <button
          onClick={() => setActiveTab("my-discounts")}
          className={`px-4 py-2 text-lg font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === "my-discounts"
              ? "bg-[#115e59] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          My Discounts
        </button>
        <button
          onClick={() => setActiveTab("referral-program")}
          className={`px-4 py-2 text-lg font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === "referral-program"
              ? "bg-[#115e59] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Referral Program
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "my-discounts" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Mobile View */}
          <div className="block lg:hidden">
            <div className="space-y-1">
              {referralData.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl text-gray-900 ">{item.type}</h3>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-lg">
                        {item.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.appliedDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-xl">
                    Referral Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-xl">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-xl">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-xl">
                    Applied Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {referralData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-lg text-gray-900 text-md">
                      {item.type}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-lg font-semibold text-gray-900">
                      {item.value}
                    </td>
                    <td className="py-3 px-4 text-lg text-gray-600">
                      {item.appliedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "referral-program" && (
        <div className="space-y-6">
          {/* Referral Code Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 text-[#115e59]">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Your Referral Code
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="w-5 h-5 text-gray-400">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-mono text-gray-900 text-lg">
                    {referralCode}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center cursor-pointer gap-2 px-4 py-3 bg-[#115e59] hover:bg-teal-800 text-white rounded-md transition-colors text-lg font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareLink}
                  className="flex items-center cursor-pointer gap-2 px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors text-lg font-medium"
                >
                  <Share className="w-4 h-4" />
                  Share Link
                </button>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How Referrals Work
            </h3>
            <div className="space-y-3 text-lg text-gray-700">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#115e59] font-semibold text-xs">1</span>
                </div>
                <p>Share your referral code with friends and family</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#115e59] font-semibold text-xs">2</span>
                </div>
                <p>
                  They sign up using your code and complete their first task
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#115e59] font-semibold text-xs">3</span>
                </div>
                <p>Both you and your friend get reward credits</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo wrapper component
const ReferServiceDiscountsDemo = () => {
  const [showComponent, setShowComponent] = useState(true);

  if (!showComponent) {
    return (
      <div className="bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Component closed</p>
          <button
            onClick={() => setShowComponent(true)}
            className="bg-[#115e59] text-white px-4 py-2 rounded-md hover:bg-[#115e59] transition-colors"
          >
            Show Component Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="  py-8">
      <ReferServiceDiscounts onBack={() => setShowComponent(false)} />
    </div>
  );
};

export default ReferServiceDiscountsDemo;
