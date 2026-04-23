import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'Citizen' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try   { await register(form.name, form.email, form.password, form.role); navigate('/') }
    catch  (err) { setError(err.response?.data?.message || 'Registration failed') }
    finally      { setLoading(false) }
  }

  return (
    <div className="auth-root">

      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-brand">
          <div className="auth-left-logo">♺</div>
          <div className="auth-left-name">Swachh<em>Setu</em></div>
        </div>

        <div className="auth-left-hero">
          <h1 className="auth-left-heading">
            Join the<br />
            <em>Green</em><br />
            Revolution.
          </h1>
          <p className="auth-left-desc">
            Become part of a growing community of citizens and
            authorities building a cleaner, smarter India together.
          </p>
        </div>

        <div className="auth-left-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">🎯</div>
            <div className="auth-feature-text">
              <strong>Set Your Goals</strong>
              <span>Track your waste reduction journey with real data</span>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🪙</div>
            <div className="auth-feature-text">
              <strong>Earn Rewards</strong>
              <span>Get Minecoins for every report and quiz completed</span>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🌍</div>
            <div className="auth-feature-text">
              <strong>Make an Impact</strong>
              <span>See your city's cleanliness score improve in real time</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-right-inner">
          <div className="auth-form-wrap">

            <h2 className="auth-form-title">Create account ✨</h2>
            <p className="auth-form-sub">Start your clean journey today — it's free</p>

            <form onSubmit={submit}>

              {/* Full Name */}
              <div className="auth-field">
                <div className="auth-field-header">
                  <label className="auth-field-label">Full Name</label>
                </div>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  placeholder="Archita Bhalotia"
                  value={form.name}
                  onChange={handle}
                  required
                />
              </div>

              {/* Email */}
              <div className="auth-field">
                <div className="auth-field-header">
                  <label className="auth-field-label">Email Address</label>
                </div>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handle}
                  required
                />
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-field-header">
                  <label className="auth-field-label">Password</label>
                </div>
                <div className="auth-input-wrap">
                  <input
                    className="auth-input"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handle}
                    required
                    minLength="6"
                    style={{ paddingRight: '2.8rem' }}
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPw(v => !v)}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div className="auth-field">
                <div className="auth-field-header">
                  <label className="auth-field-label">I am a...</label>
                </div>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn ${form.role === 'Citizen' ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, role: 'Citizen' }))}
                  >
                    <span>🌱</span>
                    <span>Citizen</span>
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${form.role === 'Authority' ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, role: 'Authority' }))}
                  >
                    <span>🏛</span>
                    <span>Authority</span>
                  </button>
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : '→  Get Started Free'}
              </button>

              <p className="auth-terms">
                By signing up you agree to our{' '}
                <Link to="#">Terms of Service</Link> and{' '}
                <Link to="#">Privacy Policy</Link>.
              </p>
            </form>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Or sign up with</span>
              <div className="auth-divider-line" />
            </div>

            <div className="auth-socials">
              <button className="auth-social-btn" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="auth-social-btn" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="auth-switch">
              Already have an account?<Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>

        <div className="auth-footer">
          <span>© 2025 SwachhSetu</span>
          <div className="auth-footer-links">
            <Link to="#">Privacy</Link>
            <Link to="#">Terms</Link>
            <Link to="#">Help</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
