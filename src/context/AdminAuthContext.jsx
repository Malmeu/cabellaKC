import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('cabella-admin')
    return savedAdmin ? JSON.parse(savedAdmin) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (admin) {
      localStorage.setItem('cabella-admin', JSON.stringify(admin))
    } else {
      localStorage.removeItem('cabella-admin')
    }
  }, [admin])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

      if (error || !data) {
        throw new Error('Email ou mot de passe incorrect')
      }

      setAdmin(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('cabella-admin')
  }

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isAuthenticated: !!admin,
      loading,
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth doit être utilisé dans un AdminAuthProvider')
  }
  return context
}
