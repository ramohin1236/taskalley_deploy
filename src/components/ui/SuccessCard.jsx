// app/congratulations/CongratulationsContent.jsx
"use client"
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CongratulationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Payment Successful!");
  const [buttonText, setButtonText] = useState("Back to Home");
  const [buttonLink, setButtonLink] = useState("/");
  const [countdown, setCountdown] = useState(3);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      setMessage(`Your order #${orderIdParam} has been placed successfully! We'll send you an email with the order details.`);
      setButtonText("View Order Details");
      setButtonLink(`/profile/orders/${orderIdParam}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (orderId) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [orderId, router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Main Content - Centered */}
      <div className="w-full flex items-center justify-center p-4 md:p-8">
        <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content Section */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center ">
              <div className="text-center lg:text-left">
                {/* Success Icon */}
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    {/* Animated rings */}
                    <div className="absolute inset-0 border-2 border-green-500/30 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-2 border-green-500/20 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-3xl font-bold text-white mb-4">
                  Congratulations!
                </h1>

                {/* Message */}
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {message}
                </p>

                {/* Countdown Timer */}
                {orderId && (
                  <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <p className="text-gray-300 text-sm">
                      Redirecting to orders page in{" "}
                      <span className="text-green-400 font-bold text-lg">{countdown}</span>{" "}
                      seconds...
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={buttonLink} className="flex-1">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-600/25">
                      {buttonText}
                    </button>
                  </Link>
                 
                </div>

               
              </div>
            </div>

            {/* Right Illustration Section */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 md:p-12 flex flex-col items-center justify-center relative">
              {/* Close Button */}
              <div className="absolute top-4 right-4">
                <Link
                  href="/"
                  className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              </div>

              {/* Illustration */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-48 h-48 md:w-56 md:h-56 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-blue-500/20">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 md:w-20 md:w-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500/20 rounded-full animate-bounce" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500/20 rounded-full animate-bounce delay-75" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">Order Confirmed!</h3>
              

                {/* Order ID Display */}
                {orderId && (
                  <div className="mt-6 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <p className="text-white text-sm font-mono">Order #: {orderId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-75" />
      </div>
    </div>
  );
}