import TaskInput from '../Project/TaskSection/AddTask/TaskInput';
import './ViewTask.css';

function ViewTask({ onItemClick, selectedItem, tasks, onTasksChange }) {
  return (
    <div className='view-task-container'>
      <TaskInput
        onItemClick={onItemClick}
        selectedItem={selectedItem}
        showHeader={false}
        tasks={tasks}
        onTasksChange={onTasksChange}
      />
    </div>
  );
}

export default ViewTask;
