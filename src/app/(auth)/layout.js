import React from "react";
import "../globals.css";
import { Toaster } from "sonner";

const AuthLayout = ({ children }) => {
  return (
    <html >
      <body>
         <Toaster position="top-right" richColors />
        <div >{children}</div>
      </body>
    </html>
  );
};

export default AuthLayout;