"use client";
import registration_img from "../../../../public/login_page_image.png";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "@/lib/features/auth/authApi";
import { useDispatch } from "react-redux";
import { updateAddressStatus } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/useAuth";
import { X } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const VerifyReg = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [updateProfile, { isLoading, isError, error }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setFileType(selectedFile.type);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
      setFileType(null);
    }
  }, [selectedFile]);

  const onSubmit = async (data) => {
    try {
      if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
        toast.error(`File size exceeds the maximum limit of 5MB. Please choose a smaller file.`);
        return;
      }

      const formData = new FormData();
      formData.append('city', data.city);
      formData.append('street', data.street);
      if (selectedFile) {
        formData.append('address_document', selectedFile);
      }

      const result = await updateProfile(formData).unwrap();
      
      if (result.success) {
        toast.success("Address verified successfully!");
        dispatch(updateAddressStatus(true));
        
        setTimeout(() => {
          if (user?.role === 'provider') {
            router.push('/service_provider_profile');
          } else {
            router.push('/');
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      
      if (err.status === 401) {
        // Handle unauthorized error without logging out
        toast.error('Session expired. Please try again.');
        return; // Don't show other error messages
      } else if (err.status === 'FETCH_ERROR') {
        toast.error('Network error: Unable to connect to server. Please check your internet connection or try again later.');
      } else if (err.status === 'PARSING_ERROR') {
        toast.error('Server response error. Please try again.');
      } else if (err.data?.message) {
        toast.error(err.data.message);
      } else if (err.error) {
        toast.error(err.error);
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds the maximum limit of 5MB. Please choose a smaller file.`);
        // Reset file input
        e.target.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PNG, JPG, SVG, WEBP, or PDF files only.');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
      toast.success('File selected successfully!');
    }
  };

  const handleDeleteFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    // Reset file input
    const fileInput = document.getElementById('uploadFile1');
    if (fileInput) {
      fileInput.value = '';
    }
    toast.info('File removed');
  };

  const isImageFile = (type) => {
    return type && type.startsWith('image/');
  };

  return (
    <section>
      <div className="max-w-[1100px] mx-auto h-[1200px] flex items-center justify-center max-h-screen  ">
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip shadow-2xl">
          {/* Left Side - Images */}
          <div className="hidden md:block overflow-hidden w-full h-full">
            <div className="w-auto ">
              <Image
                src={registration_img}
                alt="Worker"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="flex w-full items-center ">
            <div>
              <div className=" flex flex-col items-center justify-center py-6 ">
                <div className="w-full">
                  <div className="p-6 sm:p-8 ">
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Provide Your Address
                    </h1>
                    <p className="text-[#1F2937]">
                      Please provide your valid address, and verify it to
                      confirm your identity.
                    </p>
                    {/* -------------------form------------------------------ */}
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          City / LGA
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("city", { required: "City is required" })}
                            name="city"
                            type="text"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Ikeja, Surulere"
                          />
                        </div>
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Street Address
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("street", { required: "Street address is required" })}
                            name="street"
                            type="text"
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Enter Street Address"
                          />
                        </div>
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {!selectedFile ? (
                          <label className="bg-white text-slate-500 font-semibold text-base rounded h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto w-full hover:border-[#115E59] transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-11 mb-3 fill-gray-500"
                              viewBox="0 0 32 32"
                            >
                              <path
                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                data-original="#000000"
                              />
                              <path
                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                data-original="#000000"
                              />
                            </svg>
                            Upload Address Verification Document
                            <input
                              type="file"
                              id="uploadFile1"
                              className="hidden"
                              accept=".png,.jpg,.jpeg,.svg,.webp,.pdf"
                              onChange={handleFileChange}
                            />
                            <p className="text-xs font-medium text-slate-400 mt-2">
                              PNG, JPG SVG, WEBP and PDF are Allowed.
                            </p>
                            <p className="text-xs font-medium text-[#115E59] mt-1">
                              Maximum file size: 5MB
                            </p>
                          </label>
                        ) : (
                          <div className="relative bg-white border-2 border-gray-300 rounded-lg p-4">
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={handleDeleteFile}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors z-10"
                              title="Delete file"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            {/* Preview */}
                            <div className="mt-2">
                              {isImageFile(fileType) && previewUrl ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="relative w-full max-h-64 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                      src={previewUrl}
                                      alt="Preview"
                                      width={500}
                                      height={300}
                                      className="w-full h-auto object-contain"
                                    />
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2">
                                    {selectedFile.name}
                                  </p>
                                  <p className={`text-xs ${selectedFile.size > MAX_FILE_SIZE * 0.8 ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB / 5 MB max
                                  </p>
                                  {selectedFile.size > MAX_FILE_SIZE * 0.8 && (
                                    <p className="text-xs text-orange-500 mt-1">
                                      File size is close to limit
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 p-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-16 h-16 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <p className="text-sm font-medium text-gray-700">
                                    {selectedFile.name}
                                  </p>
                                  <p className={`text-xs ${selectedFile.size > MAX_FILE_SIZE * 0.8 ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB / 5 MB max
                                  </p>
                                  {selectedFile.size > MAX_FILE_SIZE * 0.8 && (
                                    <p className="text-xs text-orange-500 mt-1">
                                      File size is close to limit
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    PDF Document
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Change File Button */}
                            <label
                              htmlFor="uploadFile1"
                              className="mt-3 block text-center text-sm text-[#115E59] hover:text-[#0d4d47] cursor-pointer font-medium"
                            >
                              Change File
                            </label>
                            <input
                              type="file"
                              id="uploadFile1"
                              className="hidden"
                              accept=".png,.jpg,.jpeg,.svg,.webp,.pdf"
                              onChange={handleFileChange}
                            />
                          </div>
                        )}
                        <p className="text-xs text-red-500">
                          Document must be issued within the last 6 months*
                        </p>
                      </div>

                      {isError && (
                        <div className="text-sm text-red-500">
                          {error?.data?.message || "An error occurred"}
                        </div>
                      )}

                      <div className="mt-4 flex rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="bg-[#115E59] text-center w-full py-2 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyReg;
