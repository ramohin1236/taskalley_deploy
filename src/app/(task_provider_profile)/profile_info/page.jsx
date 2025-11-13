"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import client from "../../../../public/client.png";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { useGetMyProfileQuery } from "@/lib/features/auth/authApi";
import { useSelector } from "react-redux";

const ProfileInfo = () => {
  const { data, isLoading, error } = useGetMyProfileQuery();
   const role = useSelector((state) => state?.auth?.user?.role);
  
  // User data from API
  const userData = data?.data;
  
  console.log("User Profile Data:", userData?.profile_image);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <CgProfile className="text-2xl text-gray-600" />
          <h2 className="font-semibold text-gray-600 text-lg sm:text-xl lg:text-2xl">
            Profile Info
          </h2>
        </div>
        <div className="bg-white shadow-sm lg:shadow rounded-xl overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="animate-pulse">
              <div className="hidden lg:flex lg:items-start lg:gap-12">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-24"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <CgProfile className="text-2xl text-gray-600" />
          <h2 className="font-semibold text-gray-600 text-lg sm:text-xl lg:text-2xl">
            Profile Info
          </h2>
        </div>
        <div className="bg-white shadow-sm lg:shadow rounded-xl p-8 text-center">
          <p className="text-red-500">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <button className="hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <CgProfile className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
          <h2 className="font-semibold text-gray-600 text-lg sm:text-xl lg:text-2xl">
            Profile Info
          </h2>
        </div>

        {/* Content */}
        <div className="bg-white shadow-sm lg:shadow rounded-xl overflow-hidden">
          {/* Mobile Header Section */}
          <div className="lg:hidden bg-gradient-to-r from-[#115e59] to-[#0d4a42] px-6 py-8 text-center">
            <Image
              src={userData?.profileImage || client}
              alt="profile"
              width={120}
              height={120}
              className="rounded-full mx-auto border-4 border-white shadow-lg mb-4"
            />
            <h3 className="text-white text-xl font-semibold mb-1">
              {userData?.firstName && userData?.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData?.name || "User Name"
              }
            </h3>
            <p className="text-green-100 text-sm">
              {userData?.role === "provider" ? "Service Provider" : "Customer"}
            </p>
          </div>

          <div className="p-6 lg:p-8">
            {/* Desktop Layout */}
            <div className="hidden lg:flex lg:items-start lg:gap-12">
              {/* Profile Image - Desktop */}
              <div className="flex-shrink-0">
                <Image
                  src={userData?.profileImage || client}
                  alt="profile"
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-gray-100 shadow-lg"
                />
              </div>

              {/* Info Grid - Desktop */}
              <div className="flex-1">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-8">
                    <div className="group">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                        Name
                      </h3>
                      <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg">
                        {userData?.firstName && userData?.lastName 
                          ? `${userData.firstName} ${userData.lastName}`
                          : userData?.name || "Not provided"
                        }
                      </p>
                    </div>
                    <div className="group">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                        Phone Number
                      </h3>
                      <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg">
                        {userData?.phoneNumber || userData?.phone || "Not provided"}
                      </p>
                    </div>
                    <div className="group">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                        Role
                      </h3>
                      <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg capitalize">
                        {role || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    <div className="group">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                        Email
                      </h3>
                      <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg break-all">
                        {userData?.email || "Not provided"}
                      </p>
                    </div>
                    <div className="group">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                        Location
                      </h3>
                      <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg leading-relaxed">
                        {userData?.address ? (
                          <>
                            {userData.address.street && <>{userData.address.street}<br /></>}
                            {userData.address.city && <>{userData.address.city}, </>}
                            {userData.address.state && <>{userData.address.state}, </>}
                            {userData.address.zipCode && <>{userData.address.zipCode}<br /></>}
                            {userData.address.country && <>{userData.address.country}</>}
                            {!userData.address.street && !userData.address.city && "Not provided"}
                          </>
                        ) : userData?.location ? (
                          userData.location
                        ) : (
                          userData?.city && userData?.street ? (
                            <>
                              {userData.city}, {userData.street}
                            </>
                          ) : (
                            "Not provided"
                          )
                        )}
                      </p>
                    </div>
                    {/* {userData?.dateOfBirth && (
                      <div className="group">
                        <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                          Date of Birth
                        </h3>
                        <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg">
                          {new Date(userData.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    )} */}
                  </div>
                </div>

                {/* Additional Info - Desktop */}
                {(userData?.rating || userData?.completedJobs) && (
                  <div className="mt-8 grid grid-cols-2 gap-6 max-w-md">
                    {userData?.rating && (
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-600 text-xl font-bold">
                            {userData.rating}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">Rating</p>
                      </div>
                    )}
                    {userData?.completedJobs && (
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 text-xl font-bold">
                            {userData.completedJobs}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">Completed Jobs</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Update Button - Desktop */}
                <div className="mt-10">
                  <Link
                    href="/update_info"
                    className="inline-flex items-center px-8 py-3 border-2 border-[#115e59] rounded-xl hover:bg-[#115e59] hover:text-white transition-all duration-300 text-[#115e59] font-medium text-lg hover:shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              {/* Info Cards - Mobile */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Name
                  </h3>
                  <p className="text-gray-600 text-base ml-5">
                    {userData?.firstName && userData?.lastName 
                      ? `${userData.firstName} ${userData.lastName}`
                      : userData?.name || "Not provided"
                    }
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Email
                  </h3>
                  <p className="text-gray-600 text-base ml-5 break-all">
                    {userData?.email || "Not provided"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Phone Number
                  </h3>
                  <p className="text-gray-600 text-base ml-5">
                    {userData?.phoneNumber || userData?.phone || "Not provided"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Role
                  </h3>
                  <p className="text-gray-600 text-base ml-5 capitalize">
                    {userData?.role || "Not specified"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Location
                  </h3>
                  <p className="text-gray-600 text-base ml-5 leading-relaxed">
                    {userData?.address ? (
                      <>
                        {userData.address.street && <>{userData.address.street}<br /></>}
                        {userData.address.city && <>{userData.address.city}, </>}
                        {userData.address.state && <>{userData.address.state}, </>}
                        {userData.address.zipCode && <>{userData.address.zipCode}<br /></>}
                        {userData.address.country && <>{userData.address.country}</>}
                        {!userData.address.street && !userData.address.city && "Not provided"}
                      </>
                    ) : userData?.location ? (
                      userData.location
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                {userData?.dateOfBirth && (
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                      <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                      Date of Birth
                    </h3>
                    <p className="text-gray-600 text-base ml-5">
                      {new Date(userData.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Update Button - Mobile */}
              <div className="pt-4">
                <Link
                  href="/update_info"
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-[#115e59] rounded-xl hover:bg-[#115e59] hover:text-white transition-all duration-300 text-[#115e59] font-medium text-lg hover:shadow-lg active:scale-95"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards - Mobile Only */}
        {(userData?.rating || userData?.completedJobs) && (
          <div className="lg:hidden mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userData?.rating && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 text-xl font-bold">{userData.rating}</span>
                  </div>
                  <p className="text-gray-600 text-sm">Rating</p>
                </div>
              </div>
            )}
            {userData?.completedJobs && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 text-xl font-bold">{userData.completedJobs}</span>
                  </div>
                  <p className="text-gray-600 text-sm">Completed Jobs</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;