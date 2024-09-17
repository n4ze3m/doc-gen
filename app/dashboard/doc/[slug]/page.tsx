import DashboardDocComponent from "@/components/Dashboard/Doc";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Playground - DocGen",
    description: "Document Generation with AI",
  };
export default async function DashboardDocPage() {
    return <>
    <DashboardDocComponent />
    </>
}