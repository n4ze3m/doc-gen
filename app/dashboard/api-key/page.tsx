import APiKeyComponent from "@/components/Dashboard/Apikey";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "API Key - DocGen",
  description: "Document Generation with AI",
};
export default async function DashboardPage() {
  return (
    <>
      <APiKeyComponent />
      <Toaster />
    </>
  );
}
