import { useEffect, useState } from 'react'
import api from '../api'
import './Tracking.css'

export default function Tracking() {
  const [trucks, setTrucks]         = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading]       = useState(true)
  const [tab, setTab]               = useState('live')

  useEffect(() => {
    Promise.all([api.get('/tracking/trucks'), api.get('/tracking/facilities')])
      .then(([t, f]) => { setTrucks(t.data); setFacilities(f.data) })
      .catch(() => {})
      .finally(() => setLoading(false))

    // Poll trucks every 15 seconds
    const id = setInterval(() =>
      api.get('/tracking/trucks').then(r => setTrucks(r.data)).catch(() => {}), 15000)
    return () => clearInterval(id)
  }, [])

  if (loading) return <div className="spinner mt-3"/>

  const topTruck = trucks[0]

  return (
    <div className="tracking-wrap">
      <h1 className="font-head mb-2" style={{fontSize:'1.3rem',fontWeight:800}}>🚛 Live Tracking</h1>

      {/* ETA Hero */}
      {topTruck && (
        <div className="eta-hero card mb-2">
          <div className="text-muted" style={{fontSize:'0.75rem',marginBottom:'0.2rem'}}>Next pickup in</div>
          <div className="eta-time">{topTruck.eta}</div>
          <div className="text-muted" style={{fontSize:'0.75rem'}}>📍 {topTruck.route}</div>
          {/* Map Mock */}
          <div className="map-mock">
            <div className="map-grid-bg"/>
            <div className="map-road-h"/>
            <div className="map-road-v" style={{left:'30%'}}/>
            <div className="map-road-v" style={{left:'70%'}}/>
            <div className="map-truck-anim">🚛</div>
            <div className="map-pin" style={{right:'15%',top:'35%'}}>📍</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tracking-tabs mb-2">
        {['live','data','facilities'].map(t => (
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t === 'live' ? 'Live' : t === 'data' ? 'My Data' : 'Facilities'}
          </button>
        ))}
      </div>

      {tab === 'live' && (
        <div className="card">
          <div className="card-title">Active Trucks</div>
          {trucks.map(tr => (
            <div key={tr.id} className="truck-row">
              <div style={{fontSize:'1.2rem'}}>🚛</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:'0.83rem',fontWeight:600}}>{tr.name}</div>
                <div className="text-muted">{tr.route}</div>
                <div className="prog-wrap mt-1" style={{height:'4px'}}>
                  <div className="prog-fill" style={{width:`${tr.progress}%`,background:'var(--g-primary)'}}/>
                </div>
              </div>
              <div>
                <div className="text-green" style={{fontWeight:700,fontSize:'0.83rem',textAlign:'right'}}>{tr.eta}</div>
                <span className="badge badge-green" style={{fontSize:'0.6rem'}}>{tr.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'data' && (
        <div>
          <div className="grid-3 mb-2">
            {[{l:'Today',v:'2.5 kg',c:'var(--g-primary)'},{l:'This Week',v:'15.2 kg',c:'var(--g-accent)'},{l:'This Month',v:'58.1 kg',c:'var(--yellow)'}].map(d=>(
              <div key={d.l} className="card" style={{textAlign:'center'}}>
                <div className="font-head" style={{fontSize:'1.4rem',fontWeight:800,color:d.c}}>{d.v}</div>
                <div className="text-muted">{d.l}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">Segregation Breakdown</div>
            {[{l:'Wet/Organic',pct:45,c:'var(--g-primary)'},{l:'Dry/Recyclable',pct:35,c:'var(--blue)'},{l:'Hazardous',pct:5,c:'var(--red)'},{l:'Non-recyclable',pct:15,c:'var(--muted)'}].map(b=>(
              <div key={b.l} style={{marginBottom:'0.75rem'}}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{fontSize:'0.8rem'}}>{b.l}</span>
                  <span style={{fontSize:'0.78rem',color:b.c,fontWeight:600}}>{b.pct}%</span>
                </div>
                <div className="prog-wrap" style={{height:'6px'}}>
                  <div className="prog-fill" style={{width:`${b.pct}%`,background:b.c}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'facilities' && (
        <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
          {facilities.map(f => (
            <div key={f.id} className="facility-card card">
              <div style={{fontSize:'1.3rem'}}>{f.type==='recycling'?'♻️':f.type==='scrap'?'🔧':'🌿'}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:'0.85rem'}}>{f.name}</div>
                <div className="text-muted">{f.hours}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="text-muted" style={{fontSize:'0.75rem'}}>{f.dist}</div>
                <span className={`badge ${f.open?'badge-green':'badge-red'}`}>{f.open?'Open':'Closed'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
