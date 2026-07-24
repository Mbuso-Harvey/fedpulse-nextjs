'use client';

import { useState } from 'react';
import { Search, Sparkles, AlertCircle, FileText, CheckCircle2, ChevronDown } from 'lucide-react';

export default function AskPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const mockQuestions = [
    "What are the most common contract types?",
    "Which departments spend most on IT?",
    "Top suppliers for cybersecurity?"
  ];

  const handleAsk = (q) => {
    const text = q || query;
    if (!text) return;
    
    setQuery(text);
    setIsSearching(true);
    setResult(null);
    
    setTimeout(() => {
      setIsSearching(false);
      setResult({
        answer: "Based on our analysis of the federal procurement database, Firm Fixed Price (FFP) is the most common contract type, accounting for approximately 68% of all contract actions in FY2025. This is followed by Time and Materials (T&M) at 15%, and Cost Plus Fixed Fee (CPFF) at 10%.",
        confidence: 94,
        citations: [
          { title: "FY2025 Annual Procurement Report", id: "DOC-8921" },
          { title: "Federal Acquisition Regulation (FAR) Part 16", id: "FAR-16" }
        ]
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 p-6">
      <header className="mb-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Question Answering</h1>
            <p className="text-slate-400 mt-1">Ask complex questions about federal procurement data</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto justify-between overflow-hidden relative">
        {/* Chat / Results Area */}
        <div className="flex-1 overflow-y-auto mb-6 pr-4 custom-scrollbar">
          {isSearching && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce"></div>
              </div>
              <p className="text-slate-400 font-medium tracking-wide">Analyzing procurement database...</p>
            </div>
          )}

          {result && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Answer
                </h2>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                  <span className="text-sm text-slate-400">Confidence</span>
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" 
                      style={{width: `${result.confidence}%`}}
                    ></div>
                  </div>
                  <span className="text-emerald-400 font-mono font-medium">{result.confidence}%</span>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed text-slate-200 mb-8">{result.answer}</p>
              
              <div className="bg-black/30 rounded-2xl p-6 border border-white/5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                  <FileText className="w-4 h-4" /> Sources & Citations
                </h3>
                <ul className="space-y-3">
                  {result.citations.map((cite, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-300 group-hover:text-indigo-300 transition-colors cursor-pointer">{cite.title}</span>
                        <span className="block text-xs font-mono text-slate-500 mt-1">{cite.id}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!result && !isSearching && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-16 h-16 text-slate-800 mb-6" />
              <h2 className="text-2xl font-semibold text-slate-300 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 mb-8 max-w-md">Query the federal procurement database using natural language.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 w-full">
          {!result && !isSearching && (
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {mockQuestions.map((q, i) => (
                <button 
                  key={i} 
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-indigo-500/50 rounded-full text-sm text-slate-300 transition-all duration-300 backdrop-blur-md"
                  onClick={() => handleAsk(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-2 flex items-center shadow-xl">
              <Search className="w-6 h-6 text-slate-400 ml-4 mr-2" />
              <input 
                type="text" 
                placeholder="Ask anything about federal procurement..."
                className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 px-2 py-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              />
              <button 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                onClick={() => handleAsk()}
              >
                Ask AI <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">AI can make mistakes. Verify important procurement information.</p>
        </div>
      </main>
    </div>
  );
}
