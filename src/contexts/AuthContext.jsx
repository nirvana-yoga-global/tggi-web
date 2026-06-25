import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { generateNygId } from '../lib/generateNygId'

const AuthContext = createContext(null)

async function fetchOrCreateProfile(authUser) {
  if (!authUser || !supabase) return null

  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle()

  if (existing) return existing

  const nygId = await generateNygId()
  const fullName = authUser.user_metadata?.full_name ?? ''

  const { data: created, error } = await supabase
    .from('profiles')
    .insert({ id: authUser.id, email: authUser.email, full_name: fullName, nyg_id: nygId })
    .select()
    .single()

  if (error) {
    console.error('Profile creation failed:', error.message)
    return null
  }
  return created
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) setProfile(await fetchOrCreateProfile(u))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        setProfile(await fetchOrCreateProfile(u))
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase?.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
