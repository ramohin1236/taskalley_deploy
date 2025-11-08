"use client";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import StoreProvider from "./StoreProvider";

export default function MainLayout({ children, hideNav = false }) {
  return (
    <>
      {/* {!hideNav && <Navbar />} */}
      <StoreProvider><main>{children}</main></StoreProvider>
      {/* {!hideNav && <Footer />} */}
    </>
  );
}