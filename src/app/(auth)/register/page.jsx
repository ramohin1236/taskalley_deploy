import registration_img from "../../../../public/login_page_image.png";
import main_logo from "../../../../public/main_logo_svg.svg";
import React from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa6";
import Link from "next/link";

const Register = () => {
  return (
     <section className="overflow-y-scroll">
      <div className="max-w-[1800px] mx-auto md:h-[1200px] flex items-center justify-center max-h-screen  ">
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip shadow-2xl">
          {/* Left Side - Images */}
          <div className="hidden md:block overflow-hidden w-full h-full">
            <div className="w-auto ">
              <Image
                src={registration_img}
                alt="Worker"
                className="w-[600px] object-cover"
              />
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="flex w-full items-center ">
            <div>
              <div className=" flex flex-col items-center justify-center py-2 ">
                <div className="w-full">
                  <div className="p-6 sm:p-8 ">
                     <div className="flex justify-center items-center mb-12">
                                         <Image src={main_logo} alt="main_logo" className="w-44"/>
                                       </div>
                     <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Create Your Account
                    </h1>
                    <p className="text-[#1F2937]">
                      Sign up with your email and phone number to get started.
                    </p>
                    {/* -------------------form------------------------------ */}
                    <form className="mt-4 space-y-2">
                        {/* name */}
                        <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                           Full Name
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="name"
                            type="text"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Write your name here"
                          />
                        </div>
                      </div>
                    {/* email */}
                        
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Email address
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="email"
                            type="email"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Email address"
                          />
                        </div>
                      </div>

                      {/* phone */}

                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Phone Number
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="phone"
                            type="number"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="+454 45454121541"
                          />
                        </div>
                      </div>

               {/* password */}
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="password"
                            type="password"
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Enter password"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="w-4 h-4 absolute right-4 cursor-pointer"
                            viewBox="0 0 128 128"
                          >
                            <path
                              d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                              data-original="#000000"
                            ></path>
                          </svg>
                        </div>
                      </div>
               {/* confirm  pass */}
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium block">
                          Confirm  Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="confirm_password"
                            type="password"
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Enter password"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="w-4 h-4 absolute right-4 cursor-pointer"
                            viewBox="0 0 128 128"
                          >
                            <path
                              d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                              data-original="#000000"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      
                     
                      {/* dont have an account */}

                      <p className="text-[#6B7280] text-base !mt-1">
                        Already have an account?{" "}
                        <Link
                          href="login"
                          className="text-[#115E59] hover:underline ml-1 whitespace-nowrap font-semibold"
                        >
                          Sign In
                        </Link>
                      </p>

                      <div className="mt-4 rounded-sm overflow-clip transition transform duration-300 hover:scale-101 flex">
                        <Link href="verify" className="bg-[#115E59] py-2 text-white cursor-pointer w-full text-center">
                         Next
                        </Link>
                      </div>
                    </form>
                    {/* social login */}
                    <p className="text-[#6B7280] font-semibold mt-2">
                     Or continue with
                    </p>
                    <div className="mt-4 flex gap-6">
                      <button className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer">
                        <FcGoogle className="text-2xl" />
                      </button>
                      <button className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer">
                        <FaFacebookF className="text-2xl text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register