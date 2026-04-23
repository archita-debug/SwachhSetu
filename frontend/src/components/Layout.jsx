import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const NAV = [
  { to:'/',             icon:'📊', label:'Dashboard' },
  { to:'/tracking',    icon:'🚛', label:'Collection Tracker', badge:'LIVE' },
  { to:'/training',    icon:'🎮', label:'Training Center' },
  { to:'/report',      icon:'📸', label:'Report Issue' },
  { to:'/market',      icon:'🛒', label:'Marketplace' },
  { to:'/leaderboard', icon:'🏆', label:'Leaderboard' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  const initials   = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'U'
  const handleLogout = () => { logout(); navigate('/login') }
  const currentPage  = NAV.find(n => n.to === location.pathname)?.label || 'Dashboard'

  return (
    <div className="layout-root">

      {/* OVERLAY */}
      {sideOpen && <div className="sidebar-overlay" onClick={() => setSideOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sideOpen ? 'open' : ''}`}>

        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-brand-icon">♺</div>
          <div className="sb-brand-text">Swachh<em>Setu</em></div>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          <div className="sb-section-label">Main Menu</div>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => `sb-item ${isActive ? 'active' : ''}`}
              onClick={() => setSideOpen(false)}
            >
              <span className="sb-icon">{n.icon}</span>
              {n.label}
              {n.badge && <span className="sb-badge">{n.badge}</span>}
            </NavLink>
          ))}

          <div className="sb-section-label" style={{ marginTop: '0.8rem' }}>Account</div>
          <div className="sb-item" onClick={() => alert('Settings coming soon!')}>
            <span className="sb-icon">⚙️</span> Settings
          </div>
          <div className="sb-item" onClick={() => alert('Support coming soon!')}>
            <span className="sb-icon">🎧</span> Support
          </div>
        </nav>

        {/* User footer */}
        <div className="sb-user">
          <div className="sb-av">{initials}</div>
          <div className="sb-user-info">
            <div className="sb-user-name">{user?.name}</div>
            <div className="sb-user-role">{user?.role === 'authority' ? '🏛 Authority' : '🌱 Citizen'}</div>
          </div>
          <button className="sb-logout-btn" title="Log out" onClick={handleLogout}>⏻</button>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <div className="content-area">

        {/* Topbar */}
        <header className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <button className="hamburger" onClick={() => setSideOpen(o => !o)}>☰</button>
            <span className="topbar-page-title">{currentPage}</span>
          </div>

          <div className="topbar-right">
            <div className="coin-pill">
              🪙 <span>{user?.coins ?? 0} coins</span>
            </div>
            <div className="topbar-avatar hide-mobile" title={user?.name}>{initials}</div>
          </div>
        </header>

        {/* Page */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="bottom-nav">
        {NAV.slice(0,5).map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}
            className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}>
            <span>{n.icon}</span>
            <span>{n.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
