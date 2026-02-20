'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import MappingTable from '../components/MappingTable';
import ProgressBar from '../components/ProgressBar';
import { parseCSV, getCSVHeaders } from '../utils/csvParser';

export default function Home() {
  const [pdfTemplate, setPdfTemplate] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [pdfFields, setPdfFields] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAIPreview, setShowAIPreview] = useState(false);

  const handlePdfUpload = async (file: File) => {
    setPdfTemplate(file);
    
    const mockFields = [
      'client_name',
      'client_email',
      'contract_date',
      'company_name',
      'contract_value',
      'start_date',
      'end_date'
    ];
    
    setPdfFields(mockFields);
    setStep(2);
  };

  const handleCsvUpload = async (file: File) => {
    setCsvFile(file);
    const data = await parseCSV(file);
    setCsvData(data);
    const headers = getCSVHeaders(data);
    setCsvHeaders(headers);
    
    const autoMapping: Record<string, string> = {};
    pdfFields.forEach(field => {
      const normalized = field.toLowerCase().replace('_', ' ');
      const match = headers.find(h => 
        h.toLowerCase().replace('_', ' ').includes(normalized) ||
        normalized.includes(h.toLowerCase().replace('_', ' '))
      );
      if (match) {
        autoMapping[field] = match;
      }
    });
    
    setFieldMapping(autoMapping);
    setStep(3);
  };

  const handleMappingChange = (pdfField: string, csvColumn: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [pdfField]: csvColumn
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      setProgress(20);
      
      const formData = new FormData();
      formData.append('template', pdfTemplate!);
      formData.append('csvData', JSON.stringify(csvData));
      formData.append('fieldMapping', JSON.stringify(fieldMapping));

      const generateRes = await fetch('/api/generate-contracts', {
        method: 'POST',
        body: formData,
      });

      if (!generateRes.ok) throw new Error('Failed to generate contracts');
      
      const { pdfs } = await generateRes.json();
      setProgress(60);

      const sampleContract = `
Contract between ${csvData[0][fieldMapping.client_name]} and ${csvData[0][fieldMapping.company_name]}
Effective from ${csvData[0][fieldMapping.start_date]} to ${csvData[0][fieldMapping.end_date]}
Contract value: ${csvData[0][fieldMapping.contract_value]}
      `;

      const summaryRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText: sampleContract }),
      });

      if (!summaryRes.ok) throw new Error('Failed to generate summary');
      
      const { summary: aiSummary } = await summaryRes.json();
      setSummary(aiSummary);
      setProgress(80);

      const zipRes = await fetch('/api/bundle-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfs, summary: aiSummary }),
      });

      if (!zipRes.ok) throw new Error('Failed to create ZIP');
      
      const blob = await zipRes.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);
      setShowConfirmModal(true);
      setStep(4);

    } catch (error: any) {
      console.error('Error:', error);
      alert('Error generating contracts: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAndClose = () => {
    setShowConfirmModal(false);
    setShowAIPreview(false);
    // Download happens via link click
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: `
          linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
          linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
          linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
        `,
        backgroundSize: "60px 60px",
        animation: "checkerMove 25s linear infinite"
      }}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80 pointer-events-none" />
      
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* AI Preview Modal (Shows on top of Confirm Modal) */}
      {showAIPreview && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-8 rounded-t-2xl">
              <h3 className="font-bold text-gray-900 text-3xl">
                AI Contract Analysis
              </h3>
              <p className="text-gray-600 mt-2">Plain-English summary of your contracts</p>
            </div>
            
            <div className="p-8">
              <div className="text-gray-800 leading-relaxed space-y-6">
                {summary.split('\n').map((line, i) => {
                  const isHeader = line === line.toUpperCase() && line.trim().length > 0 && line.trim().length < 30 && !line.includes('.');
                  
                  if (isHeader) {
                    return (
                      <h4 key={i} className="font-bold text-xl text-gray-900 mt-8 mb-3 tracking-wide">
                        {line}
                      </h4>
                    );
                  } else if (line.trim()) {
                    return (
                      <p key={i} className="text-gray-700 leading-relaxed text-lg">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 rounded-b-2xl">
              <button
                onClick={() => setShowAIPreview(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-emerald-500/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mb-4">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Review & Confirm</h2>
              <p className="text-gray-400 text-lg">Your contracts are ready for download</p>
            </div>

            <div className="bg-black/40 rounded-xl p-6 mb-8 border border-gray-800">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Contracts:</span>
                  <span className="text-white font-bold ml-2">{csvData.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Template:</span>
                  <span className="text-white font-bold ml-2">{pdfTemplate?.name}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">AI Analysis:</span>
                  <span className="text-emerald-400 font-bold ml-2">Complete</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowAIPreview(true)}
                className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 border border-gray-700"
              >
                Review AI Contract Analysis
              </button>

              <a
                href={downloadUrl}
                download="contracts.zip"
                onClick={handleDownloadAndClose}
                className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
              >
                Download All Contracts
              </a>
              
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  window.location.reload();
                }}
                className="block w-full text-center text-gray-400 hover:text-white font-medium py-2 transition-colors duration-300"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
            ContractFlow AI
          </h1>
          <p className="text-2xl text-gray-300 font-light max-w-3xl mx-auto">
            Enterprise-grade bulk contract automation with AI-powered insights
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-20">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  step >= s
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                    : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-32 h-1 transition-all duration-300 ${
                    step > s ? 'bg-emerald-500' : 'bg-gray-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step >= 1 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-10">
              <FileUpload
                label="Upload Contract Template"
                accept=".docx"
                icon=""
                onFileSelect={handlePdfUpload}
              />
              {pdfTemplate && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-white font-semibold">{pdfTemplate.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step >= 2 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-10">
              <FileUpload
                label="Upload Client Data"
                accept=".csv"
                icon=""
                onFileSelect={handleCsvUpload}
              />
              {csvFile && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-white font-semibold">{csvData.length} records loaded</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step >= 3 && csvData.length > 0 && !showConfirmModal && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-10">
              <h3 className="text-3xl font-bold text-white mb-8">Field Mapping</h3>
              <MappingTable
                pdfFields={pdfFields}
                csvHeaders={csvHeaders}
                mapping={fieldMapping}
                onMappingChange={handleMappingChange}
              />
              
              <div className="text-center mt-12">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-xl text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isGenerating ? 'Generating Contracts...' : 'Generate Contracts'}
                </button>
              </div>

              {isGenerating && (
                <div className="max-w-2xl mx-auto mt-10">
                  <ProgressBar current={progress} total={100} />
                  <p className="text-center mt-4 text-white text-lg font-medium">
                    {progress < 30 && 'Generating contracts with Foxit API...'}
                    {progress >= 30 && progress < 70 && 'Creating AI summaries with Gemini...'}
                    {progress >= 70 && progress < 100 && 'Bundling files...'}
                    {progress === 100 && 'Complete!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}