import { api } from "@/convex/_generated/api";
import { compileTemplate } from "@/lib/compile-template";
import { convexServer } from "@/lib/convex-server";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

type PDFRequest = {
    doc_id: string;
    variables?: any;
};

export const POST = async (request: NextRequest) => {
    const data = (await request.json()) as PDFRequest;
    if (!data.doc_id) {
        return NextResponse.json(
            {
                error: "No doc_id provided",
            },
            {
                status: 400,
            },
        );
    }

    const id = data.doc_id;
    const docInfo = await convexServer.query(api.document.getDocInfo, {
        id: id as any,
    });

    if (!docInfo) {
        return NextResponse.json(
            {
                error: "No doc_id provided",
            },
            {
                status: 400,
            },
        );
    }

    const html = docInfo.active_html
    const defaultVariables = docInfo.active_variables

    let template = "";

    if (data?.variables) {
        template = compileTemplate(
            html || "",
            data.variables
        )
    } else {
        template = compileTemplate(
            html || "",
            defaultVariables || ({} as any)
        )
    }
    const genHTML = `
       <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body >
          ${template}
        </body>
      </html>
`

    const browser = await puppeteer.connect({ browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT })

    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 1200 });

    await page.setContent(genHTML, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const pdf = await page.pdf({
        format: "A4",
        timeout: 30000,
        printBackground: true,
    });
    await browser.close();

    return new NextResponse(pdf,
        {
            headers: {
                "Content-Type": "application/pdf",
            },
        })

};
