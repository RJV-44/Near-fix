function StatCard({ label, value, trend, icon }) {
  return <article className="stat-card"><div className="stat-icon">{icon}</div><p>{label}</p><h2>{value}</h2>{trend && <small className="positive">? {trend}</small>}</article>
}
export default StatCard