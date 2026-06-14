import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";
import { T, getLang, setLang } from "./i18n";
import Matrix from "./components/Matrix";
import TaskModal from "./components/TaskModal";
import Header from "./components/Header";
import TaskListPanel from "./components/TaskListPanel";
import AuthPage from "./components/AuthPage";
import "./App.css";

const STORAGE_KEY = "time-matrix-tasks";

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [modal, setModal] = useState({ open: false, quadrantId: null, task: null })
  const [view, setView] = useState("matrix")
  const [lang, setLangState] = useState(getLang())

  const changeLang = (code) => { setLang(code); setLangState(code) }

  const tr = (key, ...args) => {
    const val = T[lang]?.[key] ?? T['en'][key]
    return typeof val === 'function' ? val(...args) : (val ?? key)
  }

  const QUADRANTS = [
    { id: "q1", label: tr('doFirst'), title: tr('q1Title'), subtitle: tr('q1Sub'), colorVar: "--q1", icon: "⚡" },
    { id: "q2", label: tr('schedule'), title: tr('q2Title'), subtitle: tr('q2Sub'), colorVar: "--q2", icon: "🎯" },
    { id: "q3", label: tr('delegate'), title: tr('q3Title'), subtitle: tr('q3Sub'), colorVar: "--q3", icon: "📤" },
    { id: "q4", label: tr('eliminate'), title: tr('q4Title'), subtitle: tr('q4Sub'), colorVar: "--q4", icon: "🗑️" },
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) { loadTasks() }
    else if (!authLoading) {
      try { const s = localStorage.getItem(STORAGE_KEY); setTasks(s ? JSON.parse(s) : []) }
      catch { setTasks([]) }
    }
  }, [session, authLoading])

  useEffect(() => {
    if (!session) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks, session])

  const loadTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true })
    if (!error && data) {
      setTasks(data.map(t => ({ id: t.id, quadrantId: t.quadrant_id, title: t.title, note: t.note, priority: t.priority, dueDate: t.due_date, completed: t.completed, createdAt: t.created_at })))
    }
  }

  const openAdd = (quadrantId) => setModal({ open: true, quadrantId, task: null })
  const openEdit = (task) => setModal({ open: true, quadrantId: task.quadrantId, task })
  const closeModal = () => setModal({ open: false, quadrantId: null, task: null })

  const saveTask = async (data) => {
    if (modal.task) {
      setTasks(prev => prev.map(t => t.id === modal.task.id ? { ...t, ...data } : t))
      if (session) await supabase.from('tasks').update({ title: data.title, note: data.note, priority: data.priority, due_date: data.dueDate, quadrant_id: data.quadrantId }).eq('id', modal.task.id)
    } else {
      const newTask = { id: uuidv4(), quadrantId: modal.quadrantId, createdAt: new Date().toISOString(), completed: false, ...data }
      setTasks(prev => [...prev, newTask])
      if (session) await supabase.from('tasks').insert({ id: newTask.id, user_id: session.user.id, title: newTask.title, note: newTask.note, quadrant_id: newTask.quadrantId, priority: newTask.priority, due_date: newTask.dueDate, completed: false })
    }
    closeModal()
  }

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (session) await supabase.from('tasks').delete().eq('id', id)
  }

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id)
    const updated = !task.completed
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: updated } : t))
    if (session) await supabase.from('tasks').update({ completed: updated }).eq('id', id)
  }

  const moveTask = async (taskId, toQuadrantId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, quadrantId: toQuadrantId } : t))
    if (session) await supabase.from('tasks').update({ quadrant_id: toQuadrantId }).eq('id', taskId)
  }

  const clearCompleted = async () => {
    const ids = tasks.filter(t => t.completed).map(t => t.id)
    setTasks(prev => prev.filter(t => !t.completed))
    if (session) await supabase.from('tasks').delete().in('id', ids)
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); setTasks([]) }
  const stats = { total: tasks.length, completed: tasks.filter(t => t.completed).length }

  if (authLoading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', color:'var(--text-muted)' }}>Loading...</div>
  if (!session) return <AuthPage lang={lang} onLangChange={changeLang} tr={tr} />

  return (
    <div className="app">
      <Header stats={stats} onClearCompleted={clearCompleted} view={view} onViewChange={setView} user={session.user} onSignOut={handleSignOut} lang={lang} onLangChange={changeLang} tr={tr} />
      <main className="main">
        {view === "matrix" ? (
          <Matrix quadrants={QUADRANTS} tasks={tasks} onAdd={openAdd} onEdit={openEdit} onDelete={deleteTask} onToggle={toggleComplete} onMove={moveTask} tr={tr} />
        ) : (
          <TaskListPanel tasks={tasks} quadrants={QUADRANTS} onEdit={openEdit} onDelete={deleteTask} onToggle={toggleComplete} onClearCompleted={clearCompleted} onMove={moveTask} tr={tr} />
        )}
      </main>
      {modal.open && (
        <TaskModal task={modal.task} quadrantId={modal.quadrantId} quadrants={QUADRANTS} onSave={saveTask} onClose={closeModal} onDelete={modal.task ? () => { deleteTask(modal.task.id); closeModal() } : null} tr={tr} />
      )}
    </div>
  )
}
