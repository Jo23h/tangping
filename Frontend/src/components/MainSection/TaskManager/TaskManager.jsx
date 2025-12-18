import { useState } from 'react';
import TaskFilter, { filterTasks } from './TaskFilter';
import TaskList from '../TaskInputBar/TaskList';
import CompletedSection from './CompletedSection';
import { sortTasks } from '../TaskInputBar/TaskSorter';
import { formatDueDate } from '../TaskInputBar/dateFormatter';
import './TaskManager.css';

function TaskManager({ tasks, onToggle, onDelete, onItemClick, onTaskEdit }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const filteredActiveTasks = sortTasks(filterTasks(activeTasks, activeFilter));
  const filteredCompletedTasks = sortTasks(filterTasks(completedTasks, activeFilter));

  return (
    <div className="task-manager">
      <TaskFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <TaskList
        tasks={filteredActiveTasks}
        onToggle={onToggle}
        onDelete={onDelete}
        formatDueDate={formatDueDate}
        onItemClick={onItemClick}
        onTaskEdit={onTaskEdit}
      />

      <CompletedSection
        tasks={filteredCompletedTasks}
        onToggle={onToggle}
        onDelete={onDelete}
        formatDueDate={formatDueDate}
        onItemClick={onItemClick}
        onTaskEdit={onTaskEdit}
      />
    </div>
  );
}

export default TaskManager;
