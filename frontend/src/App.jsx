import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout    from './components/Layout'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tracking  from './pages/Tracking'
import Training  from './pages/Training'
import ReportPage from './pages/ReportPage'
import Marketplace from './pages/Marketplace'
import Leaderboard from './pages/Leaderboard'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div className="spinner"/></div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route index            element={<Dashboard />} />
          <Route path="tracking"  element={<Tracking />} />
          <Route path="training"  element={<Training />} />
          <Route path="report"    element={<ReportPage />} />
          <Route path="market"    element={<Marketplace />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
