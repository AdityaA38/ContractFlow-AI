import JSZip from 'jszip';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pdfs, summary } = req.body;

    if (!pdfs || pdfs.length === 0) {
      throw new Error('No PDFs provided for bundling');
    }

    const zip = new JSZip();

    // Add each PDF
    pdfs.forEach((pdfBase64, index) => {
      zip.file(`contract_${index + 1}.pdf`, pdfBase64, { base64: true });
    });

    // Add AI summary
    if (summary) {
      zip.file('AI_Summary.txt', summary);
    }

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=contracts.zip');
    res.send(zipBuffer);

  } catch (error) {
    console.error('Error creating ZIP:', error);
    res.status(500).json({ error: error.message });
  }
}