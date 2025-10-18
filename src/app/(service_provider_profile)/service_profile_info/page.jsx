import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React from "react";
import client from "../../../../public/client.png";
import Link from "next/link";

const ServiceProfileInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 lg:bg-transparent">
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <Link href='/' className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </Link>
          <h2 className="font-semibold text-gray-800 text-lg sm:text-xl lg:text-2xl">
            Profile Info
          </h2>
        </div>

        {/* Content */}
        <div className="bg-white shadow-sm lg:shadow rounded-xl overflow-hidden">
          {/* Mobile Header Section */}
          <div className="lg:hidden bg-gradient-to-r from-[#115e59] to-[#0d4a42] px-6 py-8 text-center">
            <Image
              src={client}
              alt="profile"
              width={120}
              height={120}
              className="rounded-full mx-auto border-4 border-white shadow-lg mb-4"
            />
            <h3 className="text-white text-xl font-semibold mb-1">Wade Warren</h3>
            <p className="text-green-100 text-sm">Service Provider</p>
          </div>

          <div className="p-6 lg:p-8">
            {/* Desktop Layout */}
            <div className="hidden lg:flex lg:items-start lg:gap-12">
              {/* Profile Image - Desktop */}
              <div className="flex-shrink-0">
                <Image
                  src={client}
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
                        Wade Warren
                      </p>
                    </div>
                    <div className="group">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                        Phone Number
                      </h3>
                      <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg">
                        (555) 987-6543
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
                        WadeWarren@email.com
                      </p>
                    </div>
                    <div className="group">
                      <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-[#115e59] transition-colors">
                        Location
                      </h3>
                      <p className="text-gray-600 text-lg bg-gray-50 p-3 rounded-lg leading-relaxed">
                        1234 Maple Avenue, Suite 5B<br />
                        San Diego, California, 92103, USA
                      </p>
                    </div>
                  </div>
                </div>

                {/* Update Button - Desktop */}
                <div className="mt-10">
                  <Link
                    href="/service_profile_update"
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
                  <p className="text-gray-600 text-base ml-5">Wade Warren</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Email
                  </h3>
                  <p className="text-gray-600 text-base ml-5 break-all">
                    WadeWarren@email.com
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Phone Number
                  </h3>
                  <p className="text-gray-600 text-base ml-5">(555) 987-6543</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center">
                    <span className="w-2 h-2 bg-[#115e59] rounded-full mr-3"></span>
                    Location
                  </h3>
                  <p className="text-gray-600 text-base ml-5 leading-relaxed">
                    1234 Maple Avenue, Suite 5B<br />
                    San Diego, California, 92103, USA
                  </p>
                </div>
              </div>

              {/* Update Button - Mobile */}
              <div className="pt-4">
                <Link
                  href="/service_profile_update"
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-[#115e59] rounded-xl hover:bg-[#115e59] hover:text-white transition-all duration-300 text-[#115e59] font-medium text-lg hover:shadow-lg active:scale-95"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards - Mobile Only */}
        <div className="lg:hidden mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-xl font-bold">4.8</span>
              </div>
              <p className="text-gray-600 text-sm">Rating</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 text-xl font-bold">127</span>
              </div>
              <p className="text-gray-600 text-sm">Completed Jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProfileInfo;