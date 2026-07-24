import React from 'react';
import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="py-20 text-center">
        <div className="p-4">
          <Shield className="p-4" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 text-lg">
          How we handle, protect, and respect your data at Procurement Intelligence Network.
        </p>
        <div className="p-4">Last updated: July 2026</div>
      </div>

      <div className="p-4">
        <div className={`grid-3 `}>
          <div className="card stat-card">
            <Lock className="p-4" />
            <h3>Enterprise Grade Security</h3>
            <p className="caption">Your data is encrypted at rest and in transit using industry-standard protocols.</p>
          </div>
          <div className="card stat-card">
            <Eye className="p-4" />
            <h3>Transparent Usage</h3>
            <p className="caption">We only use your data to improve your procurement intelligence experience.</p>
          </div>
          <div className="card stat-card">
            <CheckCircle2 className="p-4" />
            <h3>Compliance First</h3>
            <p className="caption">Fully compliant with GDPR, CCPA, and global data protection regulations.</p>
          </div>
        </div>

        <div className="card" style={{ padding: '40px', marginTop: '40px' }}>
          <section className="p-4">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
          </section>
          
          <section className="p-4">
            <h2>2. How We Use Your Information</h2>
            <p>We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, and develop new features.</p>
          </section>
          
          <section className="p-4">
            <h2>3. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal data. We may share your information with vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf.</p>
          </section>

          <section className="p-4">
            <h2>4. Security Measures</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
