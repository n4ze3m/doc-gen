"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { compileTemplate } from "@/lib/compile-template";
import CodePreview from "./CodePreview";

export default function DocumentPreview({
  variables,
  html,
}: {
  variables?: any;
  html: string;
}) {
  const params = useParams<{ slug: string }>();
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const template = compileTemplate(html, variables || {});
    const genHTML = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${template}
        </body>
      </html>
    `;
    setPreviewHtml(genHTML);
  }, [html, variables]);

  const generatePdf = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_id: params.slug,
          variables: variables,
        }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex items-center space-x-4">
          <CodePreview
            data={{
              id: params.slug,
            }}
            variable={variables}
          />
          <Button onClick={generatePdf} disabled={isLoading}>
            {isLoading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>
      <Card className="w-full max-w-[210mm] mx-auto bg-gray-100 shadow-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingTop: "141.42%" }}>
          <iframe
            srcDoc={previewHtml}
            className="absolute top-0 left-0 w-full h-full border-0 bg-white"
            title="HTML Preview"
          />
        </div>
      </Card>
    </div>
  );
}
