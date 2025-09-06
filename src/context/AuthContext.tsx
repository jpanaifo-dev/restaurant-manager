import { createContext, useEffect, useState } from 'react'
import supabase from '../utils/supabase'

type User = {
  id: string
  email: string
}

export type UserDetails = {
  id: string
  first_name: string
  last_name: string
  profile_image?: string | null
  phone?: string | null
  created_at?: string | null
  updated_at?: string | null
  email?: string | null
  gender?: string | null
  username?: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  userDetails: UserDetails | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.getSession()
    session.then(async ({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? '',
        })
      }
      if (data.session?.user) {
        await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single()
          .then(({ data: userData }) => {
            if (userData) setUserDetails(userData)
          })
      }

      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? '' })
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return { error: error.message }
    if (data.user) setUser({ id: data.user.id, email: data.user.email ?? '' })
    return { error: null }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContext
