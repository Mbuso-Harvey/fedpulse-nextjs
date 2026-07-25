'use client';
import React, { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePipeline } from "@/lib/api"
import { DollarSign, Clock, Users, Target, Building2, MoreHorizontal } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 1,
    notation: "compact"
  }).format(value);
};

const STAGES = [
  { id: 'qualification', label: 'Qualification' },
  { id: 'teaming', label: 'Teaming' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'submitted', label: 'Submitted' },
];

export default function PipelinePage() {
  const { data: items, loading, error } = usePipeline();

  if (loading) return <div className="p-8 text-slate-400">Loading pipeline...</div>;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--header-height": "3rem",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex-1 overflow-x-auto bg-[#f6f9fc]">
          <div className="p-8 min-w-max h-full">
            <div className="mb-8">
              <h1 className="text-[24px] font-semibold text-slate-900 tracking-tight">Capture Pipeline</h1>
              <p className="text-[14px] text-slate-500 mt-1">Manage and track your active bids and teaming opportunities.</p>
            </div>

            <div className="flex space-x-6 h-[calc(100vh-12rem)]">
              {STAGES.map(stage => {
                const stageItems = items.filter(item => item.stage === stage.id);
                
                return (
                  <div key={stage.id} className="w-80 flex flex-col">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wider">{stage.label}</h2>
                        <span className="bg-slate-200 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                          {stageItems.length}
                        </span>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                      {stageItems.map(item => (
                        <Card key={item.id} className="border-none shadow-[0_2px_5px_rgba(60,66,87,0.08),0_1px_1px_rgba(0,0,0,0.04)] hover:shadow-[0_5px_15px_rgba(60,66,87,0.12),0_2px_4px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-grab bg-white rounded-xl">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <Badge variant="outline" className={`text-[10px] uppercase font-bold border-none px-2 py-0.5
                                ${item.recommendation === 'BID' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                {item.recommendation}
                              </Badge>
                              <span className="text-[12px] font-medium text-slate-500 flex items-center">
                                <Target className="w-3 h-3 mr-1" />
                                {item.winProbability}% pWin
                              </span>
                            </div>
                            
                            <h3 className="font-semibold text-[14px] text-slate-900 leading-snug mb-1 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-[12px] text-slate-500 mb-4 flex items-center truncate">
                              <Building2 className="w-3 h-3 mr-1 shrink-0" />
                              {item.agency}
                            </p>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[13px]">
                              <div className="font-medium text-slate-900 flex items-center">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
                                {formatCurrency(item.value).replace('$', '')}
                              </div>
                              <div className="text-slate-500 flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1" />
                                {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>

                            {item.assignedTeam && item.assignedTeam.length > 0 && (
                              <div className="mt-4 flex items-center">
                                <div className="flex -space-x-2">
                                  {item.assignedTeam.map((member, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-600" title={member}>
                                      {member.split(' ')[0][0]}{member.split(' ')[1]?.[0]}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
