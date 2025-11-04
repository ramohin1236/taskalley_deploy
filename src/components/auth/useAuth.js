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
    router.push("/login");
  };

  return {
    ...auth,
    logout: handleLogout,
    isCustomer: auth.user?.role === 'customer',
    isProvider: auth.user?.role === 'provider',
  };
};

