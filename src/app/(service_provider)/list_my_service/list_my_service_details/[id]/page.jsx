"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AlertCircle, ImageOff, Loader2 } from "lucide-react";

import InfoProvider from "@/components/serviceprovider/InfoProvider";
import ServiceTabs from "@/components/serviceprovider/ServiceTabs";
import BookingCard from "@/components/serviceprovider/BookingCard";
import { useGetServiceByIdQuery } from "@/lib/features/providerService/providerServiceApi";

const ServiceDetails = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const params = useParams();
  const serviceId = params?.id;

  const {
    data: singleService,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetServiceByIdQuery(serviceId, { skip: !serviceId });

  const service = singleService?.data;

  const galleryImages = useMemo(() => {
    // Only show actual service images, no dummy images
    if (service?.images?.length) {
      return service.images.filter(img => img && img.trim() !== '');
    }
    return [];
  }, [service?.images]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#115e59]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-2">
          Could not load service
        </p>
        <p className="text-gray-600 mb-4">
          {error?.data?.message || "Please try again later."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-[#115e59] text-white hover:bg-[#0d4c47]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="project_container mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-clip">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-3 mb-6">
          <div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {service?.category?.name || "Service"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {service?.title || "Service Details"}
          </h1>
        </div>

        {/* Image Grid */}
        {galleryImages.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main large image */}
            <div className="flex-1 min-h-[280px] lg:min-h-[420px] relative rounded-lg overflow-hidden">
              <Image
                src={galleryImages[0]}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                alt={service?.title || "Service image"}
                className="rounded-lg object-cover"
                priority
              />
            </div>

            {/* Secondary images */}
            {galleryImages.length > 1 && (
              <div className="flex-1 grid grid-cols-2 gap-4">
                {galleryImages.slice(1, 5).map((img, index) => {
                  const key = typeof img === "string" ? img : img?.src || index;
                  return (
                    <div key={key} className="relative h-32 md:h-48 lg:h-52 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        fill
                        sizes="(min-width: 1024px) 30vw, 50vw"
                        alt={`${service?.title || "Service"} - ${index + 2}`}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full min-h-[280px] lg:min-h-[420px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageOff className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <InfoProvider
              provider={service?.provider}
              averageRating={service?.averageRating}
              totalRating={service?.totalRating}
            />

            <ServiceTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              service={service}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <BookingCard signgleServiceData={service} />
      </div>
    </div>
  );
};

export default ServiceDetails;
