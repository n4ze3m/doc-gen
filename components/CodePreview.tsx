import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Code, Copy, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodePreviewProps {
  data: {
    id: string;
  };
  variable?: Record<string, any>;
}

export default function CodePreview({ data, variable,  }: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const url: string | undefined = process.env.NEXT_PUBLIC_URL

  const nodeCodeExample: string = `
const axios = require('axios');

async function generatePDF(apiKey, documentId, variables) {
  try {
    const response = await axios.post('${url}/api/v1/generate', {
      document_id: documentId,
      variables: variables
    }, {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    // Save the PDF or process it as needed
    const pdfBuffer = Buffer.from(response.data, 'binary');
    // For example, save to a file:
    // require('fs').writeFileSync('generated.pdf', pdfBuffer);

    console.log('PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    throw error;
  }
}

// Usage
const apiKey = 'YOUR_API_KEY';
const documentId = '${data.id}';
const variables = ${JSON.stringify(variable, null, 2)};

generatePDF(apiKey, documentId, variables)
  .then(pdf => console.log('PDF generated, size:', pdf.length, 'bytes'))
  .catch(err => console.error('Failed to generate PDF:', err));
  `

  const pythonCodeExample: string = `
import requests

def generate_pdf(api_key, document_id, variables):
    url = '${url}/api/v1/generate'
    headers = {
        'X-Api-Key': api_key,
        'Content-Type': 'application/json'
    }
    payload = {
        'document_id': document_id,
        'variables': variables
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        # Save the PDF or process it as needed
        pdf_content = response.content
        # For example, save to a file:
        # with open('generated.pdf', 'wb') as f:
        #     f.write(pdf_content)

        print('PDF generated successfully')
        return pdf_content
    except requests.exceptions.RequestException as error:
        print('Error generating PDF:', str(error))
        raise

# Usage
api_key = 'YOUR_API_KEY'
document_id = '${data.id}'
variables = ${JSON.stringify(variable, null, 2)}

try:
    pdf = generate_pdf(api_key, document_id, variables)
    print('PDF generated, size:', len(pdf), 'bytes')
except Exception as err:
    print('Failed to generate PDF:', str(err))
  `

  const copyToClipboard = (code: string): void => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Code className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Code Example</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="node" className="mt-4">
          <TabsList>
            <TabsTrigger value="node">Node.js</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          <TabsContent value="node">
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">Node.js Example:</h4>
                <Button onClick={() => copyToClipboard(nodeCodeExample)} variant="outline" size="sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-white p-2 rounded-md whitespace-pre-wrap break-words">
                <code>{nodeCodeExample}</code>
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="python">
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">Python Example:</h4>
                <Button onClick={() => copyToClipboard(pythonCodeExample)} variant="outline" size="sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-white p-2 rounded-md whitespace-pre-wrap break-words">
                <code>{pythonCodeExample}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}