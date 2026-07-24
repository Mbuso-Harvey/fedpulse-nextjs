"use client";
import React, { useState } from 'react';
import { SuppliersView } from "@/components/SuppliersView";
import { ContractDetailDrawer } from "@/components/ContractDetailDrawer";

export default function Page() {
  const [selectedContract, setSelectedContract] = useState(null);

  return (
    <div className="flex flex-1 flex-col h-full">
      <SuppliersView 
        onSelectContract={setSelectedContract} 
        onRunAiAnalyst={() => { window.location.href = '/dashboard/ai-analyst' }}
      />
      <ContractDetailDrawer 
        contract={selectedContract} 
        onClose={() => setSelectedContract(null)}
        onRunAiAnalyst={() => { window.location.href = '/dashboard/ai-analyst' }}
      />
    </div>
  )
}
