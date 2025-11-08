"use client";
import React from "react";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { usePathname } from "next/navigation";

const AuthLayout = ({ children }) => {
  const pathname = usePathname();

  
  const hideLayout = pathname === "/taskalley_launch";

  return (
    <div>
      <Toaster position="top-right" richColors />

      {/* Navbar conditionally show */}
      {!hideLayout && <Navbar />}

      <div>{children}</div>

      {/* Footer conditionally show */}
      {!hideLayout && <Footer />}
    </div>
  );
};

export default AuthLayout;
