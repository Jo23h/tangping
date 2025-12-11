import { useState } from 'react';
import './TaskPriority.css';

function TaskPriority({ onPriorityChange, onPriorityCommandInsert }) {
  const [priority, setPriority] = useState('none');

  const handlePrioritySelect = (selectedPriority) => {
    setPriority(selectedPriority);

    // Add priority command to input
    const priorityMap = {
      high: '!High ',
      medium: '!Medium ',
      low: '!Low ',
      none: '!None '
    };

    const priorityCommand = priorityMap[selectedPriority] || '';

    // Notify parent about priority change
    if (onPriorityChange) {
      onPriorityChange(selectedPriority);
    }

    // Notify parent to insert priority command
    if (onPriorityCommandInsert) {
      onPriorityCommandInsert(priorityCommand);
    }
  };

  const parsePriorityFromText = (text) => {
    const priorityRegex = /^!(High|Medium|Low|None)\s+/;
    const match = text.match(priorityRegex);

    if (match) {
      const priorityText = match[1].toLowerCase();
      const cleanText = text.replace(priorityRegex, '').trim();
      return {
        priority: priorityText,
        cleanText: cleanText
      };
    }

    return {
      priority: priority,
      cleanText: text
    };
  };

  const resetPriority = () => {
    setPriority('none');
  };

  return {
    priority,
    handlePrioritySelect,
    parsePriorityFromText,
    resetPriority
  };
}

export default TaskPriority;
