import { useState } from "react";
import Quadrant from "./Quadrant";
import "./Matrix.css";

export default function Matrix({ quadrants, tasks, onAdd, onEdit, onDelete, onToggle, onMove }) {
  const [dragOverId, setDragOverId] = useState(null);
  const [draggingTask, setDraggingTask] = useState(null);

  const handleDragStart = (task) => setDraggingTask(task);
  const handleDragEnd = () => { setDraggingTask(null); setDragOverId(null); };
  const handleDragOver = (qId) => setDragOverId(qId);
  const handleDrop = (qId) => {
    if (draggingTask && draggingTask.quadrantId !== qId) onMove(draggingTask.id, qId);
    setDraggingTask(null);
    setDragOverId(null);
  };

  return (
    <div className="matrix-container">
      <div className="axis-label axis-y-top">IMPORTANT</div>
      <div className="axis-label axis-y-bottom">NOT IMPORTANT</div>
      <div className="axis-label axis-x-left">URGENT</div>
      <div className="axis-label axis-x-right">NOT URGENT</div>

      <div className="matrix-grid">
        {quadrants.map((q) => (
          <Quadrant
            key={q.id}
            quadrant={q}
            tasks={tasks.filter((t) => t.quadrantId === q.id)}
            onAdd={() => onAdd(q.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            isDragOver={dragOverId === q.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={() => handleDragOver(q.id)}
            onDrop={() => handleDrop(q.id)}
          />
        ))}
      </div>

      {/* Axis center cross */}
      <div className="axis-cross">
        <div className="axis-line axis-line-v" />
        <div className="axis-line axis-line-h" />
      </div>
    </div>
  );
}
