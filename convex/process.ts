"use node"

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai"
import { generateJson } from "./utils";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.MODEL_NAME,
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE
  }
})

const stringOutputParser = new StringOutputParser();

const mainSystemPrompt = `You are an expert pdf generator. Generate an HTML template using Tailwind CSS classes for creating a PDF document. 


The template should:

	- Use only HTML elements suitable for PDF rendering (avoid buttons, videos, or interactive elements).
	- Implement a clean, professional layout optimized for print.
	- Utilize Tailwind CSS classes for styling, including responsive design considerations.
	- Include placeholders for dynamic content using Handlebars syntax (e.g., {{title}}, {{content}}). Use only snake_case or camelCase for variable names.
	- Incorporate appropriate semantic HTML5 elements (e.g., header, main, footer).
	- Ensure all text is legible when printed, using appropriate font sizes and contrast.
	- Include styled elements such as headings, paragraphs, lists, and tables as needed
	- Implement a page header and footer with placeholders for page numbers and other
metadata.
	- Avoid any external resources or dependencies that may not render in a PDF.
    - Maintain a consistent style and tone throughout the document.
    - Only return the HTML code. No explanation is needed.
    - DO NOT INCLUDE FOLLOWING TAGS:
      - <select>
      - <input>
      - <textarea>
      - <button>
      - <form>
      - <video>
      - <iframe>
      - <script>
    - DO NOT ADD LONG PADDING OR SHADOW it's must be simple pdf

Remember to stay in character as an PDF generator and focus solely on creating the requested template. Do not break character or provide explanations outside the scope of generating the HTML code. The output should be valid HTML that can be directly used with a PDF generation too.

Use following example as a reference:

---------------------

User Requested Query:

Generate a template for a product catalog page.

HTML Response:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{categoryName}} - Product Catalog</title>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">{{categoryName}}</h1>
        </header>
        
        <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {{#each products}}
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="aspect-w-16 aspect-h-9 bg-gray-200">
                    <!-- Placeholder for product image -->
                    <div class="flex items-center justify-center h-full">
                        <span class="text-gray-500">{{this.name}} Image</span>
                    </div>
                </div>
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2">{{this.name}}</h2>
                    <p class="text-gray-600 mb-4">{{this.description}}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-bold text-green-600">$ {{this.price}}</span>
                        <span class="text-sm text-gray-500">SKU: {{this.sku}}</span>
                    </div>
                </div>
            </div>
            {{/each}}
        </main>
        
        <footer class="mt-12 text-center text-sm text-gray-500">
            <p>Prices are subject to change. Last updated: {{lastUpdated}}</p>
            <p>Page {{currentPage}} of {{totalPages}}</p>
        </footer>
    </div>
</body>
</html>
------------------------

User Requested Query:

Create a template for a business quarterly report.

HTML Response:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{companyName}} - Q{{quarterNumber}} {{year}} Quarterly Report</title>
</head>
<body class="bg-gray-100">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <header class="border-b p-8">
            <h1 class="text-3xl font-bold mb-2">{{companyName}}</h1>
            <p class="text-xl">Q{{quarterNumber}} {{year}} Quarterly Report</p>
        </header>
        
        <main class="p-8">
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Financial Highlights</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-gray-100 p-4 rounded text-center">
                        <p class="text-sm text-gray-600 mb-1">Revenue</p>
                        <p class="text-xl font-bold">$ {{revenue}}</p>
                    </div>
                    <div class="bg-gray-100 p-4 rounded text-center">
                        <p class="text-sm text-gray-600 mb-1">Net Income</p>
                        <p class="text-xl font-bold">$ {{netIncome}}</p>
                    </div>
                    <div class="bg-gray-100 p-4 rounded text-center">
                        <p class="text-sm text-gray-600 mb-1">EPS</p>
                        <p class="text-xl font-bold">$ {{earningsPerShare}}</p>
                    </div>
                    <div class="bg-gray-100 p-4 rounded text-center">
                        <p class="text-sm text-gray-600 mb-1">Operating Margin</p>
                        <p class="text-xl font-bold">{{operatingMargin}}%</p>
                    </div>
                </div>
            </section>
            
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Quarterly Performance</h2>
                <p>{{quarterlyPerformanceSummary}}</p>
            </section>
            
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Key Metrics</h2>
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="p-2 text-left">Metric</th>
                            <th class="p-2 text-right">Q{{quarterNumber}} {{year}}</th>
                            <th class="p-2 text-right">Q{{previousQuarterNumber}} {{previousQuarterYear}}</th>
                            <th class="p-2 text-right">YoY Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#each keyMetrics}}
                        <tr class="border-b">
                            <td class="p-2">{{this.metric}}</td>
                            <td class="p-2 text-right">{{this.currentValue}}</td>
                            <td class="p-2 text-right">{{this.previousValue}}</td>
                            <td class="p-2 text-right">{{this.yoyChange}}</td>
                        </tr>
                        {{/each}}
                    </tbody>
                </table>
            </section>
            
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Segment Performance</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {{#each segments}}
                    <div class="bg-gray-100 p-4 rounded">
                        <h3 class="font-semibold mb-2">{{this.name}}</h3>
                        <p class="mb-2">Revenue: $ {{this.revenue}}</p>
                        <p>Growth: {{this.growth}}%</p>
                    </div>
                    {{/each}}
                </div>
            </section>
            
            <section>
                <h2 class="text-2xl font-semibold mb-4">Outlook</h2>
                <p>{{outlookSummary}}</p>
            </section>
        </main>
        
        <footer class="border-t p-6 text-sm text-gray-600">
            <p class="mb-2">This report contains forward-looking statements. Actual results may differ materially.</p>
            <p>© {{year}} {{companyName}}. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>

------------------------

User Requested Query:

{query}

HTML Response:
`
const titleGeneratePrompt = PromptTemplate.fromTemplate(`Here is the query:

--------------

{query}

--------------

Create a concise, 3-5 word phrase as a title for the previous query. Avoid quotation marks or special formatting. RESPOND ONLY WITH THE TITLE TEXT. ANSWER USING THE SAME LANGUAGE AS THE QUERY.


Examples of titles:

Stellar Achievement Celebration
Family Bonding Activities
Shakespeare Analyse Literarische
日本の春祭り体験
Древнегреческая Философия Обзор

Response:`)


const generateTitle = async (query: string) => {
  try {
    const chain = titleGeneratePrompt.pipe(model).pipe(stringOutputParser)
    const title = await chain.invoke({ query })
    return title
  } catch (e) {
    return "Untitle"
  }
}


export const processDocumentAction = internalAction({
  args: {
    id: v.id("documents"),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    // generate ai title
    await ctx.runMutation(internal.document.updateStatusInternal, {
      id: args.id,
      status: "gen_title"
    })
    const title = await generateTitle(args.prompt)
    await ctx.runMutation(internal.document.updateDocTitleInternal, {
      title: title,
      id: args.id
    })

    await ctx.runMutation(internal.document.updateStatusInternal, {
      id: args.id,
      status: "gen_pdf"
    })

    const chain = model.pipe(stringOutputParser)

    const mainPrompt = mainSystemPrompt.replace("{query}", args.prompt)
    const html = await chain.invoke(mainPrompt)

    await ctx.runMutation(internal.document.updateStatusInternal, {
      id: args.id,
      status: "gen_variable"
    })

    const variable = await generateJson(html)

    await ctx.runMutation(internal.document.updateStatusInternal, {
      id: args.id,
      status: "finished"
    })

    await ctx.runMutation(internal.document.createDocVersion, {
      html: html,
      variables: variable,
      id: args.id
    })
  }
})