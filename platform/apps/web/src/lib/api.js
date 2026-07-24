export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://fedpulse-api-production.up.railway.app/api/v1';

async function fetchWithHandleError(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      return { error: `API Error: ${response.status} - ${errorText}` };
    }
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Network error occurred' };
  }
}

export async function fetchRenewals({ filters = {}, sortBy = 'days_until_end', sortOrder = 'asc', page = 1, pageSize = 25 } = {}) {
  return fetchWithHandleError(`${API_BASE}/renewals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filters,
      sort_by: sortBy,
      sort_order: sortOrder,
      page,
      page_size: pageSize,
    }),
  });
}

export async function fetchRenewalStats() {
  return fetchWithHandleError(`${API_BASE}/renewals/stats`);
}

export async function fetchRenewalDepartments() {
  return fetchWithHandleError(`${API_BASE}/renewals/departments`);
}

export async function fetchRenewalSuppliers() {
  return fetchWithHandleError(`${API_BASE}/renewals/suppliers`);
}

export async function fetchDepartmentIntelligence(department = null) {
  const url = department 
    ? `${API_BASE}/intelligence/department?name=${encodeURIComponent(department)}`
    : `${API_BASE}/intelligence/department`;
  return fetchWithHandleError(url);
}

export async function fetchSupplierIntelligence(supplier = null) {
  const url = supplier 
    ? `${API_BASE}/intelligence/supplier?name=${encodeURIComponent(supplier)}`
    : `${API_BASE}/intelligence/supplier`;
  return fetchWithHandleError(url);
}

export async function fetchRecommendations() {
  return fetchWithHandleError(`${API_BASE}/recommendations`);
}

export async function fetchHealth() {
  return fetchWithHandleError(`${API_BASE}/health`);
}

export async function createCheckoutSession({ priceId, successUrl, cancelUrl, customerEmail }) {
  return fetchWithHandleError(`${API_BASE}/billing/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price_id: priceId, success_url: successUrl, cancel_url: cancelUrl, customer_email: customerEmail })
  });
}

export async function createPortalSession({ customerId, returnUrl }) {
  return fetchWithHandleError(`${API_BASE}/billing/create-portal-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId, return_url: returnUrl })
  });
}

export async function fetchSubscriptionStatus() {
  return fetchWithHandleError(`${API_BASE}/billing/subscription-status`);
}

export async function fetchPlans() {
  return fetchWithHandleError(`${API_BASE}/billing/plans`);
}
