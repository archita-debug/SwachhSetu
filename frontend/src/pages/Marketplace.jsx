import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import api from '../api'
import './Marketplace.css'

const CATS = ['All','dustbins','compost','upcycled','tools']

export default function Marketplace() {
  const { user, refreshUser } = useAuth()
  const { toast, ToastContainer } = useToast()

  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [search, setSearch]     = useState('')
  const [redeeming, setRedeeming] = useState(null)

  useEffect(() => {
    api.get('/market/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const redeem = async (product) => {
    if (redeeming) return
    setRedeeming(product.id)
    try {
      const { data } = await api.post('/market/redeem', { productId: product.id })
      toast(`✅ Redeemed: ${product.name}! Coins left: ${data.coinsLeft}`)
      await refreshUser()
    } catch (err) {
      toast(err.response?.data?.message || '❌ Redemption failed')
    } finally { setRedeeming(null) }
  }

  const visible = products.filter(p =>
    (filter === 'All' || p.cat === filter) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="market-wrap">
      <ToastContainer/>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-head" style={{fontSize:'1.3rem',fontWeight:800}}>♻️ Waste Utilities</h1>
        <div className="coin-display">🪙 {user?.coins ?? 0} Minecoins</div>
      </div>

      {/* Search */}
      <div className="search-bar mb-1">
        <span style={{fontSize:'1rem',color:'var(--muted)'}}>🔍</span>
        <input placeholder="Search compost kits, dustbins…" value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* Filter chips */}
      <div className="filter-chips mb-2">
        {CATS.map(c => (
          <button key={c} className={`chip ${filter===c?'active':''}`} onClick={() => setFilter(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="spinner"/>}

      <div className="product-grid">
        {visible.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-img">
              <span style={{fontSize:'2.5rem'}}>{p.emoji}</span>
              {p.tag && <span className="product-tag badge badge-green">{p.tag}</span>}
            </div>
            <div className="product-body">
              <div className="product-name">{p.name}</div>
              <div style={{color:'var(--yellow)',fontFamily:'var(--font-head)',fontWeight:700,fontSize:'0.95rem',margin:'0.25rem 0'}}>
                ₹{p.price.toLocaleString()}
              </div>
              <div style={{fontSize:'0.7rem',color:'var(--g-primary)',marginBottom:'0.5rem'}}>or {p.coins} Minecoins</div>
              <button
                className="btn btn-primary btn-full"
                disabled={redeeming === p.id || (user?.coins ?? 0) < p.coins}
                onClick={() => redeem(p)}
                style={{fontSize:'0.78rem',padding:'0.45rem'}}
              >
                {redeeming === p.id ? '…' : (user?.coins ?? 0) >= p.coins ? '🎁 Redeem' : '🔒 Need more coins'}
              </button>
            </div>
          </div>
        ))}
        {!loading && visible.length === 0 && (
          <div className="text-muted" style={{gridColumn:'1/-1',textAlign:'center',padding:'2rem'}}>
            No products found.
          </div>
        )}
      </div>
    </div>
  )
}
