import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import api from '../api'
import './ReportPage.css'

const STATUS_BADGE = { Submitted:'badge-gray','Under Review':'badge-yellow','Action Taken':'badge-green', Resolved:'badge-blue' }

export default function ReportPage() {
  const { user } = useAuth()
  const { toast, ToastContainer } = useToast()
  const fileRef = useRef()

  const [tab, setTab]       = useState('new')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({ category:'', description:'' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [geo, setGeo] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/reports').then(r => setReports(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const getGeo = () => {
    if (!navigator.geolocation) { toast('⚠️ Geolocation not supported'); return }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => { setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }); toast('📍 Location captured!') },
      () => toast('⚠️ Location access denied'),
      { enableHighAccuracy: true }
    )
    setGeoLoading(false)
  }

  const handlePhoto = e => {
    const f = e.target.files[0]
    if (!f) return
    setPhoto(f)
    const reader = new FileReader()
    reader.onload = ev => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.category || !form.description) { toast('⚠️ Please fill all required fields'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('category', form.category)
      fd.append('description', form.description)
      if (photo) fd.append('photo', photo)
      if (geo) { fd.append('lat', geo.lat); fd.append('lng', geo.lng) }
      await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast('✅ Report submitted! +20 Minecoins awarded')
      setForm({ category:'', description:'' }); setPhoto(null); setPhotoPreview(null); setGeo(null)
      const r = await api.get('/reports'); setReports(r.data)
      setTab('mine')
    } catch (err) {
      toast(err.response?.data?.message || '❌ Submission failed')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="report-wrap">
      <ToastContainer/>
      <h1 className="font-head mb-2" style={{fontSize:'1.3rem',fontWeight:800}}>📸 Report a Waste Issue</h1>

      <div className="flex gap-1 mb-2">
        <button className={`btn ${tab==='new'?'btn-primary':'btn-outline'} flex-1`} onClick={() => setTab('new')}>
          📋 Report an Issue
        </button>
        <button className={`btn ${tab==='mine'?'btn-primary':'btn-outline'} flex-1`} onClick={() => setTab('mine')}>
          📁 My Reports ({reports.length})
        </button>
      </div>

      {tab === 'new' && (
        <div className="grid-2" style={{gap:'1rem',alignItems:'start'}}>
          {/* Form */}
          <form onSubmit={submit} className="card">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" value={form.category}
                onChange={e => setForm(f=>({...f,category:e.target.value}))} required>
                <option value="">Select report category</option>
                {['Illegal Dumping','Overflowing Bin','Construction Debris','Hazardous Waste','Other'].map(c=>(
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Geo-tagged Location</label>
              <button type="button" className="btn btn-outline w-full" onClick={getGeo} disabled={geoLoading}>
                {geo ? `📍 ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : '📍 Capture My Location'}
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Photo</label>
              <div className="upload-zone" onClick={() => fileRef.current.click()}>
                {photoPreview
                  ? <img src={photoPreview} alt="preview" style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'6px'}}/>
                  : <><div style={{fontSize:'1.8rem'}}>📷</div><div style={{fontSize:'0.82rem',fontWeight:600}}>Tap to upload photo</div><div className="text-muted" style={{fontSize:'0.7rem'}}>JPG, PNG up to 5 MB</div></>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" rows={4}
                placeholder="Describe the location, type of waste, and any other relevant details..."
                value={form.description}
                onChange={e => setForm(f=>({...f,description:e.target.value}))} required/>
            </div>

            <div className="guideline-note">
              ✅ Your report may be shared with local ULB/GP monitoring systems.
            </div>

            <button className="btn btn-primary btn-full mt-2" type="submit" disabled={submitting} style={{padding:'0.7rem'}}>
              {submitting ? '📤 Submitting…' : '📤 Submit Report'}
            </button>
          </form>

          {/* Guidelines */}
          <div className="card">
            <div className="card-title">📋 Reporting Guidelines</div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
              {[
                ['📸','Provide a clear photo of the waste site'],
                ['📍','Enable location services for accurate geo-tagging'],
                ['📝','Describe the type and approximate amount of waste'],
                ['🚫','Do not approach or disturb the site'],
              ].map(([icon,text]) => (
                <div key={text} style={{display:'flex',gap:'0.6rem',fontSize:'0.8rem',color:'var(--muted)',alignItems:'flex-start'}}>
                  <span style={{flexShrink:0}}>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div className="divider"/>
            <div className="card-title">🏅 Rewards</div>
            <div style={{fontSize:'0.8rem',color:'var(--muted)',lineHeight:1.7}}>
              🪙 +20 Minecoins per report submitted<br/>
              ⭐ +50 bonus when action is taken<br/>
              🏆 Top reporters featured on leaderboard
            </div>
          </div>
        </div>
      )}

      {tab === 'mine' && (
        <div className="card">
          {loading && <div className="spinner"/>}
          {!loading && reports.length === 0 && (
            <div className="text-muted" style={{textAlign:'center',padding:'1.5rem'}}>
              No reports yet. <span className="text-green" style={{cursor:'pointer'}} onClick={() => setTab('new')}>File your first report →</span>
            </div>
          )}
          {reports.map((r, i) => (
            <div key={r._id} className="report-item" style={{borderBottom: i<reports.length-1?'1px solid var(--border)':'none'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem',flexWrap:'wrap'}}>
                  <span style={{fontSize:'0.7rem',color:'var(--muted)',fontWeight:600}}>#{r._id.slice(-6).toUpperCase()}</span>
                  <span className={`badge ${STATUS_BADGE[r.status]||'badge-gray'}`}>{r.status}</span>
                </div>
                <div style={{fontWeight:600,fontSize:'0.85rem',margin:'0.2rem 0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.category}</div>
                <div className="text-muted" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description}</div>
                <div className="text-muted" style={{fontSize:'0.68rem',marginTop:'0.2rem'}}>
                  {new Date(r.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                  {r.location?.lat && ` • 📍 ${r.location.lat.toFixed(3)}, ${r.location.lng.toFixed(3)}`}
                </div>
              </div>
              {r.photo && (
                <img src={`/uploads/${r.photo}`} alt="" style={{width:52,height:52,borderRadius:8,objectFit:'cover',flexShrink:0}}/>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
