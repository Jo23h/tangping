import { useState, useEffect } from "react"
import TaskInputField from "./TaskInputField"
import CategoryPopup from "./CategoryPopup"
import './TaskInput.css'

function TaskInput({ onAddTask, selectedCategoryId, selectedCategoryName, onCategoryChange, projects, defaultPriority }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(defaultPriority || 'none');
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

  // Update selected priority when default priority changes (e.g., navigating to different project)
  useEffect(() => {
    setSelectedPriority(defaultPriority || 'none');
  }, [defaultPriority]);

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
      onAddTask(text, selectedDate, selectedPriority, selectedCategoryId);
      setInputValue('');
      setSelectedDate('');
      // Reset to default priority (project's priority or 'none')
      setSelectedPriority(defaultPriority || 'none');
    }
  };

  const handleCategorySelect = (categoryId, categoryName) => {
    onCategoryChange(categoryId, categoryName);
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
        selectedCategoryName={selectedCategoryName}
        onInputChange={handleInputChange}
        onDateChange={setSelectedDate}
        onPriorityChange={setSelectedPriority}
        onCategoryClick={() => setIsCategoryPopupOpen(true)}
        onAddTask={handleAddTask}
        onKeyDown={handleSubmit}
      />
      <CategoryPopup
        isOpen={isCategoryPopupOpen}
        onClose={() => setIsCategoryPopupOpen(false)}
        onSelectCategory={handleCategorySelect}
        selectedCategoryId={selectedCategoryId}
        projects={projects || []}
      />
    </div>
  )
}

export default TaskInput