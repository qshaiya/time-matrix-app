import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Matrix from "./components/Matrix";
import TaskModal from "./components/TaskModal";
import Header from "./components/Header";
import TaskListPanel from "./components/TaskListPanel";
import "./App.css";

const STORAGE_KEY = "time-matrix-tasks";

export const QUADRANTS = [
  {
    id: "q1",
    label: "DO FIRST",
    title: "Important & Urgent",
    subtitle: "Crises · Deadlines · Emergencies",
    colorVar: "--q1",
    icon: "⚡",
  },
  {
    id: "q2",
    label: "SCHEDULE",
    title: "Important & Not Urgent",
    subtitle: "Planning · Growth · Prevention",
    colorVar: "--q2",
    icon: "🎯",
  },
  {
    id: "q3",
    label: "DELEGATE",
    title: "Urgent & Not Important",
    subtitle: "Interruptions · Some meetings",
    colorVar: "--q3",
    icon: "📤",
  },
  {
    id: "q4",
    label: "ELIMINATE",
    title: "Not Important & Not Urgent",
    subtitle: "Distractions · Time wasters",
    colorVar: "--q4",
    icon: "🗑️",
  },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [modal, setModal] = useState({ open: false, quadrantId: null, task: null });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const openAdd = (quadrantId) => setModal({ open: true, quadrantId, task: null });
  const openEdit = (task) => setModal({ open: true, quadrantId: task.quadrantId, task });
  const closeModal = () => setModal({ open: false, quadrantId: null, task: null });

  const saveTask = (data) => {
    if (modal.task) {
      setTasks((prev) => prev.map((t) => (t.id === modal.task.id ? { ...t, ...data } : t)));
    } else {
      setTasks((prev) => [
        ...prev,
        { id: uuidv4(), quadrantId: modal.quadrantId, createdAt: new Date().toISOString(), completed: false, ...data },
      ]);
    }
    closeModal();
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggleComplete = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const moveTask = (taskId, toQuadrantId) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, quadrantId: toQuadrantId } : t)));
  const clearCompleted = () => setTasks((prev) => prev.filter((t) => !t.completed));

  const [view, setView] = useState("matrix"); // "matrix" | "list"
  const stats = { total: tasks.length, completed: tasks.filter((t) => t.completed).length };

  return (
    <div className="app">
      <Header
        stats={stats}
        onClearCompleted={clearCompleted}
        view={view}
        onViewChange={setView}
      />
      <main className="main">
        {view === "matrix" ? (
          <Matrix
            quadrants={QUADRANTS}
            tasks={tasks}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={deleteTask}
            onToggle={toggleComplete}
            onMove={moveTask}
          />
        ) : (
          <TaskListPanel
            tasks={tasks}
            quadrants={QUADRANTS}
            onEdit={openEdit}
            onDelete={deleteTask}
            onToggle={toggleComplete}
            onClearCompleted={clearCompleted}
          />
        )}
      </main>
      {modal.open && (
        <TaskModal
          task={modal.task}
          quadrantId={modal.quadrantId}
          quadrants={QUADRANTS}
          onSave={saveTask}
          onClose={closeModal}
          onDelete={modal.task ? () => { deleteTask(modal.task.id); closeModal(); } : null}
        />
      )}
    </div>
  );
}
