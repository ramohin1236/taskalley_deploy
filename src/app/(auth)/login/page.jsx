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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 p-1 focus:outline-none"
                          >
                            {showPassword ? (
                              // Eye slash icon (when password is visible)
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-slate-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                              </svg>
                            ) : (
                              // Eye icon (when password is hidden)
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-slate-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4">
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
                          disabled={isLoading}
                          className="bg-[#115E59] w-full py-2 text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <svg 
                                className="animate-spin h-5 w-5 text-white" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <circle 
                                  className="opacity-25" 
                                  cx="12" 
                                  cy="12" 
                                  r="10" 
                                  stroke="currentColor" 
                                  strokeWidth="4"
                                ></circle>
                                <path 
                                  className="opacity-75" 
                                  fill="currentColor" 
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Signing In...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </div>
                    </form>
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