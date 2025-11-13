"use client";
import React from "react";
import "../globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Toaster } from "sonner";
import CustomerProtectedRoute from "@/components/auth/CustomerProtectedRoute";

const TaskPosterLayout = ({ children }) => {
  return (
    <html >
      <body>
        <CustomerProtectedRoute>
          <Navbar/>
          <div>{children}</div>
          <Toaster 
            position="top-right"
            expand={true}
            richColors
          />
          <Footer/>
        </CustomerProtectedRoute>
      </body>
    </html>
  );
};

export default TaskPosterLayout;