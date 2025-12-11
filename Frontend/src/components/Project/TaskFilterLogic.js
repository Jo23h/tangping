// Task filter logic utility

export const filterTasks = (tasks, filterType) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (filterType) {
    case 'Overdue/due soon':
      // Tasks that are overdue OR due within 3 days
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const diffTime = taskDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Include overdue (diffDays < 0) or due within 3 days (diffDays 0-3)
        return diffDays <= 3;
      });

    case 'Upcoming':
      // Tasks with no due date OR tasks with future due dates
      return tasks.filter(task => {
        if (!task.dueDate) return true; // No due date goes to Upcoming
        const taskDate = new Date(task.dueDate);
        return taskDate > today;
      });

    case 'All':
    default:
      // All tasks
      return tasks;
  }
};
