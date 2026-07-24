import React from 'react';
import { Mail, MessageSquare, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Get in touch</h1>
        <p className="text-slate-500 text-lg">
          Have questions about the Procurement Intelligence Network? Our team is here to help you optimize your supply chain.
        </p>
      </div>

      <div className={`grid-2 `}>
        <div className="p-4">
          <div className="card stat-card">
            <div className="p-4">
              <Mail className="w-6 h-6 text-indigo-500" />
            </div>
            <h3>Email Support</h3>
            <p className="caption" style={{ marginBottom: '16px' }}>Our friendly team is here to help.</p>
            <a href="mailto:support@procurementintel.com" className="p-4">support@procurementintel.com</a>
          </div>

          <div className="card stat-card">
            <div className="p-4">
              <MapPin className="w-6 h-6 text-indigo-500" />
            </div>
            <h3>Global HQ</h3>
            <p className="caption" style={{ marginBottom: '16px' }}>Come say hello at our office HQ.</p>
            <span className="p-4">100 Innovation Drive<br/>San Francisco, CA 94105</span>
          </div>

          <div className="card stat-card">
            <div className="p-4">
              <Phone className="w-6 h-6 text-indigo-500" />
            </div>
            <h3>Phone</h3>
            <p className="caption" style={{ marginBottom: '16px' }}>Mon-Fri from 8am to 5pm.</p>
            <a href="tel:+18001234567" className="p-4">+1 (800) 123-4567</a>
          </div>

          <div className="card stat-card">
            <div className="p-4">
              <MessageSquare className="w-6 h-6 text-indigo-500" />
            </div>
            <h3>Live Chat</h3>
            <p className="caption" style={{ marginBottom: '16px' }}>Available on our enterprise plans.</p>
            <button className="btn btn-secondary">Open Chat <ArrowRight size={16} style={{ marginLeft: '8px' }} /></button>
          </div>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ marginBottom: '24px' }}>Send us a message</h2>
          <form className="p-4">
            <div className="p-4">
              <label>Full Name</label>
              <input type="text" className="input" placeholder="Jane Doe" />
            </div>
            
            <div className="p-4">
              <label>Work Email</label>
              <input type="email" className="input" placeholder="jane@company.com" />
            </div>

            <div className="p-4">
              <label>Company Size</label>
              <select className="select">
                <option>1-50 employees</option>
                <option>51-200 employees</option>
                <option>201-1000 employees</option>
                <option>1000+ employees</option>
              </select>
            </div>

            <div className="p-4">
              <label>Message</label>
              <textarea className="input" rows="4" placeholder="How can we help you?"></textarea>
            </div>

            <button type="button" className={`btn btn-primary `}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
