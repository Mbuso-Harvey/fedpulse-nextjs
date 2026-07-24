import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const ai = new GoogleGenAI({});
    const { opportunityDetails } = await req.json();

    if (!opportunityDetails) {
      return NextResponse.json({ error: 'Missing opportunityDetails' }, { status: 400 });
    }

    const prompt = `
You are an expert Federal Procurement AI Analyst.
Analyze the following government contracting opportunity and provide an executive assessment in JSON format.

Opportunity Details:
${opportunityDetails}

Respond ONLY with valid JSON matching exactly this schema:
{
  "score": <number between 0 and 100 representing win probability/fit>,
  "recommendation": <"BID" | "NO BID" | "TEAM">,
  "summary": <string, 2-3 sentences of executive summary>,
  "risks": [
    { "id": <number>, "text": <string>, "level": <"low" | "medium" | "high"> }
  ],
  "actions": [
    { "id": <number>, "text": <string>, "priority": <"low" | "medium" | "high"> }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const data = JSON.parse(response.text);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
