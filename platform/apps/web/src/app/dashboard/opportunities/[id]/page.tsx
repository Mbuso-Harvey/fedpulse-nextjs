'use client';
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Archive, 
  Trash2, 
  Mail, 
  Clock, 
  MoreVertical,
  Reply,
  Star,
  Printer,
  ExternalLink,
  Bot,
  Building,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import Link from 'next/link';

export default function OpportunityDetail({ params }: { params: { id: string } }) {
  const [isStarred, setIsStarred] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-[14px]">
      {/* Gmail Top Action Bar */}
      <div className="flex items-center px-4 py-2 border-b bg-white sticky top-0 z-10">
        <Link href="/dashboard" className="p-2 hover:bg-[#f1f3f4] rounded-full mr-4 transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#5f6368]" />
        </Link>
        <div className="flex items-center space-x-1 border-r pr-2 mr-2 border-gray-200">
          <button className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors" title="Archive">
            <Archive className="w-5 h-5 text-[#5f6368]" />
          </button>
          <button className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors" title="Delete">
            <Trash2 className="w-5 h-5 text-[#5f6368]" />
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors" title="Snooze">
            <Clock className="w-5 h-5 text-[#5f6368]" />
          </button>
          <button className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors" title="Mark as unread">
            <Mail className="w-5 h-5 text-[#5f6368]" />
          </button>
        </div>
        <div className="ml-auto flex items-center space-x-2 text-[12px] text-[#5f6368]">
          <span>1 of 50</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto pt-5 pb-20 px-8">
          
          {/* Email Subject / Header */}
          <div className="flex items-start justify-between mb-8">
            <h1 className="text-[22px] font-normal text-[#202124] leading-tight">
              Enterprise Cloud Migration Services (W912HQ-25-R-0012)
              <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-sm text-[12px] bg-[#dddddd] text-[#222222] align-middle">
                Inbox
              </span>
            </h1>
            <div className="flex items-center space-x-2 shrink-0 ml-4 mt-1">
              <button className="p-2 hover:bg-[#f1f3f4] rounded-full text-[#5f6368]">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-[#f1f3f4] rounded-full text-[#5f6368]">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sender Row (The Agency) */}
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-lg mr-4 shrink-0">
              D
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline space-x-2 truncate">
                  <span className="font-bold text-[#202124] text-[14px]">Department of Defense</span>
                  <span className="text-[#5f6368] text-[12px] truncate">&lt;contracting@mail.mil&gt;</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  <span className="text-[#5f6368] text-[12px]">Oct 24, 2024, 9:15 AM</span>
                  <button 
                    onClick={() => setIsStarred(!isStarred)}
                    className="p-1 hover:bg-[#f1f3f4] rounded-full ml-2"
                  >
                    <Star className={`w-5 h-5 ${isStarred ? 'text-[#f4b400] fill-[#f4b400]' : 'text-[#5f6368]'}`} />
                  </button>
                  <button className="p-1 hover:bg-[#f1f3f4] rounded-full text-[#5f6368]">
                    <Reply className="w-5 h-5" />
                  </button>
                  <button className="p-1 hover:bg-[#f1f3f4] rounded-full text-[#5f6368]">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-[#5f6368] text-[12px] mt-0.5">
                to FedPulse Intelligence
              </div>
            </div>
          </div>

          {/* Stripe-style Metadata Surface */}
          <div className="pl-14 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" /> Est. Value
                  </div>
                  <div className="text-[16px] font-medium text-slate-900">$45.0M</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> Due Date
                  </div>
                  <div className="text-[16px] font-medium text-slate-900">Nov 30, 2024</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                    <Building className="w-3 h-3 mr-1" /> Incumbent
                  </div>
                  <div className="text-[16px] font-medium text-slate-900">Leidos</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                    <Tag className="w-3 h-3 mr-1" /> Set-Aside
                  </div>
                  <div className="text-[16px] font-medium text-slate-900">Full & Open</div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body (Solicitation Details) */}
          <div className="text-[14px] text-[#202124] leading-[1.6] space-y-4 pl-14">
            <p>
              This is a Request for Proposal (RFP) for Enterprise Cloud Migration Services.
              The Department of Defense (DoD) is seeking contractors to provide comprehensive cloud migration,
              modernization, and sustainment services.
            </p>
            
            <div className="my-6 p-4 border-l-4 border-[#1a73e8] bg-[#f8f9fa] rounded-r-md">
              <h3 className="font-bold mb-2">Key Dates:</h3>
              <ul className="list-disc pl-5 space-y-1 text-[#3c4043]">
                <li>Questions Due: Nov 5, 2024</li>
                <li>Proposals Due: Nov 30, 2024</li>
                <li>Expected Award: Feb 15, 2025</li>
              </ul>
            </div>

            <p>
              The objective is to accelerate the adoption of secure cloud infrastructure across multiple combatant commands, 
              leveraging Zero Trust architectures and DevSecOps pipelines.
            </p>
            
            <p>
              Please review the attached Performance Work Statement (PWS) for detailed requirements.
            </p>
          </div>

          {/* Attachments Section (Stripe-styled Cards inside Gmail) */}
          <div className="pl-14 mt-8 pt-4 border-t border-gray-200">
            <div className="text-[13px] font-bold text-[#5f6368] mb-3">2 Attachments</div>
            <div className="flex space-x-4">
              <div className="w-56 border border-slate-200 bg-white rounded-lg p-3 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-[10px]">PDF</div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-slate-900 truncate">PWS_Final.pdf</div>
                  <div className="text-[11px] text-slate-500">2.4 MB</div>
                </div>
              </div>
              <div className="w-56 border border-slate-200 bg-white rounded-lg p-3 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold text-[10px]">XLS</div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-slate-900 truncate">Pricing_Matrix.xlsx</div>
                  <div className="text-[11px] text-slate-500">156 KB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini Reply Box (Clone of Gmail Quick Reply) */}
          <div className="pl-14 mt-12">
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#1a73e8] focus-within:border-[#1a73e8] transition-all">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 text-slate-600">
                <Bot className="w-4 h-4 text-[#1a73e8]" />
                <span className="text-[13px] font-medium">Ask Gemini to analyze this contract...</span>
              </div>
              <textarea 
                className="w-full p-4 text-[14px] outline-none min-h-[100px] resize-y text-slate-900"
                placeholder="E.g., Summarize the key requirements from the PWS, or tell me who the incumbent is."
              ></textarea>
              <div className="px-4 py-3 bg-white flex items-center justify-between border-t border-slate-100">
                <div className="flex space-x-2">
                  <button className="text-[14px] font-medium bg-[#1a73e8] text-white px-6 py-2 rounded-full hover:bg-[#1557b0] transition-colors shadow-sm">
                    Analyze
                  </button>
                </div>
                <div className="flex space-x-2 text-[#5f6368]">
                  <button className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

