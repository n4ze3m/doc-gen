"use client";

import { SignUpWithPassword } from "@/components/Auth/SignUpWithPassword";
import { Toaster } from "@/components/ui/toaster";


export default function SignUpPage() {
  return (
    <>
      <SignUpWithPassword />
      <Toaster />
    </>
  );
}
