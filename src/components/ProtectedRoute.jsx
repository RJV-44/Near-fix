import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    window.location.hash = '#login'
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    window.location.hash = '#home'
    return null
  }

  return children
}

export default ProtectedRoute