import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  // On mount, verify token is still valid
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token && !user) {
      authAPI.getMe()
        .then(data => {
          setUser(data)
          localStorage.setItem('auth_user', JSON.stringify(data))
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
    setUser(userData)
    localStorage.setItem('auth_user', JSON.stringify(userData))
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isCustomer, isProvider, loading }}>
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