function StatCard({ label, value, trend, icon, color }) {
  const iconBg = color || 'var(--brand-bg)'
  return (
    <article className="stat-card">
      <div className="stat-icon" style={{ background: iconBg }}>{icon}</div>
      <p>{label}</p>
      <h2>{value}</h2>
      {trend && <small style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.8rem' }}>↑ {trend}</small>}
    </article>
  )
}
export default StatCard