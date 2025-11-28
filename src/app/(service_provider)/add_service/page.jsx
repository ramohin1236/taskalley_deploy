"use client"

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Plus, Upload, X } from "lucide-react";
import { useCreateServiceMutation, useUpdateServiceMutation } from "@/lib/features/providerService/providerServiceApi";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import { toast } from "sonner";
import dynamic from 'next/dynamic';

// Dynamic import for Jodit to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  // Rendering a null fallback keeps Suspense boundaries quiet during SSR/CSR transitions.
  loading: () => null,
});

const AddService = ({ serviceData = null, isUpdateMode = false, onSuccess = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    startingPrice: "",
    serviceCategory: "",
    serviceImage: null,
    serviceDescription: ""
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  const { data: categoriesData, error: categoriesError } = useGetAllCategoriesQuery();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  
  const isLoading = isCreating || isUpdating;
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  // Pre-fill form when in update mode
  useEffect(() => {
    if (isUpdateMode && serviceData) {
      setFormData({
        serviceTitle: serviceData.title || "",
        startingPrice: serviceData.price?.toString() || "",
        serviceCategory: serviceData.category?._id || serviceData.category || "",
        serviceImage: null,
        serviceDescription: serviceData.description || ""
      });
      
      if (serviceData.images && serviceData.images.length > 0) {
        setExistingImages(serviceData.images.filter(img => img && img.trim() !== ''));
      }
    }
  }, [isUpdateMode, serviceData]);

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Describe your service in detail...',
    height: 300,
    toolbarAdaptive: false,
    toolbarButtonSize: "medium",
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', '|',
      'align', '|',
      'link', '|',
      'undo', 'redo', '|',
      'preview'
    ],
    style: {
      background: '#fff',
      color: '#000'
    }
  }), []);

  const serviceCategories = categoriesData?.data?.result?.map(category => ({
    value: category?._id || category?.id, 
    label: category?.name 
  })) || [];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error("Please select valid image files only");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 5MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setNewImages(prev => [...prev, ...validFiles]);
        setErrors(prev => ({
          ...prev,
          serviceImage: ""
        }));
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setDeletedImages(prev => [...prev, imageUrl]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceTitle.trim()) {
      newErrors.serviceTitle = "Service title is required";
    } else if (formData.serviceTitle.trim().length < 3) {
      newErrors.serviceTitle = "Service title must be at least 3 characters";
    }

    if (!formData.startingPrice.trim()) {
      newErrors.startingPrice = "Starting price is required";
    } else if (isNaN(formData.startingPrice) || parseFloat(formData.startingPrice) <= 0) {
      newErrors.startingPrice = "Please enter a valid price";
    }

    if (!formData.serviceCategory) {
      newErrors.serviceCategory = "Please select a service category";
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.serviceDescription;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    if (!plainText.trim()) {
      newErrors.serviceDescription = "Service description is required";
    } else if (plainText.trim().length < 10) {
      newErrors.serviceDescription = "Description must be at least 10 characters";
    }

    if (!isUpdateMode && !formData.serviceImage && newImages.length === 0 && existingImages.length === 0) {
      newErrors.serviceImage = "At least one service image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const servicePayload = {
      title: formData.serviceTitle,
      price: Number(formData.startingPrice),
      category: formData.serviceCategory,
      description: formData.serviceDescription, // Keep HTML for rich text
      deletedImages: deletedImages,
    };

    // Add location data if available in update mode
    if (isUpdateMode && serviceData?.location) {
      servicePayload.location = serviceData.location;
    }
    if (isUpdateMode && serviceData?.address) {
      servicePayload.address = serviceData.address;
    }
    if (isUpdateMode && serviceData?.city) {
      servicePayload.city = serviceData.city;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(servicePayload));

    // Append new images with key 'service_image'
    newImages.forEach((file) => {
      formDataToSend.append('service_image', file);
    });

    console.log('Submitting form data...', servicePayload);

    let result;
    if (isUpdateMode) {
      result = await updateService(formDataToSend).unwrap();
    } else {
      result = await createService(formDataToSend).unwrap();
    }
    
    console.log("API Response:", result);
    
    if (result?.success) {
      const message = isUpdateMode ? "Service updated successfully!" : "Service added successfully!";
      toast.success(message);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Reset form only if not in update mode
        if (!isUpdateMode) {
          setFormData({
            serviceTitle: "",
            startingPrice: "",
            serviceCategory: "",
            serviceImage: null,
            serviceDescription: ""
          });
          
          setImagePreview(null);
          setNewImages([]);
          setExistingImages([]);
          setDeletedImages([]);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          
          if (editorRef.current) {
            editorRef.current.value = '';
          }
        }
      }
    }
  } catch (error) {
    console.error(`Failed to ${isUpdateMode ? 'update' : 'create'} service:`, error);
    
    const errorMessage = error?.data?.message || error?.message || `Failed to ${isUpdateMode ? 'update' : 'add'} service. Please try again.`;
    toast.error(errorMessage);
    
    setErrors(prev => ({
      ...prev,
      submit: errorMessage
    }));
  }
};

  return (
    <div className="project_container px-6 bg-white p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            {isUpdateMode ? "Update Service" : "Add Service"}
          </h1>
        </div>
        {isUpdateMode && onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Service Images {isUpdateMode && "(You can add more or remove existing)"}
          </label>
          
          {/* Existing Images (Update Mode) */}
          {isUpdateMode && existingImages.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-medium">Existing Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((imgUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 md:h-40 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imgUrl}
                        alt={`Service image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeExistingImage(imgUrl)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-medium">New Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 md:h-40 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload Area */}
          {(existingImages.length === 0 && newImages.length === 0) || (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-800 hover:bg-green-50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-green-800" />
                </div>
                <div>
                  <p className="text-gray-600 font-medium text-sm">
                    + Add More Images
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {errors.serviceImage && (
            <p className="text-sm text-red-600">{errors.serviceImage}</p>
          )}
        </div>

        {/* Service Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Service Title
          </label>
          <input
            type="text"
            value={formData.serviceTitle}
            onChange={(e) => handleInputChange('serviceTitle', e.target.value)}
            placeholder="e.g. Office Cleaning"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent ${
              errors.serviceTitle ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.serviceTitle && (
            <p className="text-sm text-red-600">{errors.serviceTitle}</p>
          )}
        </div>

        {/* Starting Price and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starting Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Starting Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.startingPrice}
              onChange={(e) => handleInputChange('startingPrice', e.target.value)}
              placeholder="e.g. 24.00"
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent ${
                errors.startingPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          
          </div>

          {/* Service Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Service Category
            </label>
            <select
              value={formData.serviceCategory}
              onChange={(e) => handleInputChange('serviceCategory', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent bg-white ${
                errors.serviceCategory ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Service Category</option>
              {serviceCategories.map((category, index) => (
                <option key={index} value={category.value}>
                  {category?.label} 
                </option>
              ))}
            </select>
            {errors.serviceCategory && (
              <p className="text-sm text-red-600">{errors.serviceCategory}</p>
            )}
          </div>
        </div>

        {/* Service Description with Jodit Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Service Description
          </label>
          
          <div className={`border rounded-md focus-within:ring-2 focus-within:ring-green-800 focus-within:border-transparent ${
            errors.serviceDescription ? 'border-red-500' : 'border-gray-300'
          }`}>
            <JoditEditor
              ref={editorRef}
              value={formData.serviceDescription}
              config={editorConfig}
              onBlur={(newContent) => handleInputChange('serviceDescription', newContent)}
              onChange={(newContent) => {
                handleInputChange('serviceDescription', newContent);
              }}
            />
          </div>
          
          {errors.serviceDescription && (
            <p className="text-sm text-red-600">{errors.serviceDescription}</p>
          )}
          
          {/* Character Count */}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {formData.serviceDescription.replace(/<[^>]*>/g, '').length}/500 characters
            </p>
            <p className="text-xs text-gray-500">
              Use toolbar for rich text formatting
            </p>
          </div>
        </div>


        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 cursor-pointer px-8 py-3 rounded-md font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#00786f] hover:bg-green-800 active:bg-green-800'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isUpdateMode ? 'Updating Service...' : 'Creating Service...'}
              </div>
            ) : (
              isUpdateMode ? 'Update Service' : 'Create Service'
            )}
          </button>
          {isUpdateMode && onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-8 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddService;
