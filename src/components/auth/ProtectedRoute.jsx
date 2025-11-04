"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // Redirect to home or appropriate page if role doesn't match
      router.push("/");
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

