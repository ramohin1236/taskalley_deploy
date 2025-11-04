"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect authenticated users away from public routes (login, register)
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
      </div>
    );
  }

  // Don't render children if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default PublicRoute;

