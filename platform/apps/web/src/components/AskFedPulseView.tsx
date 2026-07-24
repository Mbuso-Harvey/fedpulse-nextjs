"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, Sparkles, Bot, User, Trash2, Copy, 
  Check, Radio, ShieldCheck, ArrowRight, CornerDownLeft, Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
}

export const AskFedPulseView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I am FedPulse AI, your federal procurement intelligence advisor. Ask me anything about Canadian federal tenders, $22.4B in expiring contracts, department spending habits, or incumbent supplier win rates.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Which DND cloud contracts expire in 60 days?",
    "Top 5 suppliers for Shared Services Canada?",
    "What is IBM's incumbent win rate?",
    "How do I de-risk Canadian data sovereignty in RFPs?",
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.answer || "I checked the federal procurement database but found no matching records.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ["Shared Services Canada Data Lake", "PSPC Active Tender Index"],
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "Apologies, I encountered a temporary network issue connecting to the procurement intelligence graph. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'assistant',
        text: "Chat cleared. What federal procurement question can I answer for you?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  return (
    <div className="py-8 bg-[#f6f9fc] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title Header */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6ebf1] shadow-stripe-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#635bff] mb-1">
              <Radio className="w-4 h-4 animate-pulse text-emerald-500" />
              <span>Connected to 4,050 Active Federal Contract Knowledge Graph</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#0a2540]">
              Ask FedPulse Procurement Advisor
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Natural language Q&A across Canadian federal tenders, buyer habits, and incumbent suppliers.
            </p>
          </div>

          <button
            onClick={handleClearChat}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear History</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mb-6 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Procurement Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50/80 text-[#0a2540] hover:text-[#635bff] border border-[#e6ebf1] hover:border-indigo-200 text-xs font-medium transition-all shadow-stripe-sm cursor-pointer disabled:opacity-50 text-left flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#635bff]" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread Container */}
        <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-stripe flex flex-col h-[580px] overflow-hidden">
          
          {/* Scrollable Message List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isUser ? 'bg-[#0a2540] text-white' : 'bg-[#635bff] text-white shadow-stripe-sm'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-[#635bff] text-white font-medium shadow-stripe-sm' 
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className={`font-bold text-[11px] ${isUser ? 'text-indigo-100' : 'text-[#0a2540]'}`}>
                        {isUser ? 'You' : 'FedPulse AI'}
                      </span>
                      <span className={`text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Citations / Sources for Assistant */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="font-bold text-slate-400">Sources:</span>
                        {msg.sources.map((src, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono">
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Copy button */}
                    {!isUser && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors inline-flex items-center space-x-1"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px]">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-[#635bff] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-[#635bff] animate-spin" />
                  <span>Querying federal procurement database...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Sticky Bottom Input Bar */}
          <div className="p-4 bg-slate-50 border-t border-[#e6ebf1]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask FedPulse about expiring tenders, suppliers, departments..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-white border border-[#e6ebf1] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] outline-none shadow-stripe-sm placeholder-slate-400"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="px-5 py-3 rounded-xl bg-[#635bff] hover:bg-[#5469d4] text-white font-bold text-xs shadow-stripe transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
