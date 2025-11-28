"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import FilterSection from "@/components/serviceprovider/FilterSection";
import RadioFilter from "@/components/serviceprovider/RadioFilter";
import { useGetAllCategoriesQuery, useGetDuplicateAllServicesQuery } from "@/lib/features/category/categoryApi";
import ServiceCard from "@/components/serviceprovider/ServiceCard";
import Link from "next/link";

const ServiceListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSortBy, setSelectedSortBy] = useState("");
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const limit = 8;
  const { data: servicesData, isLoading: servicesLoading, error } = useGetDuplicateAllServicesQuery({
    page: currentPage,
    searchTerm: debouncedSearch,
    category: selectedCategory !== "all" ? selectedCategory : "",
    sortBy: selectedSortBy,
  });
  
  console.log("service data", servicesData)

  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  
  useEffect(() => {
    console.log(" DEBUG - API Call Parameters:", {
      page: currentPage,
      searchTerm: debouncedSearch,
      category: selectedCategory !== "all" ? selectedCategory : "",
      sortBy: selectedSortBy
    });
  }, [currentPage, debouncedSearch, selectedCategory, selectedSortBy, servicesData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const serviceCategories = categoriesData?.data?.result
    ? [
      { id: "all", label: "All Categories" },
      ...categoriesData.data.result.map(cat => ({
        id: cat._id,
        label: cat.name
      }))
    ]
    : [{ id: "all", label: "All Categories" }];

  const sortOptions = [
    { id: "", label: "Relevance" },
    { id: "price", label: "Price: Low to High" },
    { id: "-price", label: "Price: High to Low" },
    { id: "-averageRating", label: "Highest Rated" },
    { id: "-createdAt", label: "Newest First" },
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (sortId) => {
    setSelectedSortBy(sortId);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (servicesData?.data?.meta && currentPage < servicesData.data.meta.totalPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Loading state
  if (servicesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="project_container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 hidden lg:block animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="h-12 bg-gray-300 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="h-48 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter out inactive services - only show active services
  const allServices = servicesData?.data?.result || [];
  const services = allServices.filter(service => service.isActive === true);
  const meta = servicesData?.data?.meta || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="project_container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 hidden lg:block">
              <div>
                <FilterSection
                  title="Select Service Category"
                  isOpen={categoryFilterOpen}
                  onToggle={() => setCategoryFilterOpen(!categoryFilterOpen)}
                >
                  <RadioFilter
                    options={serviceCategories}
                    selectedOption={selectedCategory}
                    onChange={handleCategoryChange}
                    name="service-category"
                  />
                </FilterSection>
              </div>
              {/* Sort By Filter */}
              <div>
                <FilterSection
                  title="Sort By"
                  isOpen={sortByOpen}
                  onToggle={() => setSortByOpen(!sortByOpen)}
                >
                  <RadioFilter
                    options={sortOptions}
                    selectedOption={selectedSortBy}
                    onChange={handleSortChange}
                    name="sort-by"
                  />
                </FilterSection>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your service"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#115e59] focus:border-transparent"
                />
              </div>
            </div>

            {/* Services Count and Sort Info */}
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {services.length} of {meta.total || 0} services
                {selectedCategory !== "all" && ` in ${serviceCategories.find(cat => cat.id === selectedCategory)?.label}`}
                {debouncedSearch && ` for "${debouncedSearch}"`}
              </div>
              <div className="text-sm text-gray-500">
                Sorted by: {sortOptions.find(opt => opt.id === selectedSortBy)?.label || "Relevance"}
              </div>
            </div>

            {/* Services Grid */}
            {services.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {services.map((service) => (
                    <Link key={service._id} href={`/service-listing/${service._id}`}>
                      <ServiceCard service={service} />
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPage > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {[...Array(meta.totalPage)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show only nearby pages
                      if (
                        pageNumber === 1 ||
                        pageNumber === meta.totalPage ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageClick(pageNumber)}
                            className={`px-3 py-2 border text-sm font-medium rounded-md ${currentPage === pageNumber
                              ? "bg-[#115e59] text-white border-[#115e59]"
                              : "border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === meta.totalPage}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-500">
                  {debouncedSearch || selectedCategory !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No services available at the moment"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceListing;