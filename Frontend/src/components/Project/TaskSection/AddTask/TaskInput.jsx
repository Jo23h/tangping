import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { filterTasks } from '../FilterLogic/TaskFilterLogic.jsx';
import DateSelector from './TaskOptions/DateSelector.jsx';
import TaskOtherOptions from '../TaskOption/TaskOtherOptions.jsx';
import TaskPriority from './TaskOptions/TaskPriority.jsx';
import TaskInputBar from './TaskInputBar.jsx';
import TaskFilters from './TaskFilters.jsx';
import TaskList from './TaskList.jsx';
import CompletedSection from './CompletedSection.jsx';
import { formatDueDate } from './utils/dateFormatter.jsx';
import { sortTasks } from './utils/taskSorter.jsx';

function TaskInput({ onItemClick, selectedItem, showHeader = true, onTaskCountChange, tasks: externalTasks, onTasksChange, projectId = null }) {
  const [taskText, setTaskText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [internalTasks, setInternalTasks] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  // Use external tasks if provided, otherwise use internal state
  const tasks = externalTasks !== undefined ? externalTasks : internalTasks;
  const setTasks = onTasksChange || setInternalTasks;

  // Update task when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === selectedItem.id
            ? {
                ...task,
                text: selectedItem.text !== undefined ? selectedItem.text : task.text,
                memo: selectedItem.memo !== undefined ? selectedItem.memo : task.memo,
                memoLastModified: selectedItem.memoLastModified
              }
            : task
        )
      );
    }
  }, [selectedItem]);

  // Use TaskPriority component
  const priorityService = TaskPriority({
    onPriorityChange: (priority) => {
      // Priority changed
    },
    onPriorityCommandInsert: (command) => {
      setTaskText(command + taskText);
      setShowOtherOptions(false);
    }
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && taskText.trim()) {
      e.preventDefault();

      // Parse priority from text using TaskPriority service
      const { priority: finalPriority, cleanText: finalText } = priorityService.parsePriorityFromText(taskText);

      // Create new task
      const newTask = {
        id: uuidv4(),
        text: finalText,
        dueDate: dueDate,
        priority: finalPriority,
        completed: false,
        projectId: projectId // Track which project this task belongs to
      };
      setTasks([...tasks, newTask]);
      setTaskText('');
      setDueDate('');
      priorityService.resetPriority();
      setShowDatePicker(false);
    }
  };

  const handleDateSelect = (date) => {
    setDueDate(date);
    setShowDatePicker(false);
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Separate completed and active tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Notify parent of task changes (for centralized state management)
  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  // Notify parent of task count changes
  useEffect(() => {
    if (onTaskCountChange) {
      onTaskCountChange(activeTasks.length);
    }
  }, [activeTasks.length, onTaskCountChange]);

  // Use the filter logic from TaskFilterLogic - on both active and completed tasks
  const filteredActiveTasks = sortTasks(filterTasks(activeTasks, activeFilter));
  const filteredCompletedTasks = sortTasks(filterTasks(completedTasks, activeFilter));

  // Check if there's any content
  const hasContent = () => {
    return tasks.length > 0;
  };

  return (
    <div className='task-input-section'>
      {/* Section header - collapsible (only show if showHeader is true) */}
      {showHeader && (
        <div
          className='text-section-header'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className='text-section-arrow'>
            {isExpanded ? 'v' : '>'}
          </span>
          <h2 className='project-form-section-title'>All Tasks</h2>
          {!isExpanded && hasContent() && (
            <span className='text-section-ellipsis'>...</span>
          )}
        </div>
      )}

      {/* Task content - only show when expanded (or always show if no header) */}
      {(isExpanded || !showHeader) && (
        <>
          {/* Task input box */}
          <TaskInputBar
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            onCalendarClick={() => setShowDatePicker(!showDatePicker)}
            onOptionsClick={() => setShowOtherOptions(!showOtherOptions)}
            showOtherOptions={showOtherOptions}
            dueDate={dueDate}
            formatDueDate={formatDueDate}
            TaskOtherOptionsComponent={
              <TaskOtherOptions
                onClose={() => setShowOtherOptions(false)}
                onPrioritySelect={priorityService.handlePrioritySelect}
              />
            }
          />

          {/* Filter tabs */}
          <TaskFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Active Task list */}
          <TaskList
            tasks={filteredActiveTasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            formatDueDate={formatDueDate}
            onItemClick={onItemClick}
          />

          {/* Completed section */}
          <CompletedSection
            tasks={filteredCompletedTasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            formatDueDate={formatDueDate}
            sortTasks={sortTasks}
            onItemClick={onItemClick}
          />

          {/* Date selector modal */}
          {showDatePicker && (
            <DateSelector
              onDateSelect={handleDateSelect}
              onClose={() => setShowDatePicker(false)}
              initialDate={dueDate ? new Date(dueDate) : null}
            />
          )}
        </>
      )}
    </div>
  );
}

export default TaskInput;
