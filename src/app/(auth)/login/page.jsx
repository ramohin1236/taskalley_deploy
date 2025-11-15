"use client";
import registration_img from "../../../../public/login_page_image.png";
import main_logo from "../../../../public/main_logo_svg.svg";
import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import Link from "next/link";
import { useLoginUserMutation } from "@/lib/features/auth/authApi";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { parseJwt } from "@/utils/auth";

const Login = () => {
  const [loginUser, { isLoading, isError, isSuccess, error }] =
    useLoginUserMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    taskTitle: "",
    taskCategory: "",
    taskDescription: "",
    taskType: "in-person",
    location: "",
    taskTiming: "fixed-date",
    preferredDate: "",
    preferredTime: "",
    budget: "",
    agreedToTerms: false,
  });
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

 
  const onSubmit = async (data) => {
    try {
        const result = await loginUser(data).unwrap();
        if (result.success && result.data) {
            dispatch(setCredentials({
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
                isAddressProvided: result.data.isAddressProvided || false,
            }));
            
            const decoded = parseJwt(result?.data?.accessToken);
            const userRole = decoded?.role || 'customer';
            
            if (!result.data.isAddressProvided) {
                router.push('/verify');
            } else {
                if (userRole === 'provider') {
                    router.push('/');
                } else {
                    router.push('/');
                }
            }
        }
    } catch (err) {
        console.error("Login failed:", err);
        alert(`Login failed: ${err.data?.message || err.error}`);
    }
};



  return (
    <section className="">
      <div className="max-w-7xl mx-auto flex items-center justify-center max-h-screen mt-12 mb-12">
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip shadow-2xl">
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
          <div className="flex w-full items-center ">
            <div>
              <div className=" flex flex-col items-center justify-center py-6 ">
                <div className="w-full">
                  <div className="p-6 sm:p-8 ">
                    <Link
                      href="/"
                      className="flex justify-center items-center mb-12"
                    >
                      <Image src={main_logo} alt="main_logo" className="w-44" />
                    </Link>
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Login to Account
                    </h1>
                    <p className="text-[#1F2937]">
                      Please enter your email and password to continue
                    </p>
                    {/* -------------------form------------------------------ */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-12 space-y-6"
                    >
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Email address
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("email", { required: true })}
                            name="email"
                            type="text"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Email address"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                           {...register("password", { required: true })}
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
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.agreedToTerms}
                            onChange={(e) =>
                              handleInputChange(
                                "agreedToTerms",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: "#115e59" }}
                          />
                          <label className="ml-3 block text-sm text-[#1F2937]">
                            Remember me
                          </label>
                        </div>
                        <div className="text-sm">
                          <Link
                            href="forgetpass"
                            className="text-[#115E59] hover:underline font-semibold"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                      </div>
                      {/* line or  */}
                      <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-[#6B7280]"></div>
                        <span className="mx-4 text-gray-500">OR</span>
                        <div className="flex-grow border-t border-[#6B7280]"></div>
                      </div>
                      {/* dont have an account */}

                      <p className="text-[#6B7280] text-base !mt-6">
                        Don't have an account?{" "}
                        <Link
                          href="register"
                          className="text-[#115E59] hover:underline ml-1 whitespace-nowrap font-semibold"
                        >
                          Register here
                        </Link>
                      </p>

                      <div className="mt-4 rounded-sm overflow-clip transition transform duration-300 hover:scale-101 flex w-full text-center">
                        <button
                          type="submit"
                          className="bg-[#115E59] w-full py-2 text-white cursor-pointer "
                        >
                          Sign In
                        </button>
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
                        <FaApple className="text-2xl text-blue-500" />
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
  );
};

export default Login;
