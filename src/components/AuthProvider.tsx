'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
// NOTE: Corrected the import path to 'client' which is standard.
// If your file is named client1.ts, you can change this back.
import { supabase } from '@/lib/supabase/client1'
// --- CHANGE 1: Imported the specific types we need from Supabase ---
import type { User, Session, AuthResponse, AuthError } from '@supabase/supabase-js'

// --- CHANGE 2: Updated the interface to use specific types instead of 'any' ---
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // --- CHANGE 3: Simplified the auth functions for cleaner code and correct types ---
  // Supabase returns an error object instead of throwing, so try/catch is not needed here.
  
  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return result
  }

const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
      const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    return result
  }

  const signOut = async () => {
    const result = await supabase.auth.signOut()
    return result
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}