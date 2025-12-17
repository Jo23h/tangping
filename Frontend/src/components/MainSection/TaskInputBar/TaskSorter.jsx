// Sort tasks by date, then by priority
export const sortTasks = (tasksToSort) => {
  return [...tasksToSort].sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

    if (dateA !== dateB) {
      return dateA - dateB;
    }

    const priorityOrder = { high: 1, medium: 2, low: 3, none: 4 };
    const priorityA = priorityOrder[a.priority] || 4;
    const priorityB = priorityOrder[b.priority] || 4;

    return priorityA - priorityB;
  });
};
