'use client'

import Heading from "@/components/ui/Heading";
import React from "react";

import cateimg1 from "../../../../public/cat1.svg";
import cateimg2 from "../../../../public/service2.svg";
import service3 from "../../../../public/service3.svg";
import service4 from "../../../../public/service4.svg";
import service5 from "../../../../public/service5.svg";
import service6 from "../../../../public/service6.svg";
import CategoriesCard from "@/components/ui/CategoriesCard";
import Link from "next/link";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";



const Categories = () => {
    const { data, isLoading, error } = useGetAllCategoriesQuery();
      const category = data?.data?.result
      console.log(category)
  return (
    <section className="project_container px-4 pt-4 pb-28">
      <div className="mb-14">
        <Heading
          heading="Explore Service Categories"
          text="Discover a wide range of trusted services tailored to your needs. Choose a category to find reliable professionals in your area."
          headingStyle="text-2xl font-[#1F2937]"
          textStyle="text-lg"
          containerStyle="bg-gray-100"
        />
      </div>
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category?.map((item, index) => (
          <Link key={item._id} href="/browseservice">
            <CategoriesCard
             item ={item}
              icon={item.icon}
              title={item.cateName}
              subtitle={item.providers}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
