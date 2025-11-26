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

const RegisterContent = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer';
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { phone: '+' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const [registerUser, { isLoading, isError, isSuccess, error }] = useRegisterMutation();

  const onSubmit = async (data) => {
  try {
    const payload = { ...data, role };
    const result = await registerUser(payload).unwrap();
    if (result.success) {
      localStorage.setItem('email', data.email); 
      
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
    toast.error("Registration failed. Please try again.", {
      style: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        borderLeft: "6px solid #dc2626",
      }
    });
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
          {...register("confirmPassword", { required: true })}
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          required
          className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-10 rounded-md outline-blue-600"
          placeholder="Confirm password"
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-3 p-1 focus:outline-none"
        >
          {showConfirmPassword ? (
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

const Register = () => (
  <Suspense fallback={null}>
    <RegisterContent />
  </Suspense>
);

export default Register;
