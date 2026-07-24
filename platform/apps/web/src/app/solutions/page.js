import React from 'react';
import { 
  BarChart3, 
  Globe2, 
  ShieldCheck, 
  TrendingUp, 
  Factory, 
  Boxes, 
  ArrowRight,
  Zap
} from 'lucide-react';

export default function SolutionsPage() {
  const solutions = [
    {
      icon: <BarChart3 className="p-4" />,
      title: "Spend Analytics",
      description: "Gain complete visibility into your global spend. Identify savings opportunities, track compliance, and monitor supplier performance in real-time."
    },
    {
      icon: <Globe2 className="p-4" />,
      title: "Supplier Discovery",
      description: "Leverage AI to discover qualified suppliers globally. Expand your network, mitigate single-source risks, and optimize your supply chain footprint."
    },
    {
      icon: <ShieldCheck className="p-4" />,
      title: "Risk Management",
      description: "Proactively monitor geopolitical, financial, and operational risks across your entire supplier tier matrix."
    },
    {
      icon: <TrendingUp className="p-4" />,
      title: "Cost Modeling",
      description: "Advanced should-cost modeling powered by real-time commodity indices and market intelligence data."
    },
    {
      icon: <Factory className="p-4" />,
      title: "ESG Tracking",
      description: "Monitor and report on Scope 3 emissions, diversity initiatives, and sustainability metrics across your supplier base."
    },
    {
      icon: <Boxes className="p-4" />,
      title: "Inventory Optimization",
      description: "Predictive analytics to maintain optimal inventory levels, reducing carrying costs while preventing stockouts."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="py-20 text-center">
        <div className={`badge badge-success `}>
          <Zap size={14} style={{ marginRight: '6px' }} />
          Enterprise Solutions
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transform your procurement strategy</h1>
        <p className="text-slate-500 text-lg">
          End-to-end intelligence solutions designed for modern supply chain organizations. 
          Discover actionable insights, mitigate risks, and drive sustainable growth.
        </p>
        <div className="p-4">
          <button className="btn btn-primary btn-lg">Request Demo</button>
          <button className="btn btn-secondary btn-lg">View Case Studies</button>
        </div>
      </div>

      <div className={`grid-3 `}>
        {solutions.map((solution, i) => (
          <div key={i} className={`card `}>
            <div className="p-4">
              {solution.icon}
            </div>
            <h3>{solution.title}</h3>
            <p className="p-4">{solution.description}</p>
            <div className="p-4">
              Learn more <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>

      <div className={`card `}>
        <div className="p-4">
          <h2>Ready to upgrade your supply chain?</h2>
          <p>Join Fortune 500 companies already using our platform.</p>
        </div>
        <button className="btn btn-primary">Contact Sales</button>
      </div>
    </div>
  );
}
