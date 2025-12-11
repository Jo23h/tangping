// Format date for display
export const formatDueDate = (dateString) => {
  if (!dateString) return null;

  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let displayText = '';
  let isOverdue = false;

  if (diffDays < -1) {
    // More than 1 day overdue - show date like "Dec 9"
    displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
    isOverdue = true;
  } else if (diffDays === -1) {
    // Yesterday
    displayText = 'Yesterday';
    isOverdue = true;
  } else if (diffDays === 0) {
    // Today
    displayText = 'Today';
    isOverdue = false;
  } else if (diffDays === 1) {
    // Tomorrow
    displayText = 'Tomorrow';
    isOverdue = false;
  } else if (diffDays <= 6) {
    // Within next week - show day name like "Next Wed"
    displayText = `Next ${dayNames[dueDate.getDay()]}`;
    isOverdue = false;
  } else {
    // Further in future - show date like "Dec 18"
    displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
    isOverdue = false;
  }

  return { displayText, isOverdue };
};
