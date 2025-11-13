"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/lib/features/auth/authSlice";

const CustomerProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    // If authenticated but not a customer, logout and redirect to login
    if (!isLoading && isAuthenticated && user?.role !== 'customer') {
      // Logout the user
      dispatch(logout());
      
      // Clear refreshToken cookie
      if (typeof document !== 'undefined') {
        document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
      }
      
      // Redirect to login
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, user, router, dispatch]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or not a customer
  if (!isAuthenticated || user?.role !== 'customer') {
    return null;
  }

  return <>{children}</>;
};

export default CustomerProtectedRoute;

