# ContractFlow AI

**Enterprise-grade bulk contract automation with AI-powered summaries.**  
Transform hours of manual contract work into seconds of intelligent automation.

---

## 🚀 Overview

ContractFlow AI automates the tedious process of generating personalized contracts from templates.

Upload a Word template and CSV data, and instantly generate hundreds of customized contracts — complete with AI-powered plain-English summaries and automatic ZIP bundling.

Built for the Foxit Hackathon.

---

## ✨ Key Features

- 🔍 Smart CSV-to-template field mapping with auto-detection  
- 📄 Bulk PDF generation via Foxit Document Generation API  
- 🤖 AI-powered contract summaries using Google Gemini 3  
- 📦 Automatic ZIP bundling of all contracts  
- ⚡ Real-time progress tracking UI  
- 🎨 Clean, responsive interface built with Next.js + Tailwind  

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Next.js 16 | React framework (App Router) |
| React 18 | UI library |
| Tailwind CSS | Utility-first styling |
| Foxit Document Generation API | PDF generation from Word templates |
| Foxit PDF Services API | ZIP bundling |
| Google Gemini 3 | AI contract summaries |
| PapaParse | CSV parsing |
| JSZip | ZIP creation |
| Axios | API requests |

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/contractflow-ai.git
cd contractflow-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Foxit Document Generation API
FOXIT_DOCGEN_BASE_URL=https://na1.fusion.foxit.com
FOXIT_DOCGEN_CLIENT_ID=your_docgen_client_id
FOXIT_DOCGEN_CLIENT_SECRET=your_docgen_client_secret

# Foxit PDF Services API
FOXIT_PDF_BASE_URL=https://na1.fusion.foxit.com
FOXIT_PDF_CLIENT_ID=your_pdf_services_client_id
FOXIT_PDF_CLIENT_SECRET=your_pdf_services_client_secret

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🧠 How It Works

### Step 1 — Upload Word Template

Upload a `.docx` file containing placeholders:

```text
{{client_name}}
{{client_email}}
{{contract_value}}
{{start_date}}
{{end_date}}
```

---

### Step 2 — Upload CSV Data

Example CSV:

```csv
Customer Full Name,Contact Email,Total Contract Amount,Project Start,Project End
John Smith,john@example.com,$50000,2024-03-01,2025-03-01
Jane Doe,jane@example.com,$75000,2024-04-01,2025-04-01
```

---

### Step 3 — Smart Field Mapping

The app auto-detects matches:

```
client_name      ← Customer Full Name
client_email     ← Contact Email
contract_value   ← Total Contract Amount
```

Users can manually override mappings if needed.

---

### Step 4 — Generate Contracts

1. Foxit fills templates with CSV data  
2. Google Gemini analyzes the first contract  
3. Contracts + AI summary are bundled into a ZIP  
4. User downloads everything instantly  

---

## 📁 Project Structure

```bash
contractflow-ai/
├── app/
│   ├── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── FileUpload.jsx
│   ├── MappingTable.jsx
│   └── ProgressBar.jsx
├── pages/api/
│   ├── generate-contracts.js
│   ├── summarize.js
│   └── bundle-zip.js
├── utils/
│   ├── csvParser.js
│   └── foxitClient.js
├── .env.local
├── package.json
└── README.md
```

---

## 🔌 API Integration Details

### Foxit Document Generation API

**Endpoint**
```
POST /document-generation/api/GenerateDocumentBase64
```

**Authentication**
Client credentials in headers:

```javascript
headers: {
  client_id: "your_client_id",
  client_secret: "your_client_secret"
}
```

**Request Body**

```json
{
  "outputFormat": "pdf",
  "documentValues": {
    "client_name": "John Smith",
    "client_email": "john@example.com"
  },
  "base64FileString": "[base64 encoded .docx]"
}
```

---

### Google Gemini API

- Model: `gemini-3-flash-preview`
- Generates structured sections:
  - OVERVIEW
  - KEY TERMS
  - TIMELINE
  - FINANCIAL TERMS
  - IMPORTANT CONSIDERATIONS

Returns clean, plain-English summary.

---

## 🧪 Usage Example

```bash
# Start server
npm run dev

# Upload template
# Upload CSV
# Review field mappings
# Click "Generate Contracts"
# Download ZIP
```

---

## 🛠 Troubleshooting

### 404 from Foxit API
Ensure endpoint is:
```
/document-generation/api/GenerateDocumentBase64
```

### "Wrong signature" error
Make sure you're uploading a `.docx`, not a `.pdf`.

### Gemini model not found
Use:
```
gemini-3-flash-preview
```

### CSV auto-mapping fails
Column names may be too different. Use manual dropdown mapping.

---

## 🏁 Running Locally

This project runs entirely locally.  
All core functionality (Foxit API integration, field mapping, AI summaries) works in local development.

---

## 📜 License

Built for the Foxit Hackathon.  
For demonstration purposes only.

---

## 💡 Why This Matters

Legal teams spend hours generating repetitive contracts manually.

ContractFlow AI reduces that workflow to:

**Upload → Map → Generate → Download**

From hours to seconds.

---
