import "./Header.css";

export default function Header({ stats, onClearCompleted, view, onViewChange }) {
  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Matrix</span>
        </div>
        <p className="logo-sub">Eisenhower Time Management</p>
      </div>

      <div className="header-center">
        <div className="progress-wrap">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-label">
            {stats.completed}/{stats.total} tasks completed
          </span>
        </div>
      </div>

      <div className="header-right">
        <div className="view-toggle">
          <button
            className={`view-btn ${view === "matrix" ? "active" : ""}`}
            onClick={() => onViewChange("matrix")}
            title="Matrix view"
          >
            ⊞ Matrix
          </button>
          <button
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => onViewChange("list")}
            title="List view"
          >
            ☰ List
          </button>
        </div>
        {stats.completed > 0 && (
          <button className="clear-btn" onClick={onClearCompleted}>
            Clear completed
          </button>
        )}
      </div>
    </header>
  );
}
