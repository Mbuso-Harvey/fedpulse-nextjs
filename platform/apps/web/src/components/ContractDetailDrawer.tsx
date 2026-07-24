"use client";
import React from 'react';
import { Contract } from '@/lib/types';
import { 
  X, Sparkles, Building2, Calendar, ShieldAlert, Award, FileText, 
  ExternalLink, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, ChevronRight
} from 'lucide-react';

interface ContractDetailDrawerProps {
  contract: Contract | null;
  onClose: () => void;
  onRunAiAnalyst: (contract: Contract) => void;
}

export const ContractDetailDrawer: React.FC<ContractDetailDrawerProps> = ({
  contract,
  onClose,
  onRunAiAnalyst,
}) => {
  if (!contract) return null;

  const isUrgent = contract.daysLeft <= 30;
  const isWarning = contract.daysLeft > 30 && contract.daysLeft <= 60;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-[#e6ebf1] shadow-stripe-lg flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-[#e6ebf1] flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 mb-1">
                <span>{contract.rfpReference}</span>
                <span>•</span>
                <span className="font-sans font-semibold text-[#635bff]">{contract.category}</span>
              </div>

              <h2 className="text-xl font-extrabold text-[#0a2540] leading-snug">
                {contract.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {contract.department}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
            {/* Top Primary Callout Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-slate-50 border border-indigo-100/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Estimated Contract Value</span>
                <span className="text-2xl font-black text-[#0a2540]">{contract.value}</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-medium block">AI Win Score</span>
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#635bff] text-white font-bold text-xs shadow-stripe-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{contract.winProbability}%</span>
                </div>
              </div>
            </div>

            {/* Quick Timeline & Risk Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#635bff]" />
                  <span>Renewal Window</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    isUrgent ? 'bg-rose-50 text-rose-600' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {contract.daysLeft} Days Left
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">({contract.expiryDate})</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Incumbent Lock-in Risk</span>
                </div>
                <div className="font-bold text-[#0a2540]">
                  {contract.riskLevel} INCUMBENT RISK
                </div>
              </div>
            </div>

            {/* Incumbent Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0a2540] text-xs">Current Incumbent Vendor:</span>
                <span className="font-extrabold text-[#635bff] text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {contract.supplier}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                {contract.incumbentAdvantage}
              </p>
            </div>

            {/* Scope Summary */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#0a2540] text-xs flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-[#635bff]" />
                <span>Contract Scope & Deliverables</span>
              </h4>
              <p className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-600 leading-relaxed text-xs">
                {contract.scopeSummary}
              </p>
            </div>

            {/* AI Strategic Intelligence Highlights */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex items-center space-x-2 text-[#635bff] font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>FedPulse AI Capture Highlights</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Early capture window opens 90 days before draft tender issuance.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Department spending trends show 14% budget allocation growth in {contract.category}.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Canadian Protected B security clearing mandatory for prime contractors.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sticky Drawer Footer with Prominent CTA */}
          <div className="p-5 bg-slate-50 border-t border-[#e6ebf1] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onRunAiAnalyst(contract);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#635bff] hover:bg-[#5469d4] text-white font-bold text-xs shadow-stripe transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Run AI Bid Strategy Analysis</span>
              <ChevronRight className="w-4 h-4 text-white/80" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
