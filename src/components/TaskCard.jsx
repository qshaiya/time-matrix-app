import { useState } from "react";
import "./TaskCard.css";

const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };
const QUADRANT_ICONS = { q1: "⚡", q2: "🎯", q3: "📤", q4: "🗑️" };

function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate < today;
}

export default function TaskCard({ task, color, onEdit, onDelete, onToggle, onDragStart, onDragEnd, onMove, quadrants, tr }) {
  const [showMove, setShowMove] = useState(false);
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
  const overdue = isOverdue(task);

  return (
    <div className={`task-card ${task.completed ? "completed" : ""} ${overdue ? "overdue" : ""}`}
      style={{ "--color": color }}
      draggable={!isMobile()} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="task-main">
        <button className="task-check" onClick={onToggle}>
          {task.completed ? "✓" : ""}
        </button>
        <div className="task-body" onClick={onEdit}>
          <div className="task-title">{task.title}</div>
          {task.note && <div className="task-note">{task.note}</div>}
          <div className="task-meta">
            {task.dueDate && (
              <span className={`task-due ${overdue ? "task-due-overdue" : ""}`}>
                {overdue ? "⚠️ " : "📅 "}
                {new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {overdue ? ` · ${tr ? tr('overdue') : 'Overdue'}` : ""}
              </span>
            )}
            {task.priority && <span className={`task-priority priority-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>}
          </div>
        </div>
        <div className="task-actions">
          {onMove && <button className="task-move-btn" onClick={(e) => { e.stopPropagation(); setShowMove(!showMove); }}>⇄</button>}
          <button className="task-delete" onClick={onDelete}>×</button>
        </div>
      </div>
      {showMove && quadrants && (
        <div className="task-move-menu">
          {quadrants.filter(q => q.id !== task.quadrantId).map(q => (
            <button key={q.id} className="task-move-option"
              style={{ "--q-color": `var(${q.colorVar})` }}
              onClick={(e) => { e.stopPropagation(); onMove(task.id, q.id); setShowMove(false); }}>
              {QUADRANT_ICONS[q.id]} {q.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
