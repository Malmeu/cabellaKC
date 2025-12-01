import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const ClientAuthContext = createContext()

export function ClientAuthProvider({ children }) {
  const [client, setClient] = useState(() => {
    const savedClient = localStorage.getItem('cabella-client')
    return savedClient ? JSON.parse(savedClient) : null
  })
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (client) {
      localStorage.setItem('cabella-client', JSON.stringify(client))
      fetchNotifications()
    } else {
      localStorage.removeItem('cabella-client')
      setNotifications([])
      setUnreadCount(0)
    }
  }, [client])

  const fetchNotifications = async () => {
    if (!client) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, orders(status, total_price)')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount(data?.filter(n => !n.is_read).length || 0)
    } catch (error) {
      console.error('Erreur notifications:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!client) return

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('client_id', client.id)
        .eq('is_read', false)

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

      if (error || !data) {
        throw new Error('Email ou mot de passe incorrect')
      }

      setClient(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      // Vérifier si l'email existe déjà
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('email', userData.email)
        .single()

      if (existing) {
        throw new Error('Cet email est déjà utilisé')
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          phone: userData.phone || null,
          address: userData.address || null
        })
        .select()
        .single()

      if (error) throw error

      setClient(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!client) return { success: false, error: 'Non connecté' }

    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', client.id)
        .select()
        .single()

      if (error) throw error

      setClient(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setClient(null)
    localStorage.removeItem('cabella-client')
  }

  return (
    <ClientAuthContext.Provider value={{
      client,
      isAuthenticated: !!client,
      loading,
      notifications,
      unreadCount,
      login,
      register,
      logout,
      updateProfile,
      fetchNotifications,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext)
  if (!context) {
    throw new Error('useClientAuth doit être utilisé dans un ClientAuthProvider')
  }
  return context
}
