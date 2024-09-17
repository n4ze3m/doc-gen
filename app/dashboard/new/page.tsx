import { NewDocumentComponent } from "@/components/Dashboard/New";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Document - DocGen",
  description: "Document Generation with AI",
};
export default async function DashboardNewPage() {
  return (
    <>
      <NewDocumentComponent />
      <Toaster />
    </>
  );
}
