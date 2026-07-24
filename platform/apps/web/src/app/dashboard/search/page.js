'use client';
import { useState } from 'react';
import { fetchRenewalDepartments, fetchRenewalSuppliers } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      // For mock search, we fetch both and filter
      const [deptData, supplierData] = await Promise.all([
        fetchRenewalDepartments(),
        fetchRenewalSuppliers()
      ]);
      
      const term = searchTerm.toLowerCase();
      
      const deptResults = (deptData || [])
        .filter(d => d.department_name?.toLowerCase().includes(term))
        .map(d => ({
          type: 'Department Renewal',
          title: `Renewal Exposure: ${d.department_name}`,
          department: d.department_name,
          supplier: 'Multiple',
          value: d.renewal_value,
          end_date: 'Various'
        }));
        
      const supplierResults = (supplierData || [])
        .filter(s => s.supplier_name?.toLowerCase().includes(term))
        .map(s => ({
          type: 'Supplier Renewal',
          title: `Renewal Exposure: ${s.supplier_name}`,
          department: 'Multiple',
          supplier: s.supplier_name,
          value: s.renewal_value,
          end_date: 'Various'
        }));

      setResults([...deptResults, ...supplierResults].sort((a, b) => b.value - a.value));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Procurement Search</h1>
      </header>

      <form className="p-4" onSubmit={handleSearch}>
        <div className="p-4">
          <span className="p-4">🔍</span>
          <input
            type="text"
            className="p-4"
            placeholder="Search contracts, departments, suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="p-4">Search</button>
        </div>
      </form>

      <div className="p-4">
        {!hasSearched && !loading && (
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            Start searching to explore federal procurement intelligence
          </div>
        )}

        {loading && (
          <div className="p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4"></div>
            ))}
          </div>
        )}

        {hasSearched && !loading && results.length === 0 && (
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            No results found for "{searchTerm}"
          </div>
        )}

        {hasSearched && !loading && results.length > 0 && (
          <div className="p-4">
            {results.map((result, index) => (
              <div key={index} className="p-4">
                <div className="p-4">{result.type}</div>
                <h3 className="p-4">{result.title}</h3>
                <div className="p-4">
                  <div className="p-4">
                    <span className="p-4">Department:</span>
                    <span>{result.department}</span>
                  </div>
                  <div className="p-4">
                    <span className="p-4">Supplier:</span>
                    <span>{result.supplier}</span>
                  </div>
                  <div className="p-4">
                    <span className="p-4">End Date:</span>
                    <span>{result.end_date}</span>
                  </div>
                </div>
                <div className="p-4">{formatCurrency(result.value)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
