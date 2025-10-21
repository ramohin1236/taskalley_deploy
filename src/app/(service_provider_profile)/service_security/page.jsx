"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FaUserXmark } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";

const ServiceChangePassword = ({ onBack }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Old password validation
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword =
        "New password must be different from old password";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Handle success
      alert("Password updated successfully!");

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setErrors({
        submit: "Failed to update password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ServicePasswordInput = ({ label, field, placeholder, error }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword[field] ? "text" : "password"}
          value={
            formData[
              field === "old"
                ? "oldPassword"
                : field === "new"
                ? "newPassword"
                : "confirmPassword"
            ]
          }
          onChange={(e) =>
            handleInputChange(
              field === "old"
                ? "oldPassword"
                : field === "new"
                ? "newPassword"
                : "confirmPassword",
              e.target.value
            )
          }
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 focus:border-transparent pr-12 ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword[field] ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-8">
        <div className="flex items-center gap-3 mb-8">
          <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <IoIosSettings className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            Security Settings
          </h1>
        </div>
        <div>
             <button className="flex gap-2  items-center bg-red-600 hover:bg-red-400 cursor-pointer text-white px-4 py-2 md:px-6 md:py-3 rounded-md">
                <FaUserXmark />  Delete Account
             </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Old Password */}
        <ServicePasswordInput
          label="Old Password"
          field="old"
          placeholder="••••••••"
          error={errors.oldPassword}
        />

        {/* New Password */}
        <ServicePasswordInput
          label="New Password"
          field="new"
          placeholder="••••••••"
          error={errors.newPassword}
        />

        {/* Confirm New Password */}
        <ServicePasswordInput
          label="Confirm New Password"
          field="confirm"
          placeholder="••••••••"
          error={errors.confirmPassword}
        />

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#115e59] hover:bg-teal-700 active:bg-teal-800"
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </div>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
};

// Demo wrapper component
const ServiceChangePasswordDemo = () => {
  const [showForm, setShowForm] = useState(true);

  if (!showForm) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Password form closed</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#115e59] text-white px-4 py-2 rounded-md hover:bg-teal-800 transition-colors"
          >
            Show Form Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex  p-4">
      <div className="w-full ">
        <ServiceChangePassword onBack={() => setShowForm(false)} />
      </div>
    </div>
  );
};

export default ServiceChangePasswordDemo;
