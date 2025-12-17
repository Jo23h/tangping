import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onDelete, formatDueDate, onItemClick, onTaskEdit }) {
  return (
    <div className='task-list'>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          formatDueDate={formatDueDate}
          onItemClick={onItemClick}
          onTaskEdit={onTaskEdit}
        />
      ))}
    </div>
  );
}

export default TaskList;
