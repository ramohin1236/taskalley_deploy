"use client";
import registration_img from "../../../../public/login_page_image.png";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import main_logo from "../../../../public/main_logo_svg.svg";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

const RegisterContent = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer';
  const router = useRouter();
  const [phoneValue, setPhoneValue] = useState("");
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePhoneNumber = (value) => {
    if (!value) {
      return "Phone number is required";
    }
    if (!isValidPhoneNumber(value)) {
      return "Please enter a valid phone number";
    }
    return true;
  };

  const onSubmit = async (formData) => {
    try {
     
      const phoneValidation = validatePhoneNumber(phoneValue);
      if (phoneValidation !== true) {
        setError("phone", {
          type: "manual",
          message: phoneValidation
        });
        return;
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match"
        });
        return;
      }

      // Prepare data for API
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: phoneValue,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: role,
      };

      // Call register API
      const result = await registerUser(registrationData).unwrap();
      
      if (result.success) {
        localStorage.setItem('email', formData.email); 
        
        toast.success("Registration successful! Please check your email to verify your account.", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          }
        });
        
        router.push("/verify_register_user");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err?.data?.message || "Registration failed. Please try again.", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        }
      });
    }
  };

  const handlePhoneChange = (value) => {
    setPhoneValue(value);
  
    if (value) {
      clearErrors("phone");
    }
  };

  return (
    <section className="overflow-y-scroll">
      <div className="max-w-7xl mx-auto flex items-center justify-center max-h-screen mt-12 mb-12 ">
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
                    <Link
                      href="/"
                      className="flex justify-center items-center mb-12"
                    >
                      <Image src={main_logo} alt="main_logo" className="w-44" />
                    </Link>
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Create Your Account
                    </h1>
                    <p className="text-[#1F2937]">
                      Sign up with your email and phone number to get started.
                    </p>
                    {/* -------------------form------------------------------ */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-4 space-y-2"
                    >
                      {/* name */}
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Full Name
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("name", { 
                              required: "Full name is required",
                              minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters"
                              }
                            })}
                            name="name"
                            type="text"
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 focus:border-blue-500"
                            placeholder="Write your name here"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      {/* email */}

                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Email address
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("email", { 
                              required: "Email is required",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                              }
                            })}
                            name="email"
                            type="email"
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 focus:border-blue-500"
                            placeholder="Email address"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      {/* phone */}

                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Phone Number
                        </label>
                        <div className="relative flex items-center">
                          <PhoneInput
                            international
                            defaultCountry="BD" 
                            value={phoneValue}
                            onChange={handlePhoneChange}
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600 focus:border-blue-500 outline-none"

                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* password */}
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("password", { 
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                              }
                            })}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600 focus:border-blue-500"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 p-1 focus:outline-none"
                          >
                            {showPassword ? (
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
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                      </div>
                      
                      {/* confirm pass */}
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium block">
                          Confirm Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("confirmPassword", { 
                              required: "Please confirm your password"
                            })}
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600 focus:border-blue-500"
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 p-1 focus:outline-none"
                          >
                            {showConfirmPassword ? (
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
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      {/* dont have an account */}

                      <p className="text-[#6B7280] text-base !mt-1">
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className="text-[#115E59] hover:underline ml-1 whitespace-nowrap font-semibold"
                        >
                          Sign In
                        </Link>
                      </p>

                      <div className="mt-4 rounded-sm overflow-clip transition transform duration-300 hover:scale-101 flex">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`${
                            isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#0e4d49]"
                          } bg-[#115E59] py-3 text-white cursor-pointer w-full text-center font-medium text-base transition-colors duration-300`}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : "Create Account"}
                        </button>
                      </div>
                    </form>
                    {/* social login */}
                    <p className="text-[#6B7280] font-semibold mt-2">
                      Or continue with
                    </p>
                    <div className="mt-4 flex gap-6">
                      <button 
                        type="button"
                        className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer hover:bg-gray-50"
                      >
                        <FcGoogle className="text-2xl " />
                      </button>
                      <button 
                        type="button"
                        className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer hover:bg-gray-50"
                      >
                        <FaApple className="text-2xl text-[#115e59]" />
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

const Register = () => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115E59]"></div>
    </div>
  }>
    <RegisterContent />
  </Suspense>
);

export default Register;