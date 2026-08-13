import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api.js'

const AuthContext = createContext(null)

const normalizeRole = (role) => {
  const value = String(role || '').toLowerCase()
  if (value === 'admin' || value === 'provider' || value === 'customer') return value
  return 'customer'
}

const getDashboardHash = (role) => {
  switch (normalizeRole(role)) {
    case 'admin':
      return '#admin-dashboard'
    case 'provider':
      return '#provider-dashboard'
    default:
      return '#customer-dashboard'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user')
    if (!stored) return null

    try {
      const parsed = JSON.parse(stored)
      return { ...parsed, role: normalizeRole(parsed?.role) }
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  // On mount, verify token is still valid
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token && !user) {
      authAPI.getMe()
        .then(data => {
          const normalizedUser = { ...data, role: normalizeRole(data?.role) }
          setUser(normalizedUser)
          localStorage.setItem('auth_user', JSON.stringify(normalizedUser))
        })
        .catch(() => {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (userData) => {
    const normalizedUser = { ...userData, role: normalizeRole(userData?.role) }
    setUser(normalizedUser)
    localStorage.setItem('auth_user', JSON.stringify(normalizedUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    window.location.hash = '#home'
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'
  const isCustomer = user?.role === 'customer'
  const isProvider = user?.role === 'provider'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isCustomer, isProvider, loading, getDashboardHash }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export default AuthContext