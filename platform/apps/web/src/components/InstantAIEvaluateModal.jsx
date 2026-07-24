'use client';
import { useState } from 'react';
import { Sparkles, X, Link as LinkIcon, FileText, ArrowRight, Loader2 } from 'lucide-react';

export function InstantAIEvaluateModal({ isOpen, onClose }) {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!inputUrl) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityDetails: inputUrl })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">Instant AI Evaluate</h2>
              <p className="text-sm font-medium text-muted-foreground">Paste a SAM.gov URL or RFP text to instantly generate a Bid/No-Bid assessment.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          {!result ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  Opportunity URL or Text
                </label>
                <textarea 
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://sam.gov/opp/..."
                  className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-background text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none shadow-sm"
                />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-700">
                <FileText className="w-5 h-5 shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">
                  Our Gemini 2.5 AI will extract the requirements, evaluate your win probability, identify risks, and generate an executive summary in seconds.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Recommendation</span>
                  <span className={`text-2xl font-extrabold ${
                    result.recommendation === 'BID' ? 'text-emerald-600' : 
                    result.recommendation === 'NO BID' ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    {result.recommendation}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Win Probability</span>
                  <span className="text-2xl font-extrabold text-foreground font-mono">{result.score}%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background shadow-sm">
                <h4 className="text-sm font-bold text-foreground mb-2">Executive Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          {!result ? (
            <button 
              onClick={handleAnalyze}
              disabled={!inputUrl || loading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all hover:-translate-y-[1px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Analyzing...' : 'Analyze Opportunity'}
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
            >
              View Full Report <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
