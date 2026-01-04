export const formatDueDate = (dateString) => {

  const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
  const today = new Date();
    today.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let displayText = '';
  let isOverdue = false;
  let color = '#2e3338'; // Default black

  if (diffDays < -1) {
    displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
    isOverdue = true;
    color = '#ff6b6b'; // Red for overdue
  }
    else if (diffDays === -1) {
    displayText = 'Yesterday';
    isOverdue = true;
    color = '#ff6b6b'; // Red for overdue

  }
    else if (diffDays === 0) {
    displayText = 'Today';
    isOverdue = false;
    color = '#ff6b6b'; // Red for due today (within 3 days)

  }
    else if (diffDays === 1) {
    displayText = 'Tomorrow';
    isOverdue = false;
    color = '#ff6b6b'; // Red for due tomorrow (within 3 days)

  }
    else if (diffDays <= 3) {
    displayText = `Next ${dayNames[dueDate.getDay()]}`;
    isOverdue = false;
    color = '#ff6b6b'; // Red for due within 3 days

  }
    else if (diffDays <= 7) {
    displayText = `Next ${dayNames[dueDate.getDay()]}`;
    isOverdue = false;
    color = '#4dabf7'; // Blue for upcoming (4-7 days)

  }
    else {
    displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
    isOverdue = false;
    color = '#2e3338'; // Black for further dates
  }

  return { displayText, isOverdue, color };
};
