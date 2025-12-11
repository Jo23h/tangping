function TaskFilters({ activeFilter, onFilterChange }) {
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

export default TaskFilters;
