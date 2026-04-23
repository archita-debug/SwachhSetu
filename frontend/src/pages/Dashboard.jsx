import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import './Dashboard.css'

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/reports'), refreshUser()])
      .then(([r]) => setReports(r.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusBadge = s => {
    const m = { Submitted:'badge-gray', 'Under Review':'badge-yellow', 'Action Taken':'badge-green', Resolved:'badge-blue' }
    return m[s] || 'badge-gray'
  }

  const progress = user?.trainingProgress ?? 0
  const waste = user?.wasteData || { today: 0, thisWeek: 0, thisMonth: 0 }

  return (
    <div className="dashboard">
      {/* HERO */}
      <div className="hero-card card mb-2">
        <div className="hero-top">
          <div>
            <div className="text-muted" style={{fontSize:'0.78rem'}}>Good morning,</div>
            <h1 className="font-head" style={{fontSize:'1.5rem',fontWeight:800,margin:'0.15rem 0'}}>{user?.name} 👋</h1>
            <div className="hero-status">
              <span className="status-dot"/>
              {user?.isCompliant ? 'Compliant • Green Citizen' : 'Non-Compliant – complete training'}
            </div>
          </div>
          <div className="hero-coins">
            <div className="coin-big">🪙</div>
            <div className="font-head" style={{fontSize:'1.4rem',fontWeight:800,color:'var(--yellow)'}}>{user?.coins ?? 0}</div>
            <div style={{fontSize:'0.68rem',color:'var(--muted)'}}>Minecoins</div>
          </div>
        </div>

        {/* Waste Stats */}
        <div className="waste-row">
          {[
            { label:'Today', val:`${waste.today} kg`, color:'var(--g-primary)' },
            { label:'This Week', val:`${waste.thisWeek} kg`, color:'var(--g-accent)' },
            { label:'This Month', val:`${waste.thisMonth} kg`, color:'var(--yellow)' },
            { label:'Points', val: user?.points ?? 0, color:'var(--blue)' },
          ].map(s => (
            <div key={s.label} className="waste-item">
              <div className="font-head" style={{fontSize:'1.1rem',fontWeight:800,color:s.color}}>{s.val}</div>
              <div style={{fontSize:'0.68rem',color:'var(--muted)'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-full mt-2" style={{padding:'0.7rem'}}
          onClick={() => navigate('/report')}>
          📸 Report a Waste Issue
        </button>
      </div>

      {/* TRAINING ALERT */}
      {progress < 100 && (
        <div className="training-alert mb-2" onClick={() => navigate('/training')}>
          <span style={{fontSize:'1.1rem'}}>⚠️</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:'0.83rem',color:'var(--yellow)'}}>Mandatory Training Pending</div>
            <div style={{fontSize:'0.7rem',color:'var(--muted)'}}>Complete to avoid penalization</div>
            <div className="prog-wrap mt-1" style={{height:'4px'}}>
              <div className="prog-fill" style={{width:`${progress}%`,background:'var(--yellow)'}}/>
            </div>
          </div>
          <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--yellow)'}}>{progress}%</div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <h2 className="font-head mb-1" style={{fontSize:'0.95rem'}}>Quick Actions</h2>
      <div className="qa-grid mb-2">
        {[
          { icon:'🛒', title:'Marketplace', sub:'Buy eco-products', to:'/market' },
          { icon:'🚛', title:'Track Truck', sub:'Live vehicle status', to:'/tracking' },
          { icon:'🎮', title:'Eco Quiz', sub:'Earn Minecoins', to:'/training' },
          { icon:'🏆', title:'Leaderboard', sub:'See rankings', to:'/leaderboard' },
        ].map(q => (
          <div key={q.title} className="qa-card" onClick={() => navigate(q.to)}>
            <div style={{fontSize:'1.4rem',marginBottom:'0.3rem'}}>{q.icon}</div>
            <div style={{fontWeight:600,fontSize:'0.82rem'}}>{q.title}</div>
            <div style={{fontSize:'0.68rem',color:'var(--muted)'}}>{q.sub}</div>
          </div>
        ))}
      </div>

      {/* RECENT REPORTS */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-head" style={{fontSize:'0.95rem'}}>Recent Reports</h2>
        <span className="text-green" style={{fontSize:'0.78rem',cursor:'pointer',fontWeight:600}}
          onClick={() => navigate('/report')}>See all →</span>
      </div>
      <div className="card">
        {loading && <div className="spinner" style={{margin:'1rem auto'}}/>}
        {!loading && reports.length === 0 && (
          <div className="text-muted" style={{textAlign:'center',padding:'1rem'}}>
            No reports yet. <span className="text-green" style={{cursor:'pointer'}} onClick={() => navigate('/report')}>File one now →</span>
          </div>
        )}
        {reports.map((r, i) => (
          <div key={r._id} style={{
            display:'flex', alignItems:'flex-start', gap:'0.75rem',
            padding:'0.7rem 0',
            borderBottom: i < reports.length-1 ? '1px solid var(--border)' : 'none'
          }}>
            <div style={{
              width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:5,
              background: r.status==='Resolved'?'var(--g-primary)':r.status==='Action Taken'?'var(--blue)':r.status==='Under Review'?'var(--yellow)':'var(--muted)'
            }}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:'0.83rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.category}</div>
              <div className="text-muted" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description}</div>
            </div>
            <span className={`badge ${statusBadge(r.status)}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
