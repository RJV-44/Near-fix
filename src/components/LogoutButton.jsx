import { useAuth } from '../context/AuthContext'

function LogoutButton({ className = 'text-button logout-button' }) {
  const { logout } = useAuth()
  return (
    <button className={className} onClick={logout} title="Log out">
      ? Log out
    </button>
  )
}

export default LogoutButton