"use client";
import React from "react";
import "../globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Toaster } from "sonner";
import CustomerProtectedRoute from "@/components/auth/CustomerProtectedRoute";
import VerificationGuard from "@/components/auth/VerificationGuard";

const TaskPosterLayout = ({ children }) => {
  return (
    <>
      <CustomerProtectedRoute>
        <VerificationGuard>
          <Toaster position="top-right" />
          <Navbar />
          <div>{children}</div>
          <Toaster
            position="top-right"
            expand={true}
            richColors
          />
          <Footer />
        </VerificationGuard>
      </CustomerProtectedRoute>
    </>
  );
};

export default TaskPosterLayout;