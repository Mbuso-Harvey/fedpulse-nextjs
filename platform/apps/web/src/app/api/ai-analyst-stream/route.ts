import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { contractTitle, department, value, capabilities, scope } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are FedPulse AI Analyst, an elite federal capture strategist and procurement consultant.
Analyze the following federal contract opportunity for an executive bid/no-bid decision:
- Contract Title: ${contractTitle || "IT Modernization & Support Services"}
- Department: ${department || "Shared Services Canada"}
- Estimated Value: ${value || "$14.2M"}
- Company Core Capabilities: ${capabilities || "Cloud migration, cybersecurity compliance, DevSecOps, enterprise IT infrastructure management"}
- Contract Scope: ${scope || "Vendor replacement, legacy system migration, 24/7 technical support, Canadian data sovereignty compliance"}

Provide a structured, deeply analytical strategic intelligence report formatted with Markdown:

### 1. EXECUTIVE BID RECOMMENDATION
- **Verdict**: [HIGH BID / SELECTIVE BID / NO BID]
- **Win Probability Score**: [e.g. 78/100]
- **Key Justification**: 2 concise sentences explaining the rationale.

### 2. COMPETITIVE LANDSCAPE & INCUMBENT FOOTPRINT
- **Incumbent Strength**: Analysis of incumbent dependencies, badge clearance, and legacy codebase lock-in.
- **Rival Bidders**: Top likely tier-1 and SME competitors.

### 3. STRATEGIC WIN THEMES
- **Win Theme 1**: Differentiating value proposition.
- **Win Theme 2**: Technical superiority / agility narrative.
- **Win Theme 3**: Risk reduction & pricing compliance.

### 4. COMPLIANCE & RISK MITIGATION
- **Data Sovereignty & Security**: Specific Canadian / FedRAMP / Protected B clearances required.
- **Transition Continuity**: How to de-risk incumbent vendor transition.

### 5. CAPTURE TEAM IMMEDIATE NEXT STEPS
1. Action Step 1
2. Action Step 2
3. Action Step 3
4. Action Step 4`;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ chunk: chunk.text })}\n\n`));
          }
        }
        controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('AI Analyst Streaming Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate AI analysis' }, { status: 500 });
  }
}
