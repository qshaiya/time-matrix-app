import { useState } from 'react'
import { supabase } from '../supabase'
import { LANGUAGES } from '../i18n'
import './AuthPage.css'

export default function AuthPage({ lang, onLangChange, tr }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [showLang, setShowLang] = useState(false)
  const currentLang = LANGUAGES.find(l => l.code === lang)

  const handleLogin = async () => {
    if (!email.trim()) return
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    })
    setLoading(false)
    if (error) { setError(error.message) } else { setSent(true) }
  }

  return (
    <div className="auth-page">
      <div className="auth-lang">
        <button className="lang-btn" onClick={() => setShowLang(!showLang)}>
          {currentLang?.flag} {currentLang?.code.toUpperCase()} ▾
        </button>
        {showLang && (
          <div className="lang-dropdown">
            {LANGUAGES.map(l => (
              <button key={l.code} className={`lang-option ${l.code === lang ? 'active' : ''}`}
                onClick={() => { onLangChange(l.code); setShowLang(false) }}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">◈</span>
          <span className="auth-logo-text">Matrix</span>
        </div>
        <p className="auth-subtitle">{tr('appSub')}</p>
        {sent ? (
          <div className="auth-sent">
            <div className="auth-sent-icon">📬</div>
            <h2>{tr('checkEmail')}</h2>
            <p>{tr('magicSent', email)}</p>
            <p className="auth-sent-sub">{tr('magicSub')}</p>
          </div>
        ) : (
          <>
            <h2 className="auth-title">{tr('signInTitle')}</h2>
            <p className="auth-desc">{tr('signInDesc')}</p>
            <div className="auth-form">
              <input type="email" placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()} autoFocus />
              <button className="auth-btn" onClick={handleLogin} disabled={loading || !email.trim()}>
                {loading ? tr('sending') : tr('sendMagicLink')}
              </button>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-note">{tr('syncNote')}</p>
          </>
        )}
      </div>
    </div>
  )
}
