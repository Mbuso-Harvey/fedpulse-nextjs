import { Bell, Mail, MessageSquare, AlertOctagon } from 'lucide-react';

export default function NotificationsPage() {
  const categories = [
    {
      title: 'Alerts & Anomalies',
      description: 'Receive alerts when data anomalies or high-risk events are detected.',
      email: true,
      push: true,
      icon: <AlertOctagon size={20} className="p-4" />
    },
    {
      title: 'Weekly Digest',
      description: 'A summary of your workspace activity and key metrics.',
      email: true,
      push: false,
      icon: <Mail size={20} className="p-4" />
    },
    {
      title: 'Mentions & Comments',
      description: 'When someone mentions you or comments on your pinned items.',
      email: true,
      push: true,
      icon: <MessageSquare size={20} className="p-4" />
    },
    {
      title: 'System Updates',
      description: 'Product updates, maintenance, and new features.',
      email: false,
      push: true,
      icon: <Bell size={20} className="p-4" />
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notification Preferences</h1>
          <p className="text-slate-500 text-lg">Choose what updates you want to receive and where.</p>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div className="grid-2">
        {categories.map((cat, i) => (
          <div key={i} className={`card `}>
            <div className="p-4">
              <div className="p-4">{cat.icon}</div>
              <div className="p-4">
                <h3 className="p-4">{cat.title}</h3>
                <p className="p-4">{cat.description}</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className="p-4">
              <label className="p-4">
                <input type="checkbox" defaultChecked={cat.email} className="p-4" />
                Email Notifications
              </label>
              <label className="p-4">
                <input type="checkbox" defaultChecked={cat.push} className="p-4" />
                Push Notifications
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
