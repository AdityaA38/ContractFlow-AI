ContractFlow AI
Enterprise-grade bulk contract automation with AI-powered summaries. Transform hours of manual contract work into seconds of intelligent automation.
This is a Next.js project built for the Foxit Document Automation Hackathon.
Overview
ContractFlow AI automates the process of generating personalized contracts from templates. Upload a Word template and CSV data to generate hundreds of customized contracts in seconds, complete with AI-powered plain-English summaries.
Key Features:

Smart CSV-to-template field mapping with auto-detection
Bulk PDF generation using Foxit Document Generation API
AI-powered contract summaries via Google Gemini 3
Automated ZIP bundling with Foxit PDF Services API
Professional, responsive UI with real-time progress tracking

Prerequisites
Before you begin, you'll need:

Node.js 18 or higher
npm, yarn, pnpm, or bun
Foxit API credentials (get them at https://developer-api.foxit.com)
Google Gemini API key (get it at https://ai.google.dev)

Getting Started
First, install the dependencies:
bashnpm install
# or
yarn install
# or
pnpm install
# or
bun install
Next, create a .env.local file in the root directory with your API credentials:
env# Foxit Document Generation API
FOXIT_DOCGEN_BASE_URL=https://na1.fusion.foxit.com
FOXIT_DOCGEN_CLIENT_ID=your_docgen_client_id
FOXIT_DOCGEN_CLIENT_SECRET=your_docgen_client_secret

# Foxit PDF Services API
FOXIT_PDF_BASE_URL=https://na1.fusion.foxit.com
FOXIT_PDF_CLIENT_ID=your_pdf_services_client_id
FOXIT_PDF_CLIENT_SECRET=your_pdf_services_client_secret

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
Then, run the development server:
bashnpm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.
You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.
Project Structure
contractflow-ai/
├── app/
│   ├── page.tsx              # Main application UI (4-step wizard)
│   ├── globals.css           # Global styles and animations
│   └── layout.tsx            # Root layout
├── components/
│   ├── FileUpload.jsx        # Drag-and-drop file upload component
│   ├── MappingTable.jsx      # CSV-to-template field mapping UI
│   └── ProgressBar.jsx       # Generation progress indicator
├── pages/api/
│   ├── generate-contracts.js # Foxit Document Generation API integration
│   ├── summarize.js          # Google Gemini AI summaries
│   └── bundle-zip.js         # Foxit PDF Services ZIP bundling
├── utils/
│   ├── csvParser.js          # CSV parsing and header extraction
│   └── foxitClient.js        # Foxit API client wrapper
└── .env.local                # API credentials (you need to create this)
How It Works
Step 1: Upload Template
Upload a .docx Word document with placeholders like {{client_name}}, {{client_email}}, {{contract_value}}, etc.
Step 2: Upload CSV Data
Upload a CSV file with your client information. Column names can be different from your template fields.
Step 3: Map Fields
The app automatically detects and maps CSV columns to template fields. You can manually override any mapping using the dropdown menus.
Step 4: Generate Contracts
Click "Generate Contracts" to:

Use Foxit Document Generation API to create personalized PDFs for each row
Use Google Gemini 3 to analyze and summarize the first contract
Use Foxit PDF Services API to bundle everything into a ZIP file
Download all contracts plus an AI-generated summary

API Integration
Foxit Document Generation API
Endpoint: POST /document-generation/api/GenerateDocumentBase64
Authentication: Client credentials in headers (not OAuth)
Request format:
json{
  "outputFormat": "pdf",
  "documentValues": {
    "client_name": "John Smith",
    "client_email": "john@example.com"
  },
  "base64FileString": "[base64 encoded .docx template]"
}
Google Gemini API
Model: gemini-3-flash-preview
Generates structured plain-English summaries with sections like OVERVIEW, KEY TERMS, TIMELINE, FINANCIAL TERMS, and IMPORTANT CONSIDERATIONS.
Dependencies
Core Framework:

next 16.1.6
react 18
tailwindcss

API Integration:

axios
@google/generative-ai

File Processing:

papaparse
jszip
file-saver
formidable
pdf-lib

Troubleshooting
"404 Not Found" from Foxit API

Solution: Ensure using /document-generation/api/GenerateDocumentBase64 endpoint

"Wrong signature" error

Solution: Foxit Document Generation requires .docx files, not .pdf files

Gemini model not found

Solution: Use gemini-3-flash-preview instead of older model names

CSV auto-mapping fails

Solution: Use manual mapping dropdowns to connect CSV columns to template fields

Learn More
To learn more about the technologies used in this project:

Next.js Documentation
Foxit API Documentation
Google Gemini API Documentation
Tailwind CSS Documentation

Hackathon Submission
Built for the Foxit Document Automation Hackathon (February 2026)
Requirements Met:

Uses Foxit Document Generation API for bulk PDF creation
Uses Foxit PDF Services API for ZIP bundling
Meaningful integration solving real-world contract automation
End-to-end workflow with professional UI
AI-powered feature for contract summaries

