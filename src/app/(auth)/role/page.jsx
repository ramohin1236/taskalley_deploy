"use client";
import registration_img from "../../../../public/login_page_image.png";
import main_logo from "../../../../public/main_logo_svg.svg";
import customer from "../../../../public/customer.svg"
import service_provider from "../../../../public/service_providers.svg"
import React from "react";
import Image from "next/image";
import Link from "next/link";

const page = () => {

  return (
    <section className="">
      <div className="max-w-[1000px] mx-auto h-[1200px] flex items-center justify-center max-h-screen  ">
        <div className="flex items-center justify-center bg-[#F8FAFC] rounded-sm overflow-clip shadow-2xl">
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
          <div className="flex w-full items-center justify-center p-6">
            <div className="max-w-xl rounded-2xl p-8">
              {/* Logo */}
              <div className="flex items-center justify-center mb-6 w-full">
                <span className="text-xl font-bold text-[#115e59]">
                  <Image src={main_logo} alt="main logo "className="w-44"/>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-center mb-2">
                Choose Your Role to Get Started
              </h2>
              <p className="text-center text-gray-500 mb-6 text-sm">
                Select how you'd like to use our platform — whether you're here
                to book services or offer them professionally.
              </p>

              {/* Options */}
              <div className="space-y-4 space-x-2">
                <Link
                  href={{ pathname: 'register', query: { role: 'customer' } }}
                  className="w-full flex items-center gap-4 border rounded-lg py-3 px-4 text-xl md:text-2xl transition border-[#878b92] bg-white font-semibold" 
              
                >
                 <Image src={customer} alt="customer" className="w-20"/>
                  Customer
                </Link>
                <Link
                 href={{ pathname: 'register', query: { role: 'provider' } }}
                  className="w-full flex items-center gap-4 border rounded-lg py-3 px-4 transition border-[#878b92] bg-white text-xl md:text-2xl font-semibold">
                 <Image src={service_provider} alt="customer"  className="w-20"/>
                  Service Provider
                </Link>
              </div>

             <div className="mt-4 rounded-sm overflow-clip transition transform duration-300 hover:scale-101" >
                 <button className="bg-[#115E59] w-full py-2 text-white cursor-pointer ">Continue</button>
            </div>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
