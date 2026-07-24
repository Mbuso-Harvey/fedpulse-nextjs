import { Database, AlertTriangle, CheckCircle, Activity, RefreshCw } from 'lucide-react';

export default function DataQualityPage() {
  const metrics = [
    { label: 'Overall Quality Score', value: '94%', icon: <Activity className="p-4" /> },
    { label: 'Records Processed', value: '1.2M', icon: <Database className="p-4" /> },
    { label: 'Anomalies Detected', value: '234', icon: <AlertTriangle className="p-4" /> },
    { label: 'Auto-resolved', value: '89%', icon: <CheckCircle className="p-4" /> },
  ];

  const recentIssues = [
    { id: 'ISS-001', type: 'Missing Vendor ID', source: 'ERP Sync', severity: 'High', status: 'Pending' },
    { id: 'ISS-002', type: 'Duplicate Invoice', source: 'AP Intake', severity: 'Medium', status: 'Resolved' },
    { id: 'ISS-003', type: 'Invalid Currency Code', source: 'PO System', severity: 'Low', status: 'Pending' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Data Quality</h1>
          <p className="text-slate-500 text-lg">Monitor the health, accuracy, and completeness of your procurement data.</p>
        </div>
        <button className="btn btn-secondary">
          <RefreshCw size={18} style={{ marginRight: 8 }} />
          Run Analysis
        </button>
      </div>

      <div className="grid-4">
        {metrics.map((m, i) => (
          <div key={i} className="card stat-card">
            <div className="flex-between" style={{ marginBottom: 12 }}>
              <span className="p-4">{m.label}</span>
              {m.icon}
            </div>
            <div className="p-4">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header" style={{ padding: '24px 24px 0' }}>
          <h2 className="section-title">Recent Anomalies</h2>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Type</th>
                <th>Source</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.map((issue, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{issue.id}</td>
                  <td>{issue.type}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{issue.source}</td>
                  <td>
                    <span className={`badge ${issue.severity === 'High' ? 'badge-danger' : issue.severity === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td>{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
