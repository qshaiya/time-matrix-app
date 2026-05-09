import "./TaskCard.css";

const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };

export default function TaskCard({ task, color, onEdit, onDelete, onToggle, onDragStart, onDragEnd }) {
  return (
    <div
      className={`task-card ${task.completed ? "completed" : ""}`}
      style={{ "--color": color }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="task-main">
        <button
          className="task-check"
          onClick={onToggle}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed ? "✓" : ""}
        </button>
        <div className="task-body" onClick={onEdit}>
          <div className="task-title">{task.title}</div>
          {task.note && <div className="task-note">{task.note}</div>}
          <div className="task-meta">
            {task.dueDate && (
              <span className="task-due">
                📅 {new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            {task.priority && (
              <span className={`task-priority priority-${task.priority}`}>
                {PRIORITY_LABELS[task.priority]}
              </span>
            )}
          </div>
        </div>
        <button className="task-delete" onClick={onDelete} aria-label="Delete task">×</button>
      </div>
    </div>
  );
}
