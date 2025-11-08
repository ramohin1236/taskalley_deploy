// components/serviceprovider/ServiceTabs.jsx
import { CheckCircle } from "lucide-react";
import React from "react";


const ServiceTabs = ({ activeTab, setActiveTab, service }) => {
  const tabs = [
    { id: "Description", label: "Description" },
    { id: "Details", label: "Service Details" },
    { id: "Reviews", label: "Reviews" },
  ];

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
            
            {/* Service Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Tool className="w-5 h-5 text-[#115e59]" />
                <div>
                  <p className="font-medium">Tools Provided</p>
                  <p className="text-sm text-gray-600">
                    {service?.toolsProvided ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#115e59]" />
                <div>
                  <p className="font-medium">On-site Support</p>
                  <p className="text-sm text-gray-600">
                    {service?.onSiteSupport ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              
              {service?.languages && service.languages.length > 0 && (
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-[#115e59]" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-gray-600">
                      {service.languages.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Availability */}
            {service?.availability && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                <p className="text-gray-700">{service.availability}</p>
              </div>
            )}
          </div>
        );

      case "Reviews":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
            <p className="text-gray-600">
              {service?.totalReviews 
                ? `This service has ${service.totalReviews} reviews.`
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

export default ServiceTabs;