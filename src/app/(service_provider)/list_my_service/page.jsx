"use client"
import React, { useEffect, useState } from "react";
import ServiceCategoriesCard from "@/components/service_provider/ServiceCategoriesCard";
import AddService from "../add_service/page";
import { useGetMyServiceQuery } from "@/lib/features/providerService/providerServiceApi";

const ListMyService = () => {
  const { 
    data: service, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = useGetMyServiceQuery();

  const serviceData = service?.data;
  
  const [showAddForm, setShowAddForm] = useState(!serviceData);

 
  useEffect(() => {
    // Show add form if no service data exists
    // Check for empty object, null, undefined, or if serviceData has no _id
    if (!serviceData || 
        serviceData === null || 
        serviceData === undefined ||
        (typeof serviceData === 'object' && Object.keys(serviceData).length === 0) ||
        (!serviceData._id && !serviceData.id)) {
      setShowAddForm(true);
    } else {
      setShowAddForm(false);
    }
  }, [serviceData]);

  
  const handleServiceAdded = () => {
    refetch();
    setShowAddForm(false);
  };


  const handleAddNewService = () => {
    setShowAddForm(true);
  };

  const handleServiceDeleted = async () => {
    // Immediately show add form after deletion
    setShowAddForm(true);
    
    try {
      // Wait for refetch to complete to update the cache
      await refetch();
    } catch (error) {
      console.error("Error refetching after deletion:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#115e59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading service data</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#115e59] text-white rounded-md hover:bg-[#074641] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-12">
      {!showAddForm && serviceData && serviceData._id ? (
        <div>
          <ServiceCategoriesCard 
            serviceData={serviceData} 
            onDeleteSuccess={handleServiceDeleted}
          />
        </div>
      ) : (
        <div className="project_container px-6 py-12">
          <AddService onSuccess={handleServiceAdded} />
        </div>
      )}
    </div>
  );
};

export default ListMyService;