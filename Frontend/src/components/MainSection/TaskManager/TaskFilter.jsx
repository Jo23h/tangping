import './TaskFilter.css'

// Task filter logic
export const filterTasks = (tasks, filterType) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (filterType) {
    case 'Overdue/due soon':
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const diffTime = taskDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      });
    case 'Upcoming':
      return tasks.filter(task => {
        if (!task.dueDate) return true;
        const taskDate = new Date(task.dueDate);
        const diffTime = taskDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 3;
      });
    case 'All':
    default:
      return tasks;
  }
};

function TaskFilter({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'All', label: 'All' },
    { id: 'Overdue/due soon', label: 'Overdue/due soon' },
    { id: 'Upcoming', label: 'Upcoming' }
  ];

  return (
    <div className='task-filters'>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`task-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
