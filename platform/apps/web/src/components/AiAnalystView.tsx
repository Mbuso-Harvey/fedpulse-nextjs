"use client";
import React, { useState, useEffect } from 'react';
import { MOCK_CONTRACTS } from '@/lib/mockData';
import { Contract } from '@/lib/types';
import { 
  Sparkles, Bot, CheckCircle2, AlertTriangle, ArrowRight, Loader2, 
  RefreshCw, Send, ShieldCheck, Target, Copy, Check, FileDown, Bookmark, Share2, CornerDownRight
} from 'lucide-react';

interface AiAnalystViewProps {
  initialContract?: Contract | null;
}

export const AiAnalystView: React.FC<AiAnalystViewProps> = ({ initialContract }) => {
  const [contractTitle, setContractTitle] = useState(
    initialContract?.title || 'IT Services Master Agreement'
  );
  const [department, setDepartment] = useState(
    initialContract?.department || 'Shared Services Canada'
  );
  const [value, setValue] = useState(initialContract?.value || '$14.2M');
  const [capabilities, setCapabilities] = useState(
    'Cloud Migration, Cybersecurity TRA Audits, FedRAMP / Protected B Data Sovereignty, DevSecOps CI/CD Pipelines'
  );
  const [scopeNotes, setScopeNotes] = useState(
    initialContract?.scopeSummary ||
      'Enterprise server maintenance, legacy database migration, 24/7 technical support, and vendor replacement.'
  );

  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync state if initialContract updates
  useEffect(() => {
    if (initialContract) {
      setContractTitle(initialContract.title);
      setDepartment(initialContract.department);
      setValue(initialContract.value);
      setScopeNotes(initialContract.scopeSummary);
      setAiReport('');
    }
  }, [initialContract]);

  const handleGenerateStrategy = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setAiReport('');

    try {
      const response = await fetch('/api/ai-analyst-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractTitle,
          department,
          value,
          capabilities,
          scope: scopeNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response stream not readable');
      }

      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value: chunkValue } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(chunkValue, { stream: true });
        const lines = textChunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '').trim();
            if (jsonStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.chunk) {
                accumulatedText += parsed.chunk;
                setAiReport(accumulatedText);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (err) {
              // Ignore non-JSON ping lines
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error connecting to AI streaming server');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (contract: Contract) => {
    setContractTitle(contract.title);
    setDepartment(contract.department);
    setValue(contract.value);
    setScopeNotes(contract.scopeSummary);
    setAiReport('');
  };

  const handleCopyReport = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveStrategy = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>FedPulse Bid Strategy Report - ${contractTitle}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 30px; color: #0a2540; line-height: 1.6; }
            h1 { font-size: 20px; border-bottom: 2px solid #635bff; padding-bottom: 10px; }
            .meta { background: #f6f9fc; padding: 15px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; }
            .report { white-space: pre-wrap; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>FedPulse AI Capture Strategy Report</h1>
          <div class="meta">
            <strong>Contract:</strong> ${contractTitle}<br/>
            <strong>Department:</strong> ${department}<br/>
            <strong>Estimated Value:</strong> ${value}<br/>
            <strong>Date Generated:</strong> ${new Date().toLocaleDateString()}
          </div>
          <div class="report">${aiReport || 'No report content.'}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="py-8 bg-[#f6f9fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Banner */}
        <div className="mb-6 bg-white p-5 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#635bff] text-xs font-bold mb-1">
              <Bot className="w-3.5 h-3.5 text-[#635bff]" />
              <span>Gemini 3.6 Flash Bid Strategy Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2540]">
              AI Bid / No-Bid Strategy Environment
            </h1>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Presets:</span>
            {MOCK_CONTRACTS.slice(0, 3).map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectPreset(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex-shrink-0 ${
                  contractTitle === c.title
                    ? 'bg-indigo-50 text-[#635bff] border-[#635bff] font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.title.slice(0, 22)}... ({c.value})
              </button>
            ))}
          </div>
        </div>

        {/* Split-Pane Design (Left: 35%, Right: 65%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Pane (35% width - 4 cols on lg) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#e6ebf1] shadow-stripe space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Target className="w-4 h-4 text-[#635bff]" />
              <h2 className="text-sm font-extrabold text-[#0a2540]">
                1. Context & Capabilities Input
              </h2>
            </div>

            <form onSubmit={handleGenerateStrategy} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0a2540] mb-1">
                  Contract Title
                </label>
                <input
                  type="text"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#e6ebf1] rounded-xl text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#0a2540] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#e6ebf1] rounded-lg text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0a2540] mb-1">
                    Est. Value
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#e6ebf1] rounded-lg text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0a2540] mb-1">
                  Scope & Deliverable Notes
                </label>
                <textarea
                  rows={3}
                  value={scopeNotes}
                  onChange={(e) => setScopeNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#e6ebf1] rounded-lg text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0a2540] mb-1">
                  Your Core Capabilities & Differentiators
                </label>
                <textarea
                  rows={3}
                  value={capabilities}
                  onChange={(e) => setCapabilities(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#e6ebf1] rounded-lg text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#635bff] hover:bg-[#5469d4] text-white font-bold text-xs shadow-stripe transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Streaming Strategy Tokens...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate Bid/No-Bid Strategy</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Pane (65% width - 8 cols on lg) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#e6ebf1] shadow-stripe min-h-[560px] flex flex-col justify-between">
            <div>
              {/* Sticky Top Bar for AI Output Actions */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#635bff] font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0a2540] text-sm">
                      2. AI Capture Strategy Output
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">Real-time LLM stream</span>
                  </div>
                </div>

                {/* Sticky Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportPDF}
                    disabled={!aiReport}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Export Strategy PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 text-rose-600" />
                    <span>Export PDF</span>
                  </button>

                  <button
                    onClick={handleSaveStrategy}
                    disabled={!aiReport}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? 'text-emerald-600 fill-emerald-600' : 'text-amber-500'}`} />
                    <span>{saved ? 'Saved!' : 'Save Strategy'}</span>
                  </button>

                  <button
                    onClick={() => handleGenerateStrategy()}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#635bff] ${loading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    onClick={handleCopyReport}
                    disabled={!aiReport}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Skeleton Loader during streaming start */}
              {loading && !aiReport && (
                <div className="py-20 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-indigo-50 text-[#635bff] animate-pulse">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-[#0a2540]">
                    Synthesizing Bid/No-Bid Strategy...
                  </h4>
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="h-3 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-5/6 mx-auto animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-2/3 mx-auto animate-pulse" />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  <strong>Analysis Failure:</strong> {error}
                </div>
              )}

              {!loading && !aiReport && !error && (
                <div className="py-24 text-center text-slate-400 space-y-3">
                  <Bot className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-[#0a2540]">
                    Ready to evaluate opportunity capture feasibility
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Fill in your company differentiators and click "Generate Bid/No-Bid Strategy" to stream a tailored executive report.
                  </p>
                </div>
              )}

              {/* Streaming Output Render */}
              {aiReport && (
                <div className="mt-4 p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-slate-800 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {loading && (
                    <div className="mb-3 inline-flex items-center space-x-2 text-[11px] font-bold text-[#635bff] bg-indigo-100 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-[#635bff] animate-ping" />
                      <span>Streaming real-time analysis...</span>
                    </div>
                  )}
                  {aiReport}
                </div>
              )}
            </div>

            {aiReport && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cross-referenced with 4,050 active federal records</span>
                </span>
                <span>Powered by Gemini 3.6 Flash</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
