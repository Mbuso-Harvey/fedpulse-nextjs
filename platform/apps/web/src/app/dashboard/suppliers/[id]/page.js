'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building, 
  Star, 
  ShieldCheck, 
  Globe, 
  ArrowLeft,
  Mail,
  Phone,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function SupplierDetailPage({ params }) {
  const { id } = params;

  // Mock data
  const supplier = {
    id,
    name: 'TechCorp Global',
    status: 'Preferred',
    rating: 4.8,
    riskLevel: 'Low',
    totalSpend: '$14.2M',
    contact: 'john.doe@techcorp.com',
    phone: '+1 (555) 123-4567',
    website: 'www.techcorp.com',
    location: 'San Francisco, CA'
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <Link href="/dashboard/suppliers" className="p-4">
        <ArrowLeft size={16} />
        Back to Suppliers
      </Link>

      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{supplier.name}</h1>
          <div className="text-slate-500 text-lg">
            <span className="badge badge-success">{supplier.status}</span>
            <span className="p-4"><Star size={14} className="p-4"/> {supplier.rating} / 5.0</span>
            <span className="p-4"><Globe size={14} /> {supplier.location}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button className="btn btn-secondary">
            <Mail size={16} className="p-4" />
            Contact
          </button>
          <button className="btn btn-primary">
            Create Order
          </button>
        </div>
      </div>

      <div className="grid-4">
        <div className="card stat-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="p-4">
            <span className="p-4"><Building size={18}/> Total Spend (YTD)</span>
          </div>
          <div className="p-4">{supplier.totalSpend}</div>
          <div className="p-4">+12% vs last year</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="p-4">
            <span className="p-4"><ShieldCheck size={18}/> Risk Level</span>
          </div>
          <div className="p-4" style={{ color: 'var(--accent-emerald)' }}>{supplier.riskLevel}</div>
          <div className="p-4">Last assessed: 2 mos ago</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="p-4">
            <span className="p-4"><AlertTriangle size={18}/> Active Issues</span>
          </div>
          <div className="p-4">0</div>
          <div className="p-4">All clear</div>
        </div>
        <div className="card stat-card fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="p-4">
            <span className="p-4">Performance</span>
          </div>
          <div className="p-4">98%</div>
          <div className="p-4">On-time delivery</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card fade-in" style={{ animationDelay: '0.5s', padding: '24px' }}>
          <div className="p-4">
            <h3 className="p-4">Supplier Details</h3>
          </div>
          <div className="p-4">
            <div className="p-4">
              <span className="p-4">Contact Email</span>
              <span className="p-4"><Mail size={14}/> {supplier.contact}</span>
            </div>
            <div className="p-4">
              <span className="p-4">Phone Number</span>
              <span className="p-4"><Phone size={14}/> {supplier.phone}</span>
            </div>
            <div className="p-4">
              <span className="p-4">Website</span>
              <span className="p-4"><ExternalLink size={14}/> {supplier.website}</span>
            </div>
          </div>
        </div>
        <div className="card fade-in" style={{ animationDelay: '0.6s', padding: '24px' }}>
          <div className="p-4">
            <h3 className="p-4">Recent Contracts</h3>
          </div>
          <div className="p-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="p-4">
                <div className="p-4">
                  <div className="p-4">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="p-4">MSA - {new Date().getFullYear()}</div>
                    <div className="p-4">Valid until Dec 31</div>
                  </div>
                </div>
                <div className="badge badge-success">Active</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
