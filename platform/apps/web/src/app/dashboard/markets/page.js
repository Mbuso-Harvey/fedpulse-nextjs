'use client';

import { BarChart3, PieChart } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

export default function MarketsPage() {
  const expiryData = [
    { name: 'Aug', value: 400 },
    { name: 'Sep', value: 300 },
    { name: 'Oct', value: 800 },
    { name: 'Nov', value: 500 },
    { name: 'Dec', value: 600 },
    { name: 'Jan', value: 450 }
  ];

  const pieData = [
    { name: 'Services', value: 65 },
    { name: 'Goods', value: 25 },
    { name: 'Construction', value: 10 }
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-4"><BarChart3 className="p-4" /></div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Market Overview</h1>
            <p className="text-slate-500 text-lg">$22.4B Federal Procurement Landscape</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4">
          <h3>Contract Expiry (Next 6 Months)</h3>
          <div className="p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expiryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="value" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4">
          <h3>Spend by Type</h3>
          <div className="p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="p-4">
              {pieData.map((entry, index) => (
                <div key={index} className="p-4">
                  <div className="p-4" style={{ backgroundColor: COLORS[index] }}></div>
                  <span>{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
