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

  if (diffDays < -1) {
    displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
    isOverdue = true;
  } 
    else if (diffDays === -1) {
    displayText = 'Yesterday';
    isOverdue = true;

  } 
    else if (diffDays === 0) {
    displayText = 'Today';
    isOverdue = false;

  } 
    else if (diffDays === 1) {
    displayText = 'Tomorrow';
    isOverdue = false;

  } 
    else if (diffDays <= 6) {
    displayText = `Next ${dayNames[dueDate.getDay()]}`;
    isOverdue = false;

  } 
    else {
    displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
    isOverdue = false;
  }

  return { displayText, isOverdue };
};
