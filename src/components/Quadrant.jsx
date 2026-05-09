import TaskCard from "./TaskCard";
import "./Quadrant.css";

export default function Quadrant({
  quadrant, tasks, onAdd, onEdit, onDelete, onToggle,
  isDragOver, onDragStart, onDragEnd, onDragOver, onDrop,
}) {
  const { id, label, title, subtitle, colorVar, icon } = quadrant;
  const color = `var(${colorVar})`;
  const bg = `var(${colorVar}-bg)`;
  const border = `var(${colorVar}-border)`;

  const handleDragOver = (e) => { e.preventDefault(); onDragOver(); };
  const handleDrop = (e) => { e.preventDefault(); onDrop(); };

  return (
    <div
      className={`quadrant quadrant-${id} ${isDragOver ? "drag-over" : ""}`}
      style={{ "--color": color, "--bg": bg, "--bdr": border }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="q-header">
        <div className="q-header-left">
          <span className="q-icon">{icon}</span>
          <div>
            <div className="q-label">{label}</div>
            <div className="q-title">{title}</div>
            <div className="q-sub">{subtitle}</div>
          </div>
        </div>

      </div>

      {/* Tasks */}
      <div className="q-tasks">
        {tasks.length === 0 && (
          <div className="q-empty">
            <span>Drop tasks here</span>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            color={color}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            onToggle={() => onToggle(task.id)}
            onDragStart={() => onDragStart(task)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>

      {/* Add button */}
      <button className="q-add" onClick={onAdd}>
        <span>+</span> Add task
      </button>
    </div>
  );
}
