// components/serviceprovider/ServiceTabs.jsx
import React from "react";
import {
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Tag,
} from "lucide-react";

const ServiceTabs = ({ activeTab, setActiveTab, service }) => {
  const tabs = [
    { id: "Description", label: "Description" },
    { id: "Details", label: "Service Details" },
    { id: "Reviews", label: "Reviews" },
  ];

  const createdAt = service?.createdAt
    ? new Date(service.createdAt).toLocaleDateString()
    : null;

  const updatedAt = service?.updatedAt
    ? new Date(service.updatedAt).toLocaleDateString()
    : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "Description":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Service Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {service?.description || "No description available."}
            </p>
          </div>
        );

      case "Details":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                icon={<Tag className="w-5 h-5 text-[#115e59]" />}
                label="Category"
                value={service?.category?.name || "Not specified"}
              />
              <DetailItem
                icon={<Shield className="w-5 h-5 text-[#115e59]" />}
                label="Status"
                value={service?.status || "Pending"}
              />
              <DetailItem
                icon={<CheckCircle className="w-5 h-5 text-[#115e59]" />}
                label="Active"
                value={service?.isActive ? "Active" : "Inactive"}
              />
              <DetailItem
                icon={<Clock className="w-5 h-5 text-[#115e59]" />}
                label="Created"
                value={createdAt || "Not available"}
              />
              <DetailItem
                icon={<Clock className="w-5 h-5 text-[#115e59]" />}
                label="Last Updated"
                value={updatedAt || "Not available"}
              />
              <DetailItem
                icon={<MapPin className="w-5 h-5 text-[#115e59]" />}
                label="Service Area"
                value={service?.city || service?.address || "Not specified"}
              />
            </div>

            {service?.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  More about this service:
                </p>
                <p className="text-gray-800 mt-2">{service.description}</p>
              </div>
            )}
          </div>
        );

      case "Reviews":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
            <p className="text-gray-600">
              {service?.totalRating
                ? `This service has ${service.totalRating} reviews.`
                : "No reviews yet."
              }
            </p>
            {/* You can add actual reviews here when available */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Headers */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-[#115e59] text-[#115e59]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default ServiceTabs;