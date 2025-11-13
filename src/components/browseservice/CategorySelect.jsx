"use client";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import React from "react";

const CategorySelect = ({ value, onChange }) => {
  const { data, isLoading, error } = useGetAllCategoriesQuery();
  const categories = data?.data?.result;

  if (isLoading) {
    return (
      <div className="w-full max-w-sm">
        <select className="w-full px-4 py-2 pr-10 border border-[#6B7280] rounded-lg shadow-sm text-[#6B7280]">
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pr-10 border border-[#6B7280] rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6B7280] focus:border-[#6B7280] text-[#6B7280]"
      >
        <option value="">All Categories</option>
        {categories?.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;