"use client";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    
    // Clear refreshToken cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
      if (process.env.NODE_ENV === 'production') {
        document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax; Secure';
      }
    }
    
    router.push("/login");
  };

  return {
    ...auth,
    logout: handleLogout,
    isCustomer: auth.user?.role === 'customer',
    isProvider: auth.user?.role === 'provider',
  };
};

