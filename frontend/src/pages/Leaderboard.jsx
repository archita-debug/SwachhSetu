import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tracking/leaderboard').then(r => setLeaders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const initials = name => name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || '?'

  const top3 = leaders.slice(0,3)
  const rest  = leaders.slice(3)

  const MEDAL = ['🥇','🥈','🥉']
  const COLORS = ['#ffd700','#c0c0c0','#cd7f32']
  const HEIGHTS = ['80px','60px','45px']

  return (
    <div style={{maxWidth:640}}>
      <h1 className="font-head mb-2" style={{fontSize:'1.3rem',fontWeight:800}}>🏆 Leaderboard</h1>

      {loading && <div className="spinner"/>}

      {!loading && leaders.length === 0 && (
        <div className="card text-muted" style={{textAlign:'center',padding:'2rem'}}>
          No data yet. Complete quizzes and reports to earn points!
        </div>
      )}

      {!loading && leaders.length > 0 && (
        <>
          {/* Podium */}
          <div className="card mb-2">
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:'1rem',padding:'0.5rem 0 0'}}>
              {[top3[1], top3[0], top3[2]].filter(Boolean).map((u, visIdx) => {
                const realIdx = visIdx === 0 ? 1 : visIdx === 1 ? 0 : 2
                const isMe = user?._id === u._id
                return (
                  <div key={u._id} style={{textAlign:'center',flex:1,maxWidth:120}}>
                    <div style={{fontSize:'1.3rem'}}>{MEDAL[realIdx]}</div>
                    <div style={{
                      width:46,height:46,borderRadius:'50%',margin:'0.4rem auto',
                      background: isMe ? 'var(--g-primary)' : `${COLORS[realIdx]}22`,
                      border:`3px solid ${COLORS[realIdx]}`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontWeight:700,fontSize:'0.85rem',color: isMe?'#000':'var(--text)',
                      animation: realIdx===0 ? 'pulse-ring 2.5s infinite' : 'none'
                    }}>{initials(u.name)}</div>
                    <div style={{fontSize:'0.75rem',fontWeight:600}}>{u.name}{isMe?' (You)':''}</div>
                    <div style={{fontSize:'0.68rem',color:'var(--muted)'}}>{u.points} pts</div>
                    <div style={{
                      height:HEIGHTS[realIdx],marginTop:'0.35rem',
                      background:`${COLORS[realIdx]}22`,borderRadius:'6px 6px 0 0',
                    }}/>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rankings list */}
          {rest.length > 0 && (
            <div className="card">
              {rest.map((u, i) => {
                const isMe = user?._id === u._id
                return (
                  <div key={u._id} style={{
                    display:'flex',alignItems:'center',gap:'0.75rem',
                    padding:'0.65rem',borderRadius:'var(--radius-sm)',
                    background: isMe ? 'rgba(29,185,84,0.07)' : 'transparent',
                    border: isMe ? '1px solid rgba(29,185,84,0.2)' : '1px solid transparent',
                    marginBottom:'0.3rem',transition:'background 0.15s',
                  }}>
                    <div style={{
                      width:24,fontFamily:'var(--font-head)',fontWeight:700,
                      fontSize:'0.85rem',color:'var(--muted)',flexShrink:0,textAlign:'center'
                    }}>{i+4}</div>
                    <div style={{
                      width:34,height:34,borderRadius:'50%',flexShrink:0,
                      background: isMe ? 'var(--g-primary)' : 'var(--card2)',
                      border:'1px solid var(--border)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontWeight:700,fontSize:'0.78rem',color: isMe?'#000':'var(--text)'
                    }}>{initials(u.name)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'0.83rem',fontWeight:600}}>{u.name}{isMe?' (You)':''}</div>
                    </div>
                    <div style={{fontFamily:'var(--font-head)',fontWeight:700,color:'var(--yellow)',fontSize:'0.88rem'}}>
                      {u.points} pts
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
