import { Activity as ActivityIcon, User, Settings, Database, Filter } from 'lucide-react';

export default function ActivityPage() {
  const logs = [
    { user: 'Sarah Connor', action: 'Created new API key', target: 'Production API Key', time: '10 mins ago', type: 'Settings' },
    { user: 'John Smith', action: 'Exported report', target: 'Q3 Vendor Spend', time: '1 hour ago', type: 'Data' },
    { user: 'System', action: 'Data sync completed', target: 'ERP Integration', time: '3 hours ago', type: 'System' },
    { user: 'Alice Wong', action: 'Invited team member', target: 'michael@example.com', time: '1 day ago', type: 'User' },
    { user: 'Sarah Connor', action: 'Updated security policy', target: '2FA Requirement', time: '2 days ago', type: 'Settings' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'Settings': return <Settings size={16} className="p-4" />;
      case 'Data': return <Database size={16} className="p-4" />;
      case 'System': return <ActivityIcon size={16} className="p-4" />;
      case 'User': return <User size={16} className="p-4" />;
      default: return <ActivityIcon size={16} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Activity Log</h1>
          <p className="text-slate-500 text-lg">Audit trail of all actions performed in your workspace.</p>
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} style={{ marginRight: 8 }} />
          Filter
        </button>
      </div>

      <div className="card">
        <div className="p-4">
          {logs.map((log, i) => (
            <div key={i} className="p-4">
              <div className="p-4">
                {getIcon(log.type)}
              </div>
              <div className="p-4">
                <div className="p-4">
                  <span className="p-4">{log.user}</span>
                  <span className="p-4">{log.time}</span>
                </div>
                <div className="p-4">
                  {log.action} <span className="p-4">{log.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
