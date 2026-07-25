'use client';

import { useState, useEffect } from 'react';
import { Target, Search, AlertTriangle, CheckCircle, TrendingUp, ShieldAlert, Loader2, BarChart3, AlertCircle } from 'lucide-react';

export default function OpportunitiesPage() {
  const [selectedContract, setSelectedContract] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockData = {
    complexityScore: 78,
    readinessScore: 45,
    risks: [
      { id: 1, title: 'Incumbent Advantage', severity: 'high', desc: 'Current incumbent has held contract for 10 years' },
      { id: 2, title: 'Compliance Requirements', severity: 'medium', desc: 'Requires FedRAMP High certification' },
      { id: 3, title: 'Timeline constraints', severity: 'low', desc: 'Short turnaround for proposal submission' }
    ],
    recommendation: 'Strategic Teaming Recommended. Due to the high complexity and incumbent advantage, partnering with a certified SBA firm is advised to improve win probability.'
  };

  useEffect(() => {
    async function fetchData() {
      if (!selectedContract) {
        setData(null);
        return;
      }
      
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${API_URL}/renewals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: 1,
            page_size: 5,
            filters: { search_query: selectedContract }
          })
        });
        
        if (res.ok) {
          const result = await res.json();
          if (result.data && result.data.length > 0) {
            const firstOpp = result.data[0];
            
            const contractValue = firstOpp.clean_contract_value || 0;
            const daysLeft = firstOpp.days_until_end || 0;
            
            let complexity = 50;
            if (contractValue > 1000000) complexity += 30;
            if (contractValue > 5000000) complexity += 15;
            
            let readiness = 80;
            if (daysLeft < 30) readiness -= 40;
            if (daysLeft < 90) readiness -= 20;

            setData({
              isLive: true,
              title: firstOpp.title || 'Untitled Contract',
              department: firstOpp.buyer_department,
              complexityScore: Math.min(100, complexity),
              readinessScore: Math.max(0, readiness),
              risks: [
                { id: 1, title: 'Urgency Risk', severity: daysLeft < 60 ? 'high' : 'low', desc: `Only ${daysLeft} days until contract expires.` },
                { id: 2, title: 'Value Threshold', severity: contractValue > 5000000 ? 'high' : 'medium', desc: `High value contract ($${contractValue.toLocaleString()}) requires thorough review.` }
              ],
              recommendation: `AI Recommendation: This ${firstOpp.procurement_category || 'procurement'} opportunity for ${firstOpp.buyer_department} requires immediate attention.`
            });
          } else {
            setData(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    }
    
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedContract]);

  const displayData = data || mockData;

  const getRiskColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-700   border-red-200 ';
      case 'medium': return 'bg-amber-100 text-amber-700   border-amber-200 ';
      case 'low': return 'bg-emerald-100 text-emerald-700   border-emerald-200 ';
      default: return 'bg-slate-100 text-slate-700  ';
    }
  };
  
  const getRiskDot = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'medium': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'low': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900  flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25">
            <Target className="w-6 h-6" />
          </div>
          Opportunity Intelligence
        </h1>
        <p className="text-slate-500  text-lg">Assess win probability and contract complexity using live Federal data.</p>
      </header>

      <div className="relative max-w-3xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>
        <input 
          type="text" 
          placeholder="Search live federal contracts by title, department, or ID..."
          value={selectedContract}
          onChange={(e) => setSelectedContract(e.target.value)}
          className="w-full bg-white  border-2 border-slate-200  text-slate-900  rounded-2xl pl-12 pr-4 py-4 text-lg outline-none focus:border-blue-500  focus:ring-4 focus:ring-blue-500/20 shadow-sm transition-all"
        />
        
        {data && data.isLive && (
          <div className="absolute -bottom-8 left-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600  bg-emerald-50  px-2.5 py-1 rounded-full border border-emerald-100 ">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Showing Live Data: <strong className="font-bold">{data.title}</strong> ({data.department})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Complexity Gauge */}
        <div className="bg-white/60  backdrop-blur-xl border border-slate-200  rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-indigo-50  text-indigo-600  flex items-center justify-center mb-6">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900  mb-8">Complexity Score</h3>
          
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 " />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * displayData.complexityScore) / 100}
                className={`${displayData.complexityScore > 75 ? 'text-rose-500' : 'text-amber-500'} transition-all duration-1000 ease-out`} 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-900 ">{displayData.complexityScore}</span>
              <span className="text-sm font-medium text-slate-500 mt-1">/ 100</span>
            </div>
          </div>
          
          <p className="mt-6 font-medium text-slate-600  bg-slate-50  px-4 py-2 rounded-xl">
            {displayData.complexityScore > 75 ? 'High Complexity' : 'Medium Complexity'}
          </p>
        </div>

        {/* Readiness Gauge */}
        <div className="bg-white/60  backdrop-blur-xl border border-slate-200  rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-blue-50  text-blue-600  flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900  mb-8">Bid Readiness Score</h3>
          
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 " />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * displayData.readinessScore) / 100}
                className={`${displayData.readinessScore < 50 ? 'text-rose-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`} 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-900 ">{displayData.readinessScore}</span>
              <span className="text-sm font-medium text-slate-500 mt-1">/ 100</span>
            </div>
          </div>
          
          <p className="mt-6 font-medium text-slate-600  bg-slate-50  px-4 py-2 rounded-xl">
            {displayData.readinessScore < 50 ? 'Needs Improvement' : 'Ready to Bid'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Flags */}
        <div className="bg-white  rounded-3xl border border-slate-200  p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 ">
            <div className="p-2.5 bg-rose-50  rounded-xl">
              <ShieldAlert className="w-5 h-5 text-rose-600 " />
            </div>
            <h3 className="text-xl font-bold text-slate-900 ">Risk Flags</h3>
          </div>
          
          <div className="space-y-4">
            {displayData.risks.map(risk => (
              <div key={risk.id} className={`flex gap-4 p-4 rounded-2xl border ${getRiskColor(risk.severity)} bg-opacity-50 `}>
                <div className="mt-1">
                  <div className={`w-3 h-3 rounded-full ${getRiskDot(risk.severity)}`}></div>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-inherit">{risk.title}</h4>
                  <p className="text-sm opacity-90">{risk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl border border-blue-500 p-6 sm:p-8 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-900 opacity-20 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
              <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <TrendingUp className="w-5 h-5 text-blue-100" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Recommendation</h3>
            </div>
            
            <div className="flex-1 text-lg leading-relaxed text-blue-50 font-medium">
              {displayData.recommendation}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                Generated by FedPulse AI
              </div>
              <button className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-sm transition-colors active:scale-95">
                Generate Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

