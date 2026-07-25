import { useState, useEffect } from 'react';
import { Contract, DepartmentProfile, SupplierProfile, CaptureItem } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Add the missing functions
export async function fetchRenewals(params: any = {}) {
  try {
    const response = await fetch(`${API_URL}/renewals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) return { error: true };
    return await response.json();
  } catch (err) {
    return { error: true };
  }
}

export async function fetchRenewalStats() {
  try {
    const response = await fetch(`${API_URL}/renewals/stats`);
    if (!response.ok) return { error: true };
    return await response.json();
  } catch (err) {
    return { error: true };
  }
}

export async function fetchRenewalDepartments() {
  try {
    const response = await fetch(`${API_URL}/renewals/departments`);
    if (!response.ok) return { error: true };
    return await response.json();
  } catch (err) {
    return { error: true };
  }
}

export async function fetchRenewalSuppliers() {
  try {
    const response = await fetch(`${API_URL}/renewals/suppliers`);
    if (!response.ok) return { error: true };
    return await response.json();
  } catch (err) {
    return { error: true };
  }
}

export function useContracts() {
  const [data, setData] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const response = await fetch(`${API_URL}/renewals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 1, page_size: 50 })
        });
        
        if (!response.ok) throw new Error('Failed to fetch contracts');
        const json = await response.json();
        
        // Map backend format to UI format
        const formatted: Contract[] = (json.data || []).map((item: any) => ({
          id: item.contract_id || item.contract_number,
          referenceNumber: item.reference_number || '',
          title: item.title || 'Untitled Contract',
          department: item.buyer_department || 'Unknown Department',
          subAgency: 'N/A',
          incumbent: item.supplier_master_name || 'Unknown Supplier',
          value: item.clean_contract_value || 0,
          expirationDate: item.contract_end_date || '',
          daysLeft: item.days_until_end || 0,
          status: 'Active',
          naicsCode: item.unspsc_code || '',
          setAside: 'None',
          description: item.description || '',
          rfpReference: item.solicitation_number || '',
          category: item.procurement_category || 'General',
          expiryDate: item.clean_contract_end_date || item.contract_end_date || '',
        }));
        
        setData(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContracts();
  }, []);

  return { data, loading, error };
}

export function useDepartments() {
  const [data, setData] = useState<DepartmentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDepartmentsData() {
      try {
        const response = await fetch(`${API_URL}/renewals/departments`);
        if (!response.ok) throw new Error('Failed to fetch departments');
        const json = await response.json();
        
        const formatted: DepartmentProfile[] = json.map((item: any, i: number) => ({
          id: `dept-${i}`,
          name: item.department_name,
          code: item.department_name.substring(0, 4).toUpperCase(),
          totalValue: item.renewal_value || 0,
          contractCount: item.renewal_count || 0,
          topSuppliers: [], 
          topCategories: [],
          renewalExposure: { urgent: 0, soon: 0, watch: 0 },
          spendingTrend: [],
          subAgencies: [],
        }));
        
        setData(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDepartmentsData();
  }, []);

  return { data, loading, error };
}

export function useSuppliers() {
  const [data, setData] = useState<SupplierProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuppliersData() {
      try {
        const response = await fetch(`${API_URL}/renewals/suppliers`);
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const json = await response.json();
        
        const formatted: SupplierProfile[] = json.map((item: any, i: number) => ({
          id: `sup-${i}`,
          name: item.supplier_name,
          totalContractValue: item.renewal_value || 0,
          marketShare: 0,
          influenceScore: 0,
          contractCount: item.renewal_count || 0,
          isTeamingPartnerCandidate: false,
          setAsideCapabilities: [],
          clearances: [],
          coreCompetencies: [],
          departmentFootprint: [],
          location: 'Unknown',
        }));
        
        setData(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSuppliersData();
  }, []);

  return { data, loading, error };
}

export function usePipeline() {
  const [data, setData] = useState<CaptureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPipeline() {
      try {
        const response = await fetch(`${API_URL}/pipeline`);
        if (!response.ok) throw new Error('Failed to fetch pipeline');
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPipeline();
  }, []);

  return { data, loading, error };
}

export async function createCheckoutSession(tier: string, priceId: string) {
  try {
    const response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, priceId })
    });
    if (!response.ok) return { error: true };
    return await response.json();
  } catch (err) {
    return { error: true };
  }
}
