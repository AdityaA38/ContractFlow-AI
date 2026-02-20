ContractFlow AI
Enterprise-grade bulk contract automation with AI-powered summaries. Transform hours of manual contract work into seconds of intelligent automation.

Overview
ContractFlow AI automates the tedious process of generating personalized contracts from templates. Upload a Word template and CSV data, and generate hundreds of customized contracts in seconds - complete with AI-powered plain-English summaries.
Key Features:

Smart CSV-to-template field mapping with auto-detection
Bulk PDF generation using Foxit Document Generation API
AI-powered contract summaries via Google Gemini 3
Automated ZIP bundling with Foxit PDF Services API
Professional, responsive UI with real-time progress tracking



Prerequisites

Node.js 18+ and npm
Foxit API credentials 
Google Gemini API key

Installation

Clone the repository

bashgit clone https://github.com/yourusername/contractflow-ai.git
cd contractflow-ai

Install dependencies

bashnpm install

Set up environment variables

Create a .env.local file in the root directory:
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

Run the development server

bashnpm run dev

Open your browser

Navigate to http://localhost:3000

Project Structure
contractflow-ai/
├── app/
│   ├── page.tsx              # Main application UI (4-step wizard)
│   ├── globals.css           # Global styles + animations
│   └── layout.tsx            # Root layout
├── components/
│   ├── FileUpload.jsx        # Drag-and-drop file upload component
│   ├── MappingTable.jsx      # CSV-to-template field mapping UI
│   └── ProgressBar.jsx       # Generation progress indicator
├── pages/api/
│   ├── generate-contracts.js # Backend: Foxit Document Generation API
│   ├── summarize.js          # Backend: Google Gemini AI summaries
│   └── bundle-zip.js         # Backend: Foxit PDF Services ZIP bundling
├── utils/
│   ├── csvParser.js          # CSV parsing and header extraction
│   └── foxitClient.js        # Foxit API client wrapper
├── .env.local                # API credentials (create this file)
├── package.json              # Dependencies and scripts
└── README.md                 # This file

Key Files Explained
app/page.tsx
Main application component with:

4-step wizard UI (Upload Template → Upload CSV → Map Fields → Generate)
Smart auto-mapping logic for CSV columns to template fields
Progress tracking and modal confirmations
AI summary preview functionality

utils/foxitClient.js
Foxit API integration:

Authenticates using client credentials (not OAuth)
Calls /document-generation/api/GenerateDocumentBase64 endpoint
Handles PDF generation with Word templates + JSON data
Manages error handling and response parsing

pages/api/generate-contracts.js
Backend API route:

Parses multipart form data (template + CSV + field mapping)
Converts template to base64
Loops through CSV rows and generates individual PDFs
Returns array of base64-encoded PDFs

pages/api/summarize.js
Google Gemini AI integration:

Analyzes first contract for context
Generates structured plain-English summary
Removes markdown formatting for clean output
Returns formatted sections (OVERVIEW, KEY TERMS, TIMELINE, etc.)

pages/api/bundle-zip.js
ZIP bundling:

Takes array of PDFs + AI summary
Uses JSZip to create archive
Returns downloadable ZIP file


How It Works
1. User Uploads Template
Upload a .docx Word document with placeholders:
{{client_name}}
{{client_email}}
{{contract_value}}
{{start_date}}
{{end_date}}
2. User Uploads CSV Data
CSV with client information:
csvCustomer Full Name,Contact Email,Total Contract Amount,Project Start,Project End
John Smith,john@example.com,$50000,2024-03-01,2025-03-01
Jane Doe,jane@example.com,$75000,2024-04-01,2025-04-01
3. Smart Field Mapping
App auto-detects matches:

client_name ← Customer Full Name
client_email ← Contact Email
contract_value ← Total Contract Amount

User can manually override any mapping via dropdowns.
4. Generate Contracts

Foxit Document Generation API fills templates with data
Google Gemini 3 analyzes first contract
Foxit PDF Services API bundles everything into ZIP
User downloads personalized contracts + AI summary


API Integration Details
Foxit Document Generation API
Endpoint: POST /document-generation/api/GenerateDocumentBase64
Authentication: Client credentials in headers (not OAuth)
javascriptheaders: {
  'client_id': 'your_client_id',
  'client_secret': 'your_client_secret'
}
Request:
json{
  "outputFormat": "pdf",
  "documentValues": {
    "client_name": "John Smith",
    "client_email": "john@example.com"
  },
  "base64FileString": "[base64 encoded .docx template]"
}
Response:
json{
  "base64FileString": "[base64 encoded PDF]"
}
Google Gemini API
Model: gemini-3-flash-preview
Prompt: Structured analysis request with specific sections (OVERVIEW, KEY TERMS, TIMELINE, FINANCIAL TERMS, IMPORTANT CONSIDERATIONS)
Output: Plain-English contract summary with headers

Dependencies
Core Framework

next@16.1.6 - React framework with App Router
react@18 - UI library
tailwindcss - Utility-first CSS

API Integration

axios - HTTP client for API calls
@google/generative-ai - Google Gemini SDK

File Processing

papaparse - CSV parsing
jszip - ZIP file creation
file-saver - File download handling
formidable - Multipart form parsing

Utilities

pdf-lib - PDF manipulation (if needed)


Usage Example
bash# 1. Start development server
npm run dev

# 2. Navigate to http://localhost:3000

# 3. Upload template (e.g., SERVICE_AGREEMENT.docx)

# 4. Upload CSV data (e.g., clients.csv with 10 rows)

# 5. Review auto-mapped fields (or adjust manually)

# 6. Click "Generate Contracts"

# 7. Review AI summary (optional)

# 8. Download ZIP with all contracts

Running Locally
This project runs locally on your machine. Follow the Quick Start guide above to get it running at http://localhost:3000.
Note: This is a demonstration project built for the Foxit hackathon. The core functionality (Foxit API integration, field mapping, AI summaries) works perfectly in local development.

Troubleshooting
"404 Not Found" from Foxit API
Issue: Wrong endpoint path
Solution: Ensure using /document-generation/api/GenerateDocumentBase64 (not /v1/documents)
"Wrong signature" error
Issue: Uploaded PDF instead of Word document
Solution: Foxit Document Generation requires .docx files, not .pdf
Gemini model not found
Issue: Using deprecated model name
Solution: Use gemini-3-flash-preview instead of gemini-pro
CSV auto-mapping fails
Issue: Column names too different from template fields
Solution: Use manual mapping dropdowns to connect fields

Tech Stack
TechnologyPurposeNext.js 16React framework with server-side renderingTailwind CSSUtility-first stylingFoxit Document Generation APIPDF generation from Word templatesFoxit PDF Services APIPDF bundling and processingGoogle Gemini 3AI-powered contract summariesPapaParseCSV parsingJSZipZIP file creation
