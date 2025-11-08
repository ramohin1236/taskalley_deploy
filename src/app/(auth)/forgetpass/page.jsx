"use client";
import registration_img from "../../../../public/login_page_image.png";
import React, { useState } from "react";
import Image from "next/image";
import { useForgetPasswordMutation } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ForgetPassword = () => {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [forgetPassword, { isLoading, isError, error, isSuccess }] =
    useForgetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgetPassword({ phone }).unwrap();
      console.log("OTP sent successfully:", result);
      if (result.success) {
        toast.success("OTP sent successfully", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
        });
        router.push("/verifyotp");
      }
    } catch (err) {
      console.error("Failed to send OTP:", err);
      toast.error("Failed to send OTP. Please try again.", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        },
      });
    }
  };

  return (
    <section className="">
      <div className="max-w-[1100px] mx-auto h-[1200px] flex items-center justify-center max-h-screen">
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip shadow-2xl">
          {/* Left Side - Images */}
          <div className="hidden md:block overflow-hidden w-full h-full">
            <div className="w-auto">
              <Image
                src={registration_img}
                alt="Worker"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="flex w-full items-center">
            <div>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-full">
                  <div className="p-6 sm:p-8">
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Forget Password?
                    </h1>
                    <p className="text-[#1F2937]">
                      Please enter your Phone Number to get verification code
                    </p>

                    {/* -------------------form------------------------------ */}
                    <form className="mt-12 space-y-6" onSubmit={handleSubmit}>
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Phone Number
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="phone_number"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="+8801872970928"
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-sm overflow-clip transition transform duration-300 hover:scale-101 flex items-center text-center">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="bg-[#115E59] w-full py-2 text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Sending..." : "Continue"}
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

export default ForgetPassword;