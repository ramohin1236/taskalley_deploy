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

const data = [
  {
    id: 1,
    cateName: "House Cleaning",
    providers: "4982 Providers",
    icon: cateimg1,
  },
  {
    id: 2,
    cateName: "Electricity Services",
    providers: "3,866 Providers",
    icon: cateimg2,
  },
  {
    id: 3,
    cateName: "Furniture Replacement",
    providers: "1,894 Providers",
    icon: service3,
  },
  {
    id: 4,
    cateName: "Mechanic Zone",
    providers: "2,894 Providers",
    icon: service4,
  },
  {
    id: 5,
    cateName: "Plumber Service",
    providers: "3,894 Providers",
    icon: service5,
  },
  {
    id: 6,
    cateName: "Painter Chaise",
    providers: "2,754 Providers",
    icon: service6,
  },
  {
    id: 7,
    cateName: "House Cleaning",
    providers: "4982 Providers",
    icon: cateimg1,
  },
  {
    id: 8,
    cateName: "Electricity Services",
    providers: "3,866 Providers",
    icon: cateimg2,
  },
  {
    id: 9,
    cateName: "Furniture Replacement",
    providers: "1,894 Providers",
    icon: service3,
  },
  {
    id: 10,
    cateName: "Mechanic Zone",
    providers: "2,894 Providers",
    icon: service4,
  },
  {
    id: 11,
    cateName: "Plumber Service",
    providers: "3,894 Providers",
    icon: service5,
  },
  {
    id: 12,
    cateName: "Painter Chaise",
    providers: "2,754 Providers",
    icon: service6,
  },
];

const Categories = () => {
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
        {data.map((item, index) => (
          <Link key={item.id} href="/browseservice">
            <CategoriesCard
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
