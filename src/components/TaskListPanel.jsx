import TaskCard from "./TaskCard";
import "./TaskListPanel.css";

export default function TaskListPanel({ tasks, quadrants, onEdit, onDelete, onToggle, onClearCompleted }) {
  const completed = tasks.filter((t) => t.completed);
  const uncompleted = tasks.filter((t) => !t.completed);

  const getQuadrant = (qId) => quadrants.find((q) => q.id === qId);

  return (
    <div className="list-panel">
      {/* Uncompleted */}
      <section className="list-section">
        <div className="list-section-header">
          <h2 className="list-section-title">
            <span className="dot dot-active" />
            In Progress
            <span className="list-count">{uncompleted.length}</span>
          </h2>
        </div>

        {uncompleted.length === 0 ? (
          <div className="list-empty">🎉 All tasks completed!</div>
        ) : (
          <div className="list-groups">
            {quadrants.map((q) => {
              const qTasks = uncompleted.filter((t) => t.quadrantId === q.id);
              if (qTasks.length === 0) return null;
              return (
                <div key={q.id} className="list-group">
                  <div className="list-group-label" style={{ color: `var(${q.colorVar})` }}>
                    {q.icon} {q.label} — {q.title}
                  </div>
                  <div className="list-cards">
                    {qTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        color={`var(${q.colorVar})`}
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task.id)}
                        onToggle={() => onToggle(task.id)}
                        onDragStart={() => {}}
                        onDragEnd={() => {}}
                      />
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
            <span className="dot dot-done" />
            Completed
            <span className="list-count">{completed.length}</span>
          </h2>
          {completed.length > 0 && (
            <button className="clear-all-btn" onClick={onClearCompleted}>
              Clear all
            </button>
          )}
        </div>

        {completed.length === 0 ? (
          <div className="list-empty">No completed tasks yet</div>
        ) : (
          <div className="list-groups">
            {quadrants.map((q) => {
              const qTasks = completed.filter((t) => t.quadrantId === q.id);
              if (qTasks.length === 0) return null;
              return (
                <div key={q.id} className="list-group">
                  <div className="list-group-label" style={{ color: `var(${q.colorVar})` }}>
                    {q.icon} {q.label} — {q.title}
                  </div>
                  <div className="list-cards">
                    {qTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        color={`var(${q.colorVar})`}
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task.id)}
                        onToggle={() => onToggle(task.id)}
                        onDragStart={() => {}}
                        onDragEnd={() => {}}
                      />
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
