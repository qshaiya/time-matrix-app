import { useState, useEffect, useRef } from "react";
import "./TaskModal.css";

export default function TaskModal({ task, quadrantId, quadrants, onSave, onClose, onDelete }) {
  const [title, setTitle] = useState(task?.title || "");
  const [note, setNote] = useState(task?.note || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && e.metaKey) handleSubmit();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), note: note.trim(), dueDate, priority, quadrantId });
  };

  const q = quadrants.find((q) => q.id === quadrantId);
  const color = q ? `var(${q.colorVar})` : "var(--q1)";

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" onKeyDown={handleKeyDown} style={{ "--color": color }}>
        <div className="modal-header">
          <div className="modal-tag" style={{ background: `var(${q?.colorVar}-bg)`, color }}>
            {q?.icon} {q?.label}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Task title *</label>
            <input
              ref={inputRef}
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea
              placeholder="Add details, context, or links..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Priority</label>
              <div className="priority-group">
                {["high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    className={`priority-btn priority-${p} ${priority === p ? "active" : ""}`}
                    onClick={() => setPriority(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {onDelete && (
            <button className="btn-delete" onClick={onDelete}>Delete</button>
          )}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSubmit} disabled={!title.trim()}>
              {task ? "Save changes" : "Add task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
