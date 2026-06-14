import { useState } from "react";
import Quadrant from "./Quadrant";
import { isOverdue } from "../utils";
import "./Matrix.css";

export default function Matrix({ quadrants, tasks, onAdd, onEdit, onDelete, onToggle, onMove, onGoToList, tr }) {
  const [dragOverId, setDragOverId] = useState(null);
  const [draggingTask, setDraggingTask] = useState(null);

  const handleDragStart = (task) => setDraggingTask(task);
  const handleDragEnd = () => { setDraggingTask(null); setDragOverId(null); };
  const handleDragOver = (qId) => setDragOverId(qId);
  const handleDrop = (qId) => {
    if (draggingTask && draggingTask.quadrantId !== qId) onMove(draggingTask.id, qId);
    setDraggingTask(null); setDragOverId(null);
  };

  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <div className="matrix-container">
      {overdueCount > 0 && (
        <button className="overdue-banner" onClick={onGoToList}>
          ⚠️ {overdueCount} {tr('overdueSection')} — {tr('list')}
        </button>
      )}
      <div className="axis-label axis-y-top">{tr('important')}</div>
      <div className="axis-label axis-y-bottom">{tr('notImportant')}</div>
      <div className="axis-label axis-x-left">{tr('urgent')}</div>
      <div className="axis-label axis-x-right">{tr('notUrgent')}</div>
      <div className="matrix-grid">
        {quadrants.map((q) => (
          <Quadrant key={q.id} quadrant={q} quadrants={quadrants}
            tasks={tasks.filter((t) => t.quadrantId === q.id && !isOverdue(t))}
            onAdd={() => onAdd(q.id)} onEdit={onEdit} onDelete={onDelete}
            onToggle={onToggle} onMove={onMove}
            isDragOver={dragOverId === q.id}
            onDragStart={handleDragStart} onDragEnd={handleDragEnd}
            onDragOver={() => handleDragOver(q.id)} onDrop={() => handleDrop(q.id)}
            tr={tr} />
        ))}
      </div>
    </div>
  );
}
