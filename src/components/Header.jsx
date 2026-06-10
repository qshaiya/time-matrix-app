import { useState } from "react";
import { LANGUAGES } from "../i18n";
import "./Header.css";

export default function Header({ stats, onClearCompleted, view, onViewChange, user, onSignOut, lang, onLangChange, tr }) {
  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const [showLang, setShowLang] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo"><span className="logo-icon">◈</span><span className="logo-text">Matrix</span></div>
        <p className="logo-sub">{tr('appSub')}</p>
      </div>
      <div className="header-center">
        <div className="progress-wrap">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          <span className="progress-label">{tr('tasksCompleted', stats.completed, stats.total)}</span>
        </div>
      </div>
      <div className="header-right">
        <div className="lang-switcher">
          <button className="lang-btn" onClick={() => setShowLang(!showLang)}>
            {currentLang?.flag} <span className="lang-code">{currentLang?.code.toUpperCase()}</span> ▾
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
        <div className="view-toggle">
          <button className={`view-btn ${view === "matrix" ? "active" : ""}`} onClick={() => onViewChange("matrix")}>⊞ {tr('matrix')}</button>
          <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => onViewChange("list")}>☰ {tr('list')}</button>
        </div>
        {stats.completed > 0 && <button className="clear-btn" onClick={onClearCompleted}>{tr('clearCompleted')}</button>}
        {user && (
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="signout-btn" onClick={onSignOut}>{tr('signOut')}</button>
          </div>
        )}
      </div>
    </header>
  );
}
