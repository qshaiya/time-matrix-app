import TaskCard from "./TaskCard";
import "./TaskListPanel.css";
import { isOverdue } from "../utils";


export default function TaskListPanel({ tasks, quadrants, onEdit, onDelete, onToggle, onClearCompleted, onMove, tr }) {
  const completed = tasks.filter((t) => t.completed);
  const uncompleted = tasks.filter((t) => !t.completed);
  const overdueTasks = uncompleted.filter(isOverdue);
  const activeTasks = uncompleted.filter((t) => !isOverdue(t));
  const getQ = (id) => quadrants.find(q => q.id === id);

  return (
    <div className="list-panel">
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
                <div className="list-group-label overdue-label">⚠️ {tr('overdueSection')}</div>
                <div className="list-cards">
                  {overdueTasks.map((task) => {
                    const q = getQ(task.quadrantId);
                    return (
                      <TaskCard key={task.id} task={task} color={`var(${q.colorVar})`}
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

      <section className="list-section">
        <div className="list-section-header">
          <h2 className="list-section-title">
            <span className="dot dot-done" />{tr('completed')}<span className="list-count">{completed.length}</span>
          </h2>
          {completed.length > 0 && <button className="clear-all-btn" onClick={onClearCompleted}>{tr('clearAll')}</button>}
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
