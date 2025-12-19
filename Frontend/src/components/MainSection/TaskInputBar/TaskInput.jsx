import { useState } from "react"
import TaskInputField from "./TaskInputField"
import './TaskInput.css'

function TaskInput({ onAddTask }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('none');

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
      onAddTask(text, selectedDate, selectedPriority);
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
    </div>
  )
}

export default TaskInput