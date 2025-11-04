"use client";
import registration_img from "../../../../public/login_page_image.png";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import main_logo from "../../../../public/main_logo_svg.svg";
import React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import Link from "next/link";
import { useForm } from "react-hook-form";

const Register = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer';
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { phone: '+' }
  });

  const [registerUser, { isLoading, isError, isSuccess, error }] = useRegisterMutation();

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, role };
      const result = await registerUser(payload).unwrap();
      console.log("Registration successful result:", result);
      if (result.success) {
        alert(
          "Registration successful! Please check your email to verify your account."
        );
      }
    } catch (err) {
      console.error("Registration failed:", err);
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
                            {...register("name", { required: true })}
                            name="name"
                            type="text"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Write your name here"
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-red-500">Full name is required.</p>
                        )}
                      </div>
                      {/* email */}

                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Email address
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("email", { required: true })}
                            name="email"
                            type="email"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Email address"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500">Email is required.</p>
                        )}
                      </div>

                      {/* phone */}

                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-1 block">
                          Phone Number
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("phone", {
                              required: true,
                              onChange: (e) => {
                                let value = e.target.value.replace(/[^\d+]/g, "");
                                if (!value.startsWith("+")) {
                                  value = "+" + value.replace(/\+/g, "");
                                }
                                e.target.value = value;
                              },
                            })}
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="+880 1XXXXXXXXX"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500">
                            Phone number is required.
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
                        {errors.password && (
                          <p className="text-red-500">Password is required.</p>
                        )}
                      </div>
                      {/* confirm  pass */}
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium block">
                          Confirm Password
                        </label>
                        <div className="relative flex items-center">
                          <input
                            {...register("confirmPassword", {
                              required: true,
                            })}
                            name="confirmPassword"
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
                        {errors.confirm_password && (
                          <p className="text-red-500">
                            Please confirm your password.
                          </p>
                        )}
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
                        <button
                          type="submit"
                          className="bg-[#115E59] py-2 text-white cursor-pointer w-full text-center"
                        >
                          Next
                        </button>
                      </div>
                    </form>
                    {/* social login */}
                    <p className="text-[#6B7280] font-semibold mt-2">
                      Or continue with
                    </p>
                    <div className="mt-4 flex gap-6">
                      <button className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer">
                        <FcGoogle className="text-2xl " />
                      </button>
                      <button className="border-1 border-[#115E59] p-3.5 rounded-sm transition transform duration-300 hover:scale-101 cursor-pointer">
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

export default Register;
