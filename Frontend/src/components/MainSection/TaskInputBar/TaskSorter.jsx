// Sort tasks by date, then by priority
// Tasks with dates come first (sorted by date, then priority)
// Tasks without dates come after (sorted by priority)
export const sortTasks = (tasksToSort) => {
  return [...tasksToSort].sort((a, b) => {
    const hasDateA = !!a.dueDate;
    const hasDateB = !!b.dueDate;

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const priorityA = priorityOrder[a.priority] || 3;
    const priorityB = priorityOrder[b.priority] || 3;

    // If both have dates, sort by date first, then priority
    if (hasDateA && hasDateB) {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      if (dateA !== dateB) {
        return dateA - dateB;
      }
      return priorityA - priorityB;
    }

    // If one has a date and one doesn't, dated task comes first
    if (hasDateA && !hasDateB) {
      return -1;
    }
    if (!hasDateA && hasDateB) {
      return 1;
    }

    // If neither has a date, sort by priority
    return priorityA - priorityB;
  });
};
