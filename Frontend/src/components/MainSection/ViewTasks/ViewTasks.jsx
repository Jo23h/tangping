import './ViewTasks.css'
import TaskInput from '../TaskInputBar/TaskInput'

function ViewTasks() {
  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
  };

  return (
     <div className="view-task">
        <div className="view-task-header">
          <h1 className="view-task-title">View Task</h1>
          <button className="view-task-menu">...</button>
        </div>

      <div className="view-task-content">
          <TaskInput onItemClick={handleItemClick} />
      </div>
    </div>
  )
}

export default ViewTasks
