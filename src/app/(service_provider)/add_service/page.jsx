"use client"

import React, { useState, useRef, useMemo } from "react";
import { Plus, Upload, X } from "lucide-react";
import { useCreateServiceMutation } from "@/lib/features/providerService/providerServiceApi";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import dynamic from 'next/dynamic';

// Dynamic import for Jodit to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  // Rendering a null fallback keeps Suspense boundaries quiet during SSR/CSR transitions.
  loading: () => null,
});

const AddService = () => {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    startingPrice: "",
    serviceCategory: "",
    serviceImage: null,
    serviceDescription: ""
  });
  
  const { data: categoriesData, error: categoriesError } = useGetAllCategoriesQuery();
  const [createService, { isLoading, error: createError }] = useCreateServiceMutation();
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

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
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          serviceImage: "Please select a valid image file"
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          serviceImage: "Image size should be less than 5MB"
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        serviceImage: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setErrors(prev => ({
        ...prev,
        serviceImage: ""
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      serviceImage: null
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    if (!formData.serviceImage) {
      newErrors.serviceImage = "Service image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
   const stripHtml = (html) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

  try {
    const serviceData = {
      title: formData.serviceTitle,
      price: Number(formData.startingPrice),
      category: formData.serviceCategory,
      description: stripHtml(formData.serviceDescription),
      deletedImages: [], 
    };

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(serviceData));

    if (formData.serviceImage) {
      formDataToSend.append('service_image', formData.serviceImage);
    }

    console.log('Submitting form data...', serviceData);

    const result = await createService(formDataToSend).unwrap();
    console.log("API Response:", result);
    
    if (result?.success) {
      setSuccessMessage("Service added successfully!");
      
      // Reset form
      setFormData({
        serviceTitle: "",
        startingPrice: "",
        serviceCategory: "",
        serviceImage: null,
        serviceDescription: ""
      });
      
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      if (editorRef.current) {
        editorRef.current.value = '';
      }

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  } catch (error) {
    console.error('Failed to create service:', error);
    
    if (error?.data?.success === false) {
      setErrors(prev => ({
        ...prev,
        submit: error.data?.message || "Failed to add service. Please try again."
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        submit: "Failed to add service. Please try again."
      }));
    }
  }
};

  return (
    <div className="project_container px-6 bg-white p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Add Service
        </h1>
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Service Image
          </label>
          
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-green-800 hover:bg-green-80 transition-colors"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-green-800" />
                </div>
                <div>
                  <p className="text-gray-600 font-medium">
                    + Upload Your Service Image
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="w-44 h-44 lg:w-72 lg:h-72">
                <img
                  src={imagePreview}
                  alt="Service preview"
                  className="w-full h-full object-cover rounded-lg border-gray-200"
                />
              </div>
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full cursor-pointer md:w-auto px-8 py-3 rounded-md font-medium transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#00786f] hover:bg-green-800 active:bg-green-800'
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Service...
            </div>
          ) : (
            'Create Service'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddService;
