import axios from 'axios';

class FoxitClient {
  constructor() {
    this.docGenBaseUrl = process.env.FOXIT_DOCGEN_BASE_URL;
    this.docGenClientId = process.env.FOXIT_DOCGEN_CLIENT_ID;
    this.docGenClientSecret = process.env.FOXIT_DOCGEN_CLIENT_SECRET;
    
    this.pdfBaseUrl = process.env.FOXIT_PDF_BASE_URL;
    this.pdfClientId = process.env.FOXIT_PDF_CLIENT_ID;
    this.pdfClientSecret = process.env.FOXIT_PDF_CLIENT_SECRET;
  }

  async generateDocument(templateBase64, formData) {
    try {
      console.log('Calling Foxit Document Generation API...');
      console.log('URL:', `${this.docGenBaseUrl}/document-generation/api/GenerateDocumentBase64`);
      
      const response = await axios.post(
        `${this.docGenBaseUrl}/document-generation/api/GenerateDocumentBase64`,
        {
          outputFormat: 'pdf',
          documentValues: formData,
          base64FileString: templateBase64
        },
        {
          headers: {
            'client_id': this.docGenClientId,
            'client_secret': this.docGenClientSecret,
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.data.base64FileString) {
        console.error('API returned no PDF:', response.data);
        throw new Error('No PDF returned from API');
      }
      
      return response.data.base64FileString;
    } catch (error) {
      console.error('Document generation error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(`Failed to generate document: ${error.response?.status || error.message}`);
    }
  }

  async mergePDFs(pdfBase64Array) {
    return pdfBase64Array;
  }
}

export default new FoxitClient();