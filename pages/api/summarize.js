import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contractText } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    
    const prompt = `Analyze this contract and provide a structured summary. You MUST format your response with these exact section headers in ALL CAPS followed by a blank line, then the content:

OVERVIEW

[2-3 sentences summarizing the agreement]

KEY TERMS

[Main obligations and important clauses]

TIMELINE

[Important dates - start date, end date, key milestones]

FINANCIAL TERMS

[Payment amounts, values, compensation structure]

IMPORTANT CONSIDERATIONS

[What signers need to know, risks, obligations]

Contract text:
${contractText}

CRITICAL: Use the exact headers shown above. Put each header on its own line in ALL CAPS. Add a blank line after each header before the content. Write in clear, professional language.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let summary = response.text();
    
    // Clean up markdown
    summary = summary.replace(/#{1,6}\s/g, '');
    summary = summary.replace(/\*\*/g, '');
    summary = summary.replace(/\*/g, '');

    res.status(200).json({ summary });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: error.message });
  }
}