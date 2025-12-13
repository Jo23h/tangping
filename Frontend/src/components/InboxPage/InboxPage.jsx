import TaskInput from '../Project/TaskSection/AddTask/TaskInput';
import './InboxPage.css';

function InboxPage({ onItemClick, selectedItem, tasks, onTasksChange }) {
  return (
    <div className='inbox-page-container'>
      <TaskInput
        onItemClick={onItemClick}
        selectedItem={selectedItem}
        showHeader={false}
        tasks={tasks}
        onTasksChange={onTasksChange}
        projectId={null} // Inbox tasks have no projectId
      />
    </div>
  );
}

export default InboxPage;
