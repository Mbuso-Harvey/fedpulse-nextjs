import { Key, Plus, Copy, Trash2 } from 'lucide-react';

export default function ApiKeysPage() {
  const keys = [
    { name: 'Production API Key', key: 'pk_live_********************8f9a', created: '2025-01-12', lastUsed: '2 hours ago' },
    { name: 'Development API Key', key: 'pk_test_********************3b2c', created: '2025-03-05', lastUsed: 'Just now' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">API Keys</h1>
          <p className="text-slate-500 text-lg">Manage API keys for accessing the Procurement Intelligence Network programmatically.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} style={{ marginRight: 8 }} />
          Generate New Key
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>API Key</th>
                <th>Created</th>
                <th>Last Used</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{k.name}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{k.key}</td>
                  <td>{k.created}</td>
                  <td>{k.lastUsed}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex gap-4 mt-8">
                      <button className="btn btn-ghost" title="Copy" style={{ padding: '8px' }}>
                        <Copy size={16} />
                      </button>
                      <button className="btn btn-ghost" title="Revoke" style={{ padding: '8px', color: 'var(--accent-red)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
