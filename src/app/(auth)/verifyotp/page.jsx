"use client";
import registration_img from "../../../../public/login_page_image.png";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const VerfiyOtp = () => {
  const [otp, setOtp] = useState(Array(4).fill("")); 
  const inputRefs = useRef([]);

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

  return (
    <section className="">
      <div className="max-w-[1100px] mx-auto h-[1200px] flex items-center justify-center max-h-screen  ">
        <div className="flex items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-clip md:shadow-2xl">
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
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Verify your OTP
                    </h1>
                    <p className="text-[#1F2937]">
                      Please enter the code we've sent to your Phone Number
                    </p>
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
                          {/* You can conditionally render a submit button here based on otp length */}
                        </form>
                      </div>
                   

                    <div className="mt-4 flex w-full text-center rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                      <Link
                      href="/"
                      className="bg-[#115E59] w-full py-2 text-white cursor-pointer ">
                        Verify
                      </Link>
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
