"use client";

import { SignInWithPassword } from "@/components/Auth/SignInWithPassword";
import { Toaster } from "@/components/ui/toaster";

export default function SignInPage() {
  return (
    <>
      <SignInWithPassword />
      <Toaster />
    </>
  );
}
