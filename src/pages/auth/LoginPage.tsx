import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Eye,
  EyeOff,
  Sparkles,
  Users,
} from 'lucide-react'
import type { Language, Theme } from '../../contexts/I18nContext'
import { useAuth } from '../../contexts/AuthContext'
import { Brand } from '../../components/layout/Brand'
import { LanguageSwitch } from '../../components/layout/LanguageSwitch'

export function LoginPage({
  language,
  onLanguageChange,
  theme,
}: {
  language: Language
  onLanguageChange: (language: Language) => void
  theme: Theme
}) {
  const navigate = useNavigate()
  const { login, isAuthenticated, role } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Redirect after successful login based on role
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'Employee') {
        navigate('/employee/dashboard', { replace: true })
      } else {
        // HR roles (HR Administrator, HR, Manager, etc.)
        navigate('/app/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, role, navigate])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Navigation happens via useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* LEFT VISUAL */}
      <div className="login-visual">
        <div className="login-visual-top">
          <Brand theme={theme} />
          <LanguageSwitch language={language} onChange={onLanguageChange} />
        </div>

        <div className="login-message">
          <span className="hero-kicker">
            <Sparkles size={14} />
            Intillegence AGENCY
          </span>
          <h1>
            People operations,
            <br />
            <em>with a pulse.</em>
          </h1>
          <p>Give every employee a clearer path through your organization.</p>
        </div>

        <div className="login-orbit">
          <div className="orbit-center">
            I<span>HR</span>
          </div>
          <div className="orbit-node node-one">
            <Users size={17} />
            People
          </div>
          <div className="orbit-node node-two">
            <ClipboardCheck size={17} />
            Onboarding
          </div>
          <div className="orbit-node node-three">
            <CalendarDays size={17} />
            Leave
          </div>
        </div>

        <small className="login-footnote">IntillegenceHR · PEOPLE OPERATIONS PLATFORM</small>
      </div>

      {/* RIGHT FORM */}
      <div className="login-form-side">
        <button className="back-link" onClick={() => navigate('/')}>
          <ArrowRight size={16} className="back-arrow" />
          Back to IntillegenceHR
        </button>

        <div className="login-form-wrap">
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your workspace.</h2>
          <p>Use your IntillegenceHR account to continue.</p>

          <form onSubmit={submit}>
            <label>
              Email address
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>

            <label>
              Password
              <div className="password-input">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <div className="form-options">
              <label className="check-label">
                <input type="checkbox" disabled={loading} />
                Remember me
              </label>
              <button type="button" className="link-button" disabled={loading}>
                Forgot password?
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="button primary submit-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <small className="security-message">🔒 Your credentials are encrypted and secure.</small>

          <div className="demo-credentials">
            <small>
              <strong>Demo Credentials:</strong>
              <br />
              HR: hr@example.com / password123
              <br />
              Employee: emp@example.com / password123
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

