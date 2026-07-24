'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PartyPopper, Sparkles, Crosshair, TrendingUp, FileText, BarChart3, Briefcase, MessageCircle,
  Radio, Search, Bot, BellRing, ArrowRight, ArrowLeft
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [role, setRole] = useState('');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const roles = [
    { id: 'capture', icon: Crosshair, title: 'Capture Manager', desc: 'I find and win government contracts' },
    { id: 'bd', icon: TrendingUp, title: 'Business Development', desc: 'I build pipeline and identify opportunities' },
    { id: 'proposal', icon: FileText, title: 'Proposal Manager', desc: 'I write and manage proposals' },
    { id: 'analyst', icon: BarChart3, title: 'Market Analyst', desc: 'I research procurement trends' },
    { id: 'exec', icon: Briefcase, title: 'Executive', desc: 'I make bid/no-bid decisions' },
    { id: 'consultant', icon: MessageCircle, title: 'Consultant', desc: 'I advise government contractors' },
  ];

  const popularDepartments = [
    'National Defence', 'Public Services and Procurement', 'Shared Services Canada', 'Innovation, Science and Economic Development',
    'Health Canada', 'Transport Canada', 'Global Affairs', 'Environment and Climate Change',
    'Employment and Social Development', 'Agriculture and Agri-Food', 'Fisheries and Oceans', 'Canada Revenue Agency'
  ];

  const popularCategories = [
    'IT Services', 'Professional Services', 'Construction', 'Defence & Security',
    'Healthcare', 'Facilities', 'Transportation', 'Environmental'
  ];

  const features = [
    { icon: Radio, title: 'Renewal Watch', desc: 'Start here — expiring contracts' },
    { icon: Search, title: 'Search', desc: 'Find anything with ⌘K' },
    { icon: Bot, title: 'AI Analyst', desc: 'Get bid recommendations' },
    { icon: BellRing, title: 'Alerts', desc: 'Set your first alert' },
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const finish = () => router.push('/dashboard');

  const toggleDept = (dept) => {
    setDepartments(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const toggleCategory = (cat) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="p-4">
          <div className="p-4">Procurement Intelligence Network</div>
        </div>

        {step > 1 && step < 5 && (
          <div className="p-4">
            {[2, 3, 4].map(num => (
              <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={` ${step === num ? '' : step > num ? '' : ''}`}>
                  {num - 1}
                </div>
                {num < 4 && (
                  <div className={` ${step > num ? '' : ''}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-4" key={`step-${step}`}>
          {step === 1 && (
            <div className="p-4">
              <div className="p-4">
                <PartyPopper size={36} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to Procurement Intelligence Network!</h1>
              <p className="text-slate-500 text-lg">You have 14 days of full Professional access. Let's make them count.</p>
              
              <button className={`btn btn-primary `} onClick={nextStep} style={{ marginTop: '24px' }}>
                Let's Go <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ textAlign: 'center' }}>What best describes your role?</h2>
              <div className="p-4" style={{ marginTop: '32px' }}>
                {roles.map(r => (
                  <button 
                    key={r.id}
                    className={` ${role === r.id ? '' : ''}`}
                    onClick={() => setRole(r.id)}
                  >
                    <r.icon className="p-4" size={24} />
                    <span className="p-4">{r.title}</span>
                    <span className="p-4">{r.desc}</span>
                  </button>
                ))}
              </div>
              
              <div className="p-4">
                <button className="p-4" onClick={prevStep}>
                  <ArrowLeft size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-3px' }}/> Back
                </button>
                <button 
                  className={`btn btn-primary `} 
                  onClick={nextStep}
                  disabled={!role}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ textAlign: 'center' }}>Which departments do you work with?</h2>
              
              <div className="p-4" style={{ marginTop: '32px', justifyContent: 'center' }}>
                {popularDepartments.map(dept => (
                  <button
                    key={dept}
                    className={` ${departments.includes(dept) ? '' : ''}`}
                    onClick={() => toggleDept(dept)}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              
              <div className="p-4">
                <button className="p-4" onClick={prevStep}>
                  <ArrowLeft size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-3px' }}/> Back
                </button>
                <button className="p-4" onClick={nextStep}>Skip</button>
                <button className={`btn btn-primary `} onClick={nextStep}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ textAlign: 'center' }}>What categories of procurement interest you?</h2>
              
              <div className="p-4" style={{ marginTop: '32px', justifyContent: 'center' }}>
                {popularCategories.map(cat => (
                  <button
                    key={cat}
                    className={` ${categories.includes(cat) ? '' : ''}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="p-4">
                <button className="p-4" onClick={prevStep}>
                  <ArrowLeft size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-3px' }}/> Back
                </button>
                <button className="p-4" onClick={nextStep}>Skip</button>
                <button className={`btn btn-primary `} onClick={nextStep}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="p-4">
              <div className="p-4" style={{ width: 64, height: 64, margin: '0 auto 16px' }}>
                <Sparkles size={28} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">You're all set!</h1>
              <p className="text-slate-500 text-lg" style={{ marginBottom: '32px' }}>Here's where to find your intelligence.</p>
              
              <div className="p-4">
                {features.map((f, i) => (
                  <div key={i} className="p-4">
                    <div className="p-4">
                      <f.icon size={20} />
                    </div>
                    <div>
                      <div className="p-4">{f.title}</div>
                      <div className="p-4">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4" style={{ borderTop: 'none', justifyContent: 'center' }}>
                <button className={`btn btn-primary `} onClick={finish} style={{ width: '100%', maxWidth: '300px', justifyContent: 'center' }}>
                  Start Exploring <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
