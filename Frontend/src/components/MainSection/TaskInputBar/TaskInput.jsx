import { useState } from "react"
import { createTask } from "./TaskSchema"
import TaskFilter, { filterTasks } from "../TaskFilter/TaskFilter"
import TaskList from "./TaskList"
import CompletedSection from "../TaskFilter/CompletedSection"
import TaskInputField from "./TaskInputField"
import TaskEditor from "./TaskEditor"
import { sortTasks } from "./TaskSorter"
import { formatDueDate } from "./dateFormatter"
import './TaskInput.css'

function TaskInput({ onItemClick }) {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('none');
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingTask, setEditingTask] = useState(null);

  const parsePriority = (text) => {
    const priorityRegex = /^!(high|medium|low|none)\s+(.+)/i;
    const match = text.match(priorityRegex);

    if (match) {
      const priority = match[1].toLowerCase();
      const cleanText = match[2];
      return { priority, text: cleanText };
    }

    return { priority: null, text };
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    const { priority } = parsePriority(newValue);

    if (priority) {
      setSelectedPriority(priority);
    }
    setInputValue(newValue);
  };

  const handleAddTask = () => {
    if (inputValue.trim()) {
      const { text } = parsePriority(inputValue);
      const newTask = createTask(text);
      newTask.dueDate = selectedDate;
      newTask.priority = selectedPriority;
      setTasks([...tasks, newTask]);
      setInputValue('');
      setSelectedDate('');
      setSelectedPriority('none');
    }
  };

  const handleSubmit = (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
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

  const handleTaskClick = (task) => {
    setEditingTask(task);
    if (onItemClick) {
      onItemClick(task);
    }
  };

  const handleSaveTask = (editedTask) => {
    const updatedTasks = tasks.map(task =>
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
  };

  const handleCloseEditor = () => {
    setEditingTask(null);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const filteredActiveTasks = sortTasks(filterTasks(activeTasks, activeFilter));
  const filteredCompletedTasks = sortTasks(filterTasks(completedTasks, activeFilter));

  return (
    <div>
      <TaskInputField
        inputValue={inputValue}
        selectedDate={selectedDate}
        selectedPriority={selectedPriority}
        onInputChange={handleInputChange}
        onDateChange={setSelectedDate}
        onPriorityChange={setSelectedPriority}
        onAddTask={handleAddTask}
        onKeyDown={handleSubmit}
      />

      <TaskFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <TaskList
        tasks={filteredActiveTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        formatDueDate={formatDueDate}
        onItemClick={handleTaskClick}
      />

      <CompletedSection
        tasks={filteredCompletedTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        formatDueDate={formatDueDate}
        onItemClick={handleTaskClick}
      />

      {editingTask && (
        <TaskEditor
          task={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  )
}

export default TaskInput