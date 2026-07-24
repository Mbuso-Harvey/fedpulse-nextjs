'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isAuthEnabled } from './supabase'

const AuthContext = createContext({})

const DEV_USER = {
  id: 'dev-user',
  email: 'dev@procurementintel.com',
  user_metadata: { 
    full_name: 'Developer', 
    subscription_tier: 'professional', 
    is_trial: true, 
    trial_end: new Date(Date.now() + 14*24*60*60*1000).toISOString() 
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthEnabled()) {
      // Fallback to dev user if Supabase is not configured
      setUser(DEV_USER)
      setLoading(false)
      return
    }

    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user ?? null)
      } catch (err) {
        console.error('Error getting session:', err.message)
      } finally {
        setLoading(false)
      }
    }

    initSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
