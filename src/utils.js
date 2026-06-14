export function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate < today;
}
