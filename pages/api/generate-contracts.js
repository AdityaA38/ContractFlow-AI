import formidable from 'formidable';
import fs from 'fs';
import foxitClient from '../../utils/foxitClient';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ multiples: false });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const templateFile = files.template[0];
    const csvData = JSON.parse(fields.csvData[0]);
    const fieldMapping = JSON.parse(fields.fieldMapping[0]);

    console.log(`Processing ${csvData.length} contracts...`);

    // Read template PDF and convert to base64
    const templateBuffer = fs.readFileSync(templateFile.filepath);
    const templateBase64 = templateBuffer.toString('base64');

    const generatedPdfs = [];

    // Generate each contract using Foxit Document Generation API
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      
      // Map CSV data to PDF form fields
      const formData = {};
      Object.entries(fieldMapping).forEach(([pdfField, csvColumn]) => {
        formData[pdfField] = row[csvColumn] || '';
      });

      console.log(`Generating contract ${i + 1}/${csvData.length}...`);

      try {
        // Call Foxit Document Generation API
        const pdfBase64 = await foxitClient.generateDocument(templateBase64, formData);
        generatedPdfs.push(pdfBase64);
      } catch (error) {
        console.error(`Failed to generate contract ${i + 1}:`, error.message);
        // Continue with next contract even if one fails
      }
    }

    if (generatedPdfs.length === 0) {
      throw new Error('No contracts were generated successfully');
    }

    console.log(`Successfully generated ${generatedPdfs.length} contracts`);

    res.status(200).json({ 
      success: true, 
      count: generatedPdfs.length,
      pdfs: generatedPdfs 
    });

  } catch (error) {
    console.error('Error generating contracts:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
}