import TaskCard from "./TaskCard";
import "./TaskListPanel.css";

function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate < today;
}

function exportToCSV(tasks, quadrants) {
  const getQ = (id) => quadrants.find(q => q.id === id);
  const rows = [
    ["Title", "Quadrant", "Priority", "Due Date", "Due Time", "Note", "Completed", "Created At"]
  ];
  tasks.forEach(t => {
    rows.push([
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${getQ(t.quadrantId)?.title || t.quadrantId}"`,
      t.priority || '',
      t.dueDate || '',
      t.dueTime || '',
      `"${(t.note || '').replace(/"/g, '""')}"`,
      t.completed ? 'Yes' : 'No',
      t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''
    ]);
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `completed-tasks-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToMarkdown(tasks, quadrants) {
  const getQ = (id) => quadrants.find(q => q.id === id);
  let md = `# Completed Tasks\n\nExported: ${new Date().toLocaleDateString()}\n\n`;
  tasks.forEach(t => {
    md += `## ✅ ${t.title}\n`;
    md += `- **Quadrant:** ${getQ(t.quadrantId)?.title || t.quadrantId}\n`;
    if (t.priority) md += `- **Priority:** ${t.priority}\n`;
    if (t.dueDate) md += `- **Due:** ${t.dueDate}${t.dueTime ? ` ${t.dueTime}` : ''}\n`;
    if (t.note) md += `- **Note:** ${t.note}\n`;
    if (t.createdAt) md += `- **Created:** ${new Date(t.createdAt).toLocaleDateString()}\n`;
    md += '\n';
  });
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `completed-tasks-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TaskListPanel({ tasks, quadrants, onEdit, onDelete, onToggle, onClearCompleted, onMove, tr }) {
  const completed = tasks.filter((t) => t.completed);
  const uncompleted = tasks.filter((t) => !t.completed);
  const overdueTasks = uncompleted.filter(isOverdue);
  const activeTasks = uncompleted.filter((t) => !isOverdue(t));
  const getQ = (id) => quadrants.find(q => q.id === id);

  return (
    <div className="list-panel">
      {/* In Progress */}
      <section className="list-section">
        <div className="list-section-header">
          <h2 className="list-section-title">
            <span className="dot dot-active" />{tr('inProgress')}<span className="list-count">{uncompleted.length}</span>
          </h2>
        </div>
        {uncompleted.length === 0 ? (
          <div className="list-empty">{tr('allDone')}</div>
        ) : (
          <div className="list-groups">
            {overdueTasks.length > 0 && (
              <div className="list-group">
                <div className="list-group-label overdue-label">⚠️ Overdue</div>
                <div className="list-cards">
                  {overdueTasks.map((task) => {
                    const q = getQ(task.quadrantId);
                    return (
                      <TaskCard key={task.id} task={task} color={`var(${q?.colorVar})`}
                        onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)}
                        onToggle={() => onToggle(task.id)} onDragStart={() => {}} onDragEnd={() => {}}
                        onMove={onMove} quadrants={quadrants} tr={tr} />
                    );
                  })}
                </div>
              </div>
            )}
            {quadrants.map((q) => {
              const qTasks = activeTasks.filter((t) => t.quadrantId === q.id);
              if (qTasks.length === 0) return null;
              return (
                <div key={q.id} className="list-group">
                  <div className="list-group-label" style={{ color: `var(${q.colorVar})` }}>{q.icon} {q.label} — {q.title}</div>
                  <div className="list-cards">
                    {qTasks.map((task) => (
                      <TaskCard key={task.id} task={task} color={`var(${q.colorVar})`}
                        onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)}
                        onToggle={() => onToggle(task.id)} onDragStart={() => {}} onDragEnd={() => {}}
                        onMove={onMove} quadrants={quadrants} tr={tr} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Completed */}
      <section className="list-section">
        <div className="list-section-header">
          <h2 className="list-section-title">
            <span className="dot dot-done" />{tr('completed')}<span className="list-count">{completed.length}</span>
          </h2>
          <div className="completed-actions">
            {completed.length > 0 && (
              <>
                <div className="export-group">
                  <button className="export-btn" onClick={() => exportToCSV(completed, quadrants)}>
                    ↓ CSV
                  </button>
                  <button className="export-btn" onClick={() => exportToMarkdown(completed, quadrants)}>
                    ↓ MD
                  </button>
                </div>
                <button className="clear-all-btn" onClick={onClearCompleted}>{tr('clearAll')}</button>
              </>
            )}
          </div>
        </div>
        {completed.length === 0 ? (
          <div className="list-empty">{tr('noCompleted')}</div>
        ) : (
          <div className="list-groups">
            {quadrants.map((q) => {
              const qTasks = completed.filter((t) => t.quadrantId === q.id);
              if (qTasks.length === 0) return null;
              return (
                <div key={q.id} className="list-group">
                  <div className="list-group-label" style={{ color: `var(${q.colorVar})` }}>{q.icon} {q.label} — {q.title}</div>
                  <div className="list-cards">
                    {qTasks.map((task) => (
                      <TaskCard key={task.id} task={task} color={`var(${q.colorVar})`}
                        onEdit={() => onEdit(task)} onDelete={() => onDelete(task.id)}
                        onToggle={() => onToggle(task.id)} onDragStart={() => {}} onDragEnd={() => {}}
                        onMove={onMove} quadrants={quadrants} tr={tr} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
