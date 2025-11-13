"use client";
import registration_img from "../../../../public/login_page_image.png";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useVerifyResetOtpMutation } from "@/lib/features/auth/authApi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const VerfiyOtp = () => {
  const [otp, setOtp] = useState(Array(5).fill("")); 
  const inputRefs = useRef([]);
  const router = useRouter();
  

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userEmail = user?.email;
  
  const [verifyResetOtp, { isLoading, isError, error, isSuccess }] = useVerifyResetOtpMutation();
  useEffect(() => {
    console.log("Logged in user:", user);
    console.log("User email:", userEmail);
    console.log("Is authenticated:", isAuthenticated);
  }, [user, userEmail, isAuthenticated]);

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target);
      if (index > 0) {
        setOtp((prevOtp) => [
          ...prevOtp.slice(0, index - 1),
          "",
          ...prevOtp.slice(index),
        ]);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated and has email
    if (!isAuthenticated || !userEmail) {
      toast.error("User not authenticated. Please login again.", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        },
      });
      return;
    }

    const resetCode = otp.join("");
    

    
    try {
      const result = await verifyResetOtp({
        email: userEmail, // Use logged in user's email
        resetCode: parseInt(resetCode)
      }).unwrap();
      
      toast.success("OTP verified successfully!", {
        style: {
          backgroundColor: "#d1fae5",
          color: "#065f46",
          borderLeft: "6px solid #10b981",
        },
      });
      
      // router.push("/reset-password");
      
    } catch (err) {
      console.error("Failed to verify OTP:", err);
      toast.error(err?.data?.message || "Invalid OTP. Please try again.", {
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
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip md:shadow-2xl">
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
                      Verify your OTP
                    </h1>
                    <p className="text-[#1F2937]">
                      Please enter the code we've sent to your phone number
                      {userEmail && (
                        <span className="block text-sm text-gray-600 mt-1">
                          (Verifying for: {userEmail})
                        </span>
                      )}
                    </p>

                    {/* User not authenticated warning */}
                    {!isAuthenticated && (
                      <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
                        Please login to verify OTP
                      </div>
                    )}

                    {/* -------------------form------------------------------ */}
                    <div className="flex items-center justify-center py-4">
                      <form id="otp-form" className="flex gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onPaste={handlePaste}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
                          />
                        ))}
                      </form>
                    </div>

                    <div className="mt-4 flex w-full text-center rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                      <button
                        onClick={handleVerify}
                        disabled={isLoading || otp.some(digit => digit === "") || !isAuthenticated}
                        className="bg-[#115E59] w-full py-2 text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Verifying..." : "Verify"}
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

export default VerfiyOtp;