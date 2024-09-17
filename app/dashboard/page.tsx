import { DashboardDocuments } from "@/components/Dashboard/Documents";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard - DocGen",
  description: "Document Generation with AI",
};
export default async function DashboardPage() {

  return (
    <>
      <DashboardDocuments />
    </>
  );
}
