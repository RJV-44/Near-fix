import DashboardSidebar from './DashboardSidebar.jsx'
import DashboardHeader from './DashboardHeader.jsx'
import DashboardFooter from './DashboardFooter.jsx'

function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-content">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main className="dashboard-main">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  )
}

export default AdminLayout