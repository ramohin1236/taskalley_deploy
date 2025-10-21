import registration_img from "../../../../public/login_page_image.png";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const ReferalCode = () => {
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
                      Have a Referral Code? Unlock Your Reward
                    </h1>
                    <p className="text-[#1F2937]">
                      Apply a referral code and get 10% OFF your first task – up
                      to ₦50!
                    </p>
                    {/* -------------------form------------------------------ */}
                    <form className="mt-12 space-y-6">
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Referral Code (Optional)
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="referal_code"
                            type="text"
                            className="w-full text-[#6B7280] text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                            placeholder="Enter referral code here (e.g., TASK-USER123)"
                          />
                        </div>
                      </div>

                      <div className="mt-4 w-full rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                       <div className="flex text-center">
                          <Link
                          href="verifyphone"
                          className="bg-[#115E59] w-full py-2 text-white cursor-pointer "
                        >
                          Apply Code & Continue
                        </Link>
                       </div>
                      </div>
                      <div className="flex">
                        <Link
                          href="verifyphone"
                          className="text-center px-6 py-2 text-[#115e59] border-1 border-[#115e59] w-full rounded-md hover:bg-[#115e59] hover:text-white transition transform duration-300"
                        >
                          Skip & Continue Without Code
                        </Link>
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

export default ReferalCode;
