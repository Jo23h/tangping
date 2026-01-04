import { useState } from 'react';
import TaskFilter, { filterTasks } from './TaskFilter';
import TaskList from '../TaskInputBar/TaskList';
import CompletedSection from './CompletedSection';
import { sortTasks } from '../TaskInputBar/TaskSorter';
import { formatDueDate } from '../TaskInputBar/dateFormatter';
import './TaskManager.css';

function TaskManager({ tasks, onToggle, onDelete, onItemClick, onTaskEdit, onCreateMemo, isGuest }) {
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
        onToggle={isGuest ? null : onToggle}
        onDelete={isGuest ? null : onDelete}
        formatDueDate={formatDueDate}
        onItemClick={onItemClick}
        onTaskEdit={isGuest ? null : onTaskEdit}
        onCreateMemo={isGuest ? null : onCreateMemo}
      />

      <CompletedSection
        tasks={filteredCompletedTasks}
        onToggle={isGuest ? null : onToggle}
        onDelete={isGuest ? null : onDelete}
        formatDueDate={formatDueDate}
        onItemClick={onItemClick}
        onTaskEdit={isGuest ? null : onTaskEdit}
        onCreateMemo={isGuest ? null : onCreateMemo}
      />
    </div>
  );
}

export default TaskManager;
