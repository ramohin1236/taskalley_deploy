"use client"

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useDeleteServiceMutation } from "@/lib/features/providerService/providerServiceApi";
import main_logo from "../../../public/main_logo_svg.svg";

const ServiceCategoriesCard = ({ serviceData, onDeleteSuccess }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDeleteClick = () => {
    const serviceId = serviceData?._id || serviceData?.id;
    if (!serviceId) {
      toast.error("Service ID not found. Cannot delete service.");
      console.error("Delete clicked but service ID is missing:", serviceData);
      return;
    }
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    // Validate service ID exists
    const serviceId = serviceData?._id || serviceData?.id;
    
    if (!serviceId) {
      toast.error("Service ID not found. Please refresh the page and try again.");
      console.error("Service ID is missing. serviceData:", serviceData);
      setShowDeleteModal(false);
      return;
    }

    try {
      const result = await deleteService(serviceId).unwrap();
      if (result?.success) {
        toast.success(result.message || "Service deleted successfully");
        setShowDeleteModal(false);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to delete service";
      toast.error(errorMessage);
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md overflow-hidden 
    flex w-full border flex-col md:flex-row justify-between">
      {/* Left Side - Image */}
      <div className="relative w-52 h-full lg:h-52">
        <Image
          src={serviceData?.images?.[0] || main_logo}
          alt="Cleaning Service"
          width={400}
          height={300}
          className="h-full w-full object-cover"
        />

      </div>

      {/* Right Side - Details */}
      <div className="px-5 py-5 flex flex-col md:w-3/5">
        <h2 className="text-2xl font-semibold text-gray-800">
          {serviceData?.title}
        </h2>

        <div className="mt-3 space-y-2 text-gray-600 text-sm">
          <p>
            <span className="font-semibold">Starting Price :</span> ₦ {serviceData?.price} 
          </p>
          <p>
            <span className="font-semibold">Email :</span> {user?.email}
          </p>
          {/* <p>
            <span className="font-semibold">Contact Number :</span> (603)
            555-0123
          </p> */}
          {/* <p>
            <span className="font-semibold">Service Location :</span> {serviceData?.city}
          </p> */}
        </div>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <Link 
            href={`/list_my_service/list_my_service_details/${serviceData?._id || serviceData?.id}`} 
            className="px-6 py-3 border border-[#115e59] text-[#115e59] rounded-md hover:bg-[#115e59] hover:text-white transition text-center"
          >
            View Details
          </Link>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting || !serviceData?._id}
            className="px-6 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete Service"}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-6 z-10">
            {/* Close button */}
            {!isDeleting && (
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Service?
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-gray-800 font-medium mb-4">
                "{serviceData?.title}"?
              </p>
              <p className="text-red-600 text-sm font-medium">
                This action cannot be undone. All service data and associated images will be permanently deleted.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Service
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCategoriesCard;
