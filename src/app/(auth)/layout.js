"use client";
import React from "react";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { usePathname } from "next/navigation";
import StoreProvider from "@/app/StoreProvider";

const AuthLayout = ({ children }) => {
  const pathname = usePathname();

  
  const hideLayout = pathname === "/taskalley_launch";

  return (
    <html>
      <body>
        <StoreProvider>
          <Toaster position="top-right" richColors />

          {/* Navbar conditionally show */}
          {!hideLayout && <Navbar />}

          <div>{children}</div>

          {/* Footer conditionally show */}
          {!hideLayout && <Footer />}
        </StoreProvider>
      </body>
    </html>
  );
};

export default AuthLayout;
