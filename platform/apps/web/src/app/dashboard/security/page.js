import { ShieldCheck, Smartphone, KeyRound, History } from 'lucide-react';

export default function SecurityPage() {
  const settings = [
    {
      icon: <Smartphone size={24} className="p-4" />,
      title: 'Two-Factor Authentication (2FA)',
      description: 'Add an extra layer of security to your account.',
      status: 'Enabled',
      action: 'Manage',
    },
    {
      icon: <KeyRound size={24} className="p-4" />,
      title: 'Password',
      description: 'Last changed 3 months ago.',
      status: '',
      action: 'Update',
    },
    {
      icon: <History size={24} className="p-4" />,
      title: 'Active Sessions',
      description: 'Manage devices currently logged into your account.',
      status: '2 Devices',
      action: 'View All',
    },
    {
      icon: <ShieldCheck size={24} className="p-4" />,
      title: 'Security Log',
      description: 'Review recent authentication events and changes.',
      status: '',
      action: 'Review',
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Security & Authentication</h1>
          <p className="text-slate-500 text-lg">Manage your account security settings and review active sessions.</p>
        </div>
      </div>

      <div className="grid-2">
        {settings.map((setting, i) => (
          <div key={i} className={`card `}>
            <div className="p-4">{setting.icon}</div>
            <div className="p-4">
              <div className="p-4">
                <h3 className="p-4">{setting.title}</h3>
                {setting.status === 'Enabled' && (
                  <span className="badge badge-success">Enabled</span>
                )}
                {setting.status && setting.status !== 'Enabled' && (
                  <span className="badge" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>{setting.status}</span>
                )}
              </div>
              <p className="p-4">{setting.description}</p>
            </div>
            <button className="btn btn-secondary">{setting.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
