import TaskCard from "./TaskCard";
import "./Quadrant.css";

export default function Quadrant({ quadrant, quadrants, tasks, onAdd, onEdit, onDelete, onToggle, onMove, isDragOver, onDragStart, onDragEnd, onDragOver, onDrop, tr }) {
  const { id, label, title, subtitle, colorVar, icon } = quadrant;
  const color = `var(${colorVar})`;
  return (
    <div className={`quadrant quadrant-${id} ${isDragOver ? "drag-over" : ""}`}
      style={{ "--color": color, "--bg": `var(${colorVar}-bg)`, "--bdr": `var(${colorVar}-border)` }}
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDrop={(e) => { e.preventDefault(); onDrop(); }}>
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
      <div className="q-tasks">
        {tasks.length === 0 && <div className="q-empty"><span>{tr('dropHere')}</span></div>}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} color={color}
            onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)}
            onToggle={() => onToggle(task.id)}
            onDragStart={() => onDragStart(task)} onDragEnd={onDragEnd}
            onMove={onMove} quadrants={quadrants} tr={tr} />
        ))}
      </div>
      <button className="q-add" onClick={onAdd}><span>+</span> {tr('addTask')}</button>
    </div>
  );
}
