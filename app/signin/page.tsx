"use client";

import { SignInWithPassword } from "@/components/Auth/SignInWithPassword";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign  In - DocGen",
  description: "Document Generation with AI",
  icons: {
    icon: "/logo.png",
  },
};

export default function SignInPage() {
  return (
    <>
      <SignInWithPassword />
      <Toaster />
    </>
  );
}
