import { NewDocumentComponent } from "@/components/Dashboard/New";
import { Toaster } from "@/components/ui/toaster";

export default async function DashboardNewPage() {
  return (
    <>
      <NewDocumentComponent />
      <Toaster />

    </>
  );
}
