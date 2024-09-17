"use client";

import { SignUpWithPassword } from "@/components/Auth/SignUpWithPassword";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign  Up - DocGen",
  description: "Document Generation with AI",
  icons: {
    icon: "/logo.png",
  },
};

export default function SignUpPage() {
  return (
    <>
      <SignUpWithPassword />
      <Toaster />
    </>
  );
}
