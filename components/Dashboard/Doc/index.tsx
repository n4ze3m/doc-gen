"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import DocumentPreview from "@/components/DocumentPreview";
import DynamicForm from "@/components/DynamicForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const messages = {
  gen_title: "Generating Title",
  in_queue: "In Queue",
  gen_pdf: "Generating PDF",
  gen_variable: "Generating Variables",
  finished: "Finished",
};

export default function DashboardDocComponent() {
  const params = useParams();
  const [variable, setVariable] = useState<any | undefined>();
  const data = useQuery(api.document.getDocInfoUser, {
    id: params.slug as any,
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (data.is_processing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 opacity-50"></div>
          <h2 className="text-2xl font-bold text-center text-gray-800 relative z-10">
            Generating AI PDF
          </h2>
          <div className="flex justify-center relative z-10">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
          </div>
          <p className="text-center text-gray-700 font-medium relative z-10">
            {/* @ts-ignore */}
            {messages[data.status]}...
          </p>
          <p className="text-center text-gray-500 text-sm relative z-10">
            Please wait. This process may take 2-4 minutes.
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 to-blue-100"></div>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen rounded-md border">
      <ResizablePanel minSize={20}>
        <Card className="h-full rounded-none border-0">
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              <DynamicForm
                schema={data?.active_variables as any}
                onSubmit={(data) => {
                  setVariable(data);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <Card className="h-full rounded-none border-0">
          <CardContent className="p-0">
            <div className="h-full overflow-hidden">
              <DocumentPreview html={data.active_html} variables={variable || data.active_variables} />
            </div>
          </CardContent>
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}