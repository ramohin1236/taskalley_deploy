import React from "react";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const AuthLayout = ({ children }) => {
  return (
    <html >
      <body>
         <Toaster position="top-right" richColors />
         <div><Navbar/></div>
        <div >{children}</div>
        <div><Footer/></div>
      </body>
    </html>
  );
};

export default AuthLayout;