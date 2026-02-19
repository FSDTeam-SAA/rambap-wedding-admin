"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "./queryProvider";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SessionProvider>
        <QueryProvider>
        {children}
        </QueryProvider>
        </SessionProvider>
    </div>
  );
};

export default AuthProvider;