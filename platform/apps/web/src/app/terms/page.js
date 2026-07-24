import React from 'react';
import { FileSignature, Scale, AlertCircle, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="py-20 text-center">
        <div className="p-4">
          <FileSignature className="p-4" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
        <p className="text-slate-500 text-lg">
          The rules and guidelines for using the Procurement Intelligence Network platform.
        </p>
        <div className="p-4">Effective Date: July 23, 2026</div>
      </div>

      <div className="p-4">
        <div className="card" style={{ padding: '40px' }}>
          <div className="p-4">
            <AlertCircle className="p-4" />
            <div>
              <h4 className="p-4">Important Notice</h4>
              <p className="caption">By accessing or using our services, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.</p>
            </div>
          </div>

          <section className="p-4">
            <div className="p-4">
              <Scale className="p-4" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Procurement Intelligence Network ("we," "us" or "our"), concerning your access to and use of our platform and services.</p>
          </section>
          
          <section className="p-4">
            <div className="p-4">
              <FileText className="p-4" />
              <h2>2. Intellectual Property Rights</h2>
            </div>
            <p>Unless otherwise indicated, the platform is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the platform (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.</p>
          </section>

          <section className="p-4">
            <h2>3. User Representations</h2>
            <p>By using the platform, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and you agree to comply with these Terms of Service.</p>
          </section>

          <section className="p-4">
            <h2>4. Prohibited Activities</h2>
            <p>You may not access or use the platform for any purpose other than that for which we make the platform available. The platform may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
