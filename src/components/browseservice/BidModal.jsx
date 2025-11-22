"use client";

import React, { useState } from "react";
import { X, DollarSign, MessageCircle } from "lucide-react";

const BidModal = ({ isOpen, onClose, task, onSubmit, isLoading }) => {
  const [bidData, setBidData] = useState({
    price: "",
    details: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bidData.price || parseFloat(bidData.price) <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    const submitData = {
      task: task?._id,
      price: parseFloat(bidData.price),
      ...(bidData.details && { details: bidData.details })
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setBidData({ price: "", details: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submit Your Bid</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Task Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{task?.title}</h3>
            <p className="text-sm text-gray-600">
              Budget: ₦{task?.budget?.toLocaleString()}
            </p>
          </div>

          {/* Bid Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount (₦) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               ₦
              </div>
              <input
                type="number"
                value={bidData.price}
                onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                placeholder="Enter your bid amount"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#115E59] focus:border-transparent"
                required
                min="1"
                step="0.01"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the amount you're willing to complete this task for
            </p>
          </div>

          {/* Message (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageCircle className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                value={bidData.details}
                onChange={(e) => setBidData({ ...bidData, details: e.target.value })}
                placeholder="Add a message to the task poster (optional)..."
                rows="4"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#115E59] focus:border-transparent resize-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Explain why you're the right person for this task
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !bidData.price}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                isLoading || !bidData.price
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;