import { useState, useEffect, useRef } from "react";
import "./TaskModal.css";

export default function TaskModal({ task, quadrantId, quadrants, onSave, onClose, onDelete, tr }) {
  const [title, setTitle] = useState(task?.title || "");
  const [note, setNote] = useState(task?.note || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [dueTime, setDueTime] = useState(task?.dueTime || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [showAlarm, setShowAlarm] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), note: note.trim(), dueDate, dueTime, priority, quadrantId });
  };

  const q = quadrants.find((q) => q.id === quadrantId);
  const color = q ? `var(${q.colorVar})` : "var(--q1)";

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter' && e.metaKey) handleSubmit(); }} style={{ "--color": color }}>
        <div className="modal-header">
          <div className="modal-tag" style={{ background: `var(${q?.colorVar}-bg)`, color }}>{q?.icon} {q?.label}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>{tr('taskTitle')} *</label>
            <input ref={inputRef} type="text" placeholder={tr('taskPlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label>{tr('notes')}</label>
            <textarea placeholder={tr('notesPlaceholder')} value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>{tr('dueDate')}</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Due time</label>
              <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>{tr('priority')}</label>
            <div className="priority-group">
              {["high", "medium", "low"].map((p) => (
                <button key={p} className={`priority-btn priority-${p} ${priority === p ? "active" : ""}`} onClick={() => setPriority(p)}>
                  {tr(p)}
                </button>
              ))}
            </div>
          </div>

          {dueTime && (
            <button className="alarm-btn" onClick={() => setShowAlarm(!showAlarm)}>
              ⏰ Set iPhone Alarm · {dueTime}{dueDate ? ` · ${dueDate}` : ""}
            </button>
          )}

          {showAlarm && dueTime && (
            <div className="alarm-steps">
              <p className="alarm-steps-title">📱 Set alarm on iPhone:</p>
              <ol>
                <li>Open <strong>Clock</strong> app</li>
                <li>Tap <strong>Alarm</strong> tab (bottom)</li>
                <li>Tap <strong>+</strong> (top right)</li>
                <li>Set time to <strong>{dueTime}</strong></li>
                <li>Tap <strong>Label</strong> → type <strong>"{title}"</strong></li>
                <li>Tap <strong>Save</strong></li>
              </ol>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {onDelete && <button className="btn-delete" onClick={onDelete}>{tr('delete')}</button>}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>{tr('cancel')}</button>
            <button className="btn-save" onClick={handleSubmit} disabled={!title.trim()}>
              {task ? tr('saveChanges') : tr('addTaskBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
