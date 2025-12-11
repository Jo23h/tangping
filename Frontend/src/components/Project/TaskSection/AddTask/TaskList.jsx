import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onDelete, formatDueDate }) {
  return (
    <div className='task-list'>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          formatDueDate={formatDueDate}
        />
      ))}
    </div>
  );
}

export default TaskList;
