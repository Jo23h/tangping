import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onDelete, formatDueDate, onItemClick, onTaskEdit, onCreateMemo }) {
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
          onCreateMemo={onCreateMemo}
        />
      ))}
    </div>
  );
}

export default TaskList;
