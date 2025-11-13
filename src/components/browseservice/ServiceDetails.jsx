"use client";
import React, { useState } from "react";
import { ChevronLeft, MapPin, Calendar, Star, Clock, Languages } from "lucide-react";
import client from "../../../public/client.png";
import Image from "next/image";
import Link from "next/link";

const ServiceDetails = ({ service }) => {
  const [statusTab, setStatusTab] = useState("open");
  const [contentTab, setContentTab] = useState("Bids");
  const [newQuestion, setNewQuestion] = useState("");

  // Use actual service data
  const taskData = {
    title: service?.title || "Service Title",
    poster: { name: "Service Provider" },
    location: service?.city || service?.address || "Location not specified",
    dueDate: "Flexible", 
    budget: service?.price?.toString() || "0",
    description: service?.description || "No description available.",
    experience: service?.experience || "Not specified",
    availability: service?.availability || "Not specified",
    onSiteSupport: service?.onSiteSupport || false,
    toolsProvided: service?.toolsProvided || false,
    languages: service?.languages || [],
  };

  const reviews = [
    {
      user: "Grace Carey",
      rating: "4.5",
      reviewCount: "148",
      review: "Excellent service! The plumber was professional and fixed the issue quickly.",
      timeAgo: "2 hours ago",
    },
    {
      user: "Ronald Richards",
      rating: "4.5",
      reviewCount: "148",
      review: "Great work quality and reasonable pricing. Would recommend!",
      timeAgo: "3 hours ago",
    },
  ];

  const statusTabs = [
    {
      id: "open",
      label: "Available",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "completed",
      label: "Completed",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const contentTabs = ["Bids", "Questions"];

  const handleQuestionSubmit = () => {
    if (newQuestion.trim()) {
      setNewQuestion("");
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <Link className="flex items-center" href="/browseservice">
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-[#115e59] font-semibold">
            Back To Map
          </span>
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 p-4 bg-white">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
              statusTab === tab.id
                ? tab.color
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Service Header */}
      <div className="p-4 bg-white">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          {taskData.title}
        </h1>

        {/* Service Images */}
        {service?.images && service.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {service.images.slice(0, 4).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${taskData.title} ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <Image
            src={client}
            alt={taskData.poster.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-gray-500">Service Provider</p>
            <p className="text-sm font-medium text-gray-900">
              {taskData.poster.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
            <MapPin className="w-4 h-4 text-[#115E59]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm text-gray-900">{taskData.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
            <Clock className="w-4 h-4 text-[#115E59]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Availability</p>
            <p className="text-sm text-gray-900">{taskData.availability}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
            <Clock className="w-4 h-4 text-[#115E59]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Experience</p>
            <p className="text-sm text-gray-900">{taskData.experience}</p>
          </div>
        </div>

        {taskData.languages.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
              <Languages className="w-4 h-4 text-[#115E59]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Languages</p>
              <p className="text-sm text-gray-900">{taskData.languages.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Service Description */}
        <div className="p-4 bg-white border-b pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {taskData.description}
          </p>
        </div>

        {/* Additional Service Features */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              taskData.onSiteSupport ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              ✓
            </div>
            <span className="text-sm text-gray-700">On-site Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              taskData.toolsProvided ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              ✓
            </div>
            <span className="text-sm text-gray-700">Tools Provided</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-b pb-8">
          <div className="mb-4 pt-8">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Service Price
            </p>
            <p className="text-2xl font-bold text-gray-900">
              ₦{parseInt(taskData.budget).toLocaleString()}
            </p>
          </div>

          <div>
            <button className="w-full bg-[#115E59] cursor-pointer text-white py-3 px-8 rounded-sm font-medium transition-colors">
              Book This Service
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200">
        {contentTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setContentTab(tab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              contentTab === tab
                ? "text-white bg-[#115E59] cursor-pointer"
                : "text-gray-600 hover:text-gray-900 cursor-pointer"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {contentTab === "Bids" ? (
        <div>
          {/* Reviews List */}
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 bg-white border-b border-gray-100"
            >
              <Image
                src={client}
                alt={review.user}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{review.user}</h3>
                  <span className="text-xs text-gray-400">
                    {review.timeAgo}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {review.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({review.reviewCount} Reviews)
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {review.review}
                </p>
              </div>
            </div>
          ))}

          {/* View More Button */}
          <div className="p-4 bg-white">
            <button className="w-full bg-[#115E59] cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors">
              View More Reviews
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white">
          {/* Ask Question Form */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Image
                src={client}
                alt="client"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask a question about this service"
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#115E59] focus:border-transparent"
                  rows="3"
                />
                <div className="flex justify-end items-center mt-3">
                  <button
                    onClick={handleQuestionSubmit}
                    className="bg-[#115E59] text-white px-4 py-2 rounded-sm font-medium cursor-pointer transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div>
            {reviews.map((question, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 bg-white border-b border-gray-100"
              >
                <Image
                  src={client}
                  alt={question.user}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {question.user}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {question.timeAgo}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {question.review}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button for Questions */}
          <div className="p-4 bg-white">
            <button className="w-full bg-[#115e59] text-white py-3 px-4 rounded-lg font-medium transition-colors">
              View More Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;