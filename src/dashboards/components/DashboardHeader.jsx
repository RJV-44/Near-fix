import LogoutButton from '../../components/LogoutButton.jsx'
import { useAuth } from '../../context/AuthContext'

function DashboardHeader({ title, subtitle }) {
  const { user } = useAuth()
  return <header className="dashboard-header"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="dashboard-header-actions"><span className="header-user">? {user?.name || 'Admin'}</span><LogoutButton /></div></header>
}
export default DashboardHeader