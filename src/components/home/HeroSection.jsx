import Link from "next/link";
import React from "react";
import bg_image from "../../../public/shadow bg.svg";
import Image from "next/image";
import image1 from "../../../public/image-1.svg";
import image2 from "../../../public/image-2.svg";
import image3 from "../../../public/image-3.svg";

const HeroSection = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 pt-8">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:mt-24 gap-10 lg:gap-20">
        {/* Left Side */}
        <div className="flex flex-col gap-6 text-center lg:text-left w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl font-bold leading-snug">
            One Platform. Every <br className="hidden lg:block" /> Service. Zero
            Hassle.
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Post a task, receive bids, and hire the right person — all in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/service-listing"
              className="flex items-center justify-center px-5 py-3 bg-color text-white rounded-md hover:bg-teal-900 transition transform duration-300 hover:scale-105 text-base md:text-lg"
            >
              Browse Services
            </Link>
            <Link
              href="/post_task"
              className="px-5 py-3 border-2 text-color border-teal-800 rounded-md hover:bg-teal-800 hover-white transition transform duration-300 text-base md:text-lg"
            >
              Post a task
            </Link>
          </div>
        </div>
        {/* Right Side */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 flex items-center justify-center -left-6 md:-left-10 lg:-left-28">
            <Image
              src={bg_image}
              width={600}
              alt="Pattern"
              className="opacity-50 max-w-full h-auto"
            />
          </div>

          {/* Images container */}
          <div className="relative flex items-center gap-3 sm:gap-4 lg:gap-6">
            {/* Left column images */}
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
              <Image
                src={image1}
                alt="Service 1"
                className="rounded-2xl object-cover w-28 sm:w-36 md:w-48 lg:w-52"
              />
              <Image
                src={image2}
                alt="Service 2"
                className="rounded-2xl object-cover w-28 sm:w-36 md:w-48 lg:w-52"
              />
            </div>

            {/* Right single image */}
            <Image
              src={image3}
              alt="Service 3"
              className="rounded-2xl object-cover w-28 sm:w-36 md:w-48 lg:w-52"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
