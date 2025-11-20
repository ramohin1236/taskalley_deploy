"use client";
import { ArrowLeft, Camera, Upload, X, Check, User } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import client from "../../../../public/client.png";
import Link from "next/link";
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/lib/features/auth/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const UpdateInformation = () => {
  const [profileImage, setProfileImage] = useState(client);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const role = useSelector((state) => state?.auth?.user?.role);

  const { data: profileData, isLoading, error } = useGetMyProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const userData = profileData?.data;

  console.log("User Data from API:", userData);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    street: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [addressDocumentFile, setAddressDocumentFile] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        city: userData.city || "",
        street: userData.street || "",
      });

      if (userData.profile_image) {
        setProfileImage(userData.profile_image);
      } else if (userData.profileImage) {
        setProfileImage(userData.profileImage);
      }
    }
  }, [userData]);

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (JPG, PNG)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setProfileImageFile(file);
        toast.success(
          'Profile image selected! Click "Save Changes" to upload.'
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid file (JPG, PNG, PDF)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setAddressDocumentFile(file);
      toast.success(
        'Address document selected! Click "Save Changes" to upload.'
      );
    }
  };

  const triggerProfileImageInput = () => {
    fileInputRef.current?.click();
  };

  const triggerAddressDocumentInput = () => {
    documentInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("street", formData.street);

      if (profileImageFile) {
        formDataToSend.append("profile_image", profileImageFile);
      }

      if (addressDocumentFile) {
        formDataToSend.append("address_document", addressDocumentFile);
      }

      console.log("Sending FormData:", {
        name: formData.name,
        city: formData.city,
        street: formData.street,
        profile_image: profileImageFile?.name,
        address_document: addressDocumentFile?.name,
      });

      const result = await updateProfile(formDataToSend).unwrap();
      console.log("Full API Response:", result);

      if (result && result.success === true) {
        console.log(" Profile update successful!");

        toast.success("Profile updated successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000, 
        });

        // Reset file states
        setProfileImageFile(null);
        setAddressDocumentFile(null);

        // Clear file inputs
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (documentInputRef.current) documentInputRef.current.value = "";
      } else {
        
        const errorMessage = result?.message || "Failed to update profile";
        console.error(" Update failed:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Update failed with error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to update profile. Please try again.";

      toast.error(errorMessage, {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        },
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <Link href="/profile_info">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
                <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
              </button>
            </Link>
            <h2 className="font-semibold text-gray-800 text-lg sm:text-xl lg:text-2xl">
              Update Profile
            </h2>
          </div>
          <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
            <div className="animate-pulse p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <Link href="/profile_info">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
              <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
            </button>
          </Link>
          <h2 className="font-semibold text-gray-800 text-lg sm:text-xl lg:text-2xl">
            Update Profile
          </h2>
        </div>

        {/* Content */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          {/* Profile Image Section */}
          <div className="bg-gray-50 px-6 py-8 lg:py-12 border-b border-gray-200">
            <div className="text-center">
              <div className="relative inline-block">
                <Image
                  src={profileImage}
                  alt="profile"
                  width={140}
                  height={140}
                  className="rounded-full w-32 h-32 border-4 border-white shadow-lg mx-auto"
                />
                <button
                  onClick={triggerProfileImageInput}
                  className="absolute bottom-2 right-2 bg-[#115e59] hover:bg-[#0d4a42] p-3 rounded-full shadow-lg transition-colors group"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {userData?.name || "User Name"}
                </h3>
                <p className="text-gray-600 mb-4 capitalize">
                  {role === "provider"
                    ? "Provider"
                    : "Customer"}
                </p>
                <button
                  onClick={triggerProfileImageInput}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#115e59] hover:text-[#0d4a42] font-medium transition-colors border border-[#115e59] hover:border-[#0d4a42] rounded-lg hover:bg-[#115e59] hover:bg-opacity-5"
                >
                  <Upload className="w-4 h-4" />
                  Change Photo
                </button>
                {profileImageFile && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ {profileImageFile.name} selected
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h3>
              </div>

              {/* Display-only fields (Email & Phone) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    {userData?.email || "Not available"}
                  </div>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone - Read Only */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    {userData?.phone || "Not available"}
                  </div>
                  <p className="text-xs text-gray-500">
                    Phone number cannot be changed
                  </p>
                </div>
              </div>

              {/* Updatable Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#115e59] focus:border-[#115e59] transition-all placeholder-gray-400 text-gray-900"
                  />
                </div>

                {/* City Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#115e59] focus:border-[#115e59] transition-all placeholder-gray-400 text-gray-900"
                  />
                </div>

                {/* Street Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Enter your street address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#115e59] focus:border-[#115e59] transition-all placeholder-gray-400 text-gray-900"
                  />
                </div>

                {/* Address Document Upload */}
                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address Document
                  </label>
                  <button
                    type="button"
                    onClick={triggerAddressDocumentInput}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#115e59] hover:bg-gray-50 transition-all duration-300 text-gray-600 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {addressDocumentFile ? addressDocumentFile.name : "Upload Address Document"}
                  </button>
                  {addressDocumentFile && (
                    <p className="text-xs text-green-600">
                      ✓ {addressDocumentFile.name} selected
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Upload JPG, PNG, or PDF (max 10MB)
                  </p>
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Link href="/profile_info" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-[#115e59] text-white font-medium rounded-lg hover:bg-[#0d4a42] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfileImageUpload}
          className="hidden"
        />
        <input
          ref={documentInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleAddressDocumentUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UpdateInformation;
