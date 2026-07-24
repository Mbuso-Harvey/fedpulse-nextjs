'use client'
import { useAuth } from '@/lib/auth-context'

const TIER_LEVELS = { anonymous: 0, starter: 1, professional: 2, enterprise: 3 };

export function TierGate({ requires, children, fallback }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  
  const userTier = user?.user_metadata?.subscription_tier || 'starter';
  const isOnTrial = user?.user_metadata?.is_trial && new Date(user?.user_metadata?.trial_end) > new Date();
  const effectiveTier = isOnTrial ? 'professional' : userTier;
  
  if ((TIER_LEVELS[effectiveTier] || 0) >= (TIER_LEVELS[requires] || 0)) {
    return children;
  }
  return fallback || null;
}
