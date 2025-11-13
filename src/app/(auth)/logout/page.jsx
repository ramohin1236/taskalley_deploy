"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/features/auth/authSlice";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Dispatch logout action to clear Redux state
    dispatch(logout());
    
    // Clear refreshToken cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
      if (process.env.NODE_ENV === 'production') {
        document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax; Secure';
      }
    }
    
    // Redirect to login page
    router.push("/login");
  }, [dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
    </div>
  );
};

export default LogoutPage;

