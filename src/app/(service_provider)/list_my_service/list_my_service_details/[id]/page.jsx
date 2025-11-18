"use client";
import React from "react";
import { useState } from "react";
import service_main_image from "../../../../../../public/main_home.jpg";
import service_second from "../../../../../../public/service_second.png";
import Image from "next/image";
import ServiceTabs from "@/components/serviceprovider/ServiceTabs";
import { PiNotePencilFill } from "react-icons/pi";
import { MdBlock } from "react-icons/md";
import { useParams } from "next/navigation";
import { useGetServiceByIdQuery } from "@/lib/features/providerService/providerServiceApi";

const ListMyServiceDetails = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const params = useParams();
  
   const serviceId = params.id;
   console.log("params",serviceId)


    const { 
    data: serviceData, 
    isLoading, 
    error, 
    isError 
  } = useGetServiceByIdQuery(serviceId);

  const info = serviceData?.data

  // console.log("serviceData",info)

  return (
    <div className="project_container mx-auto lg:p-6 overflow-clip">
      {/* Header */}
      <div className="px-6 mt-8">
        {/* heading part */}
        <div className="flex flex-col flex-co gap-3 mb-6">
          <div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {info?.title}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {info?.title}
          </h1>
        </div>

        {/* Image Grid */}
        <div className="flex flex-wrap flex-col lg:flex-row gap-4 mb-6">
          {/* Main large image */}
          <div className="flex-1">
            <Image
              src={info?.images[0]}
              width={100}
              height={100}
              alt="Professional cleaner vacuuming office"
              className="w-36 md:w-72 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            {/* Smaller images */}

            <div className="grid grid-cols-2 gap-4">
               {
  info?.images?.[1] && (
    <Image
      src={info.images[1]}
      width={100}
      height={100}
      alt="Office cleaning"
      className="w-full h-36 md:h-60 object-cover rounded-lg"
    />
  )
}
                {
  info?.images?.[2] && (
    <Image
      src={info.images[2]}
      width={100}
      height={100}
      alt="Office cleaning"
      className="w-full h-36 md:h-60 object-cover rounded-lg"
    />
  )
}
                {
  info?.images?.[3] && (
    <Image
      src={info.images[3]}
      width={100}
      height={100}
      alt="Office cleaning"
      className="w-full h-36 md:h-60 object-cover rounded-lg"
    />
  )
}
             
             {
  info?.images?.[4] && (
    <Image
      src={info.images[4]}
      width={100}
      height={100}
      alt="Office cleaning"
      className="w-full h-36 md:h-60 object-cover rounded-lg"
    />
  )
}
              
            </div>

            <div className="flex gap-4"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div >
        {/* Left Content */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-gray-600 text-sm mb-2">Starts From</div>
        <div className="text-3xl font-bold text-gray-900 mb-6">₦ {info?.price}</div>

            <ServiceTabs info={info}/>
          </div>

          <div className="flex px-2 pb-24">
            <div className="flex lg:w-1/2 gap-3">
              <button className="lg:flex-1 text-center px-4 py-3 border border-[#115e59] text-[#115e59] rounded-md hover:bg-teal-50 cursor-pointer flex items-center gap-3 justify-center">
                <PiNotePencilFill /> Update Details
              </button>
              <button className="lg:flex-1 text-center px-4 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 cursor-pointer flex items-center gap-3 justify-center">
                <MdBlock /> Inactive
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListMyServiceDetails;
