import { Users, UserPlus, Mail, Shield, MoreVertical } from 'lucide-react';

export default function TeamPage() {
  const members = [
    { name: 'Sarah Connor', email: 'sarah@example.com', role: 'Admin', initials: 'SC', status: 'Active' },
    { name: 'John Smith', email: 'john@example.com', role: 'Editor', initials: 'JS', status: 'Active' },
    { name: 'Alice Wong', email: 'alice@example.com', role: 'Viewer', initials: 'AW', status: 'Pending' },
    { name: 'Michael Chang', email: 'michael@example.com', role: 'Editor', initials: 'MC', status: 'Active' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Management</h1>
          <p className="text-slate-500 text-lg">Manage your team members and their roles.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={18} style={{ marginRight: 8 }} />
          Invite Member
        </button>
      </div>

      <div className="grid-2">
        {members.map((member, i) => (
          <div key={i} className={`card `}>
            <div className="p-4">{member.initials}</div>
            <div className="p-4">
              <div className="p-4">
                <span className="p-4">{member.name}</span>
                {member.status === 'Active' ? (
                   <span className="badge badge-success">Active</span>
                ) : (
                   <span className="badge badge-warning">Pending</span>
                )}
              </div>
              <div className="p-4">
                <Mail size={14} /> {member.email}
              </div>
              <div className="p-4">
                <Shield size={14} /> {member.role}
              </div>
            </div>
            <button className="btn btn-ghost" style={{ padding: '8px' }}>
              <MoreVertical size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
