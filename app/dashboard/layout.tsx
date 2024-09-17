import ConvexClientProvider from "@/components/ConvexClientProvider";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { ChatBubbleIcon, HomeIcon, ReaderIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ReactNode } from "react";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ConvexClientProvider>
  );
}
