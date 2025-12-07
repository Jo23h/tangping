import {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

function TaskForm() {

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        taskName: '',
        description: '',
        date: '',
        priority: '',
        category: ''
    });

    const handleChange = (event) => {
      const {name, value} = event.target;
      setNewTask(previousInput => ({
        ...previousInput, 
        [name]: value
      }));
    };

    const [manualPriority, setManualPriority] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newTask.taskName.trim()){
          const addNewTaskWithId = {
            ...newTask, 
            id: uuidv4(),
            createdAt: new Date().toISOString()
          };
        };

        setTasks([...tasks, addNewTaskWithId]); 

        setNewTask({
          taskName: '',
          description: '',
          date: '',
          priority: '',
          category: ''
        });
    };

    const handleCancel = () => {
      setNewTask({
        taskName: '',
        description: '',
        date: '',
        priority: '',
        category: ''
      });
    };

  return (
    <main>
      <form onSubmit={handleSubmit}>

        {/* Header section - Task name and description */}
        <div className = 'header'>
          <div>
            <label htmlFor='task-name'>Task name</label>
            <input 
              type = 'text'
              id = 'task'
              name = 'taskName'
              value = {newTask.taskName}
              onChange = {handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor='description'>Description</label>
            <input 
              type = 'text'
              id = 'description'
              name = 'description'
              value = {newTask.description}
              onChange = {handleChange}
            />
          </div>
        </div>

        {/* Middle row - Date and priority */}
        <div className = 'middle-row'>

          {/* (WIP) Date */}
          <button type = 'button'>
            Date
          </button>

          {/* Priority */}
          <select
            id = 'priority'
            name = 'priority'
            value = {newTask.priority}
            onChange = {handleChange}
          >
            <option value = 'priority-high'>Priority: High</option>
            <option value = 'priority-medium'>Priority: Medium</option>
            <option value = 'priority-low'>Priority: Low</option>
          </select>
        </div>

        {/* Footer section - Category, cancel and add task */}
        <div className = 'footer'>

          {/* Category */}
          <select
            id = 'category'
            name = 'category'
            value = {newTask.category}
            onChange = {handleChange}
          >
            <option value = 'inbox'>Inbox</option>
            <option value = 'placeholder'>Placeholder</option>
          </select>

          {/* Cancel */}
          <button
            type = 'button'
            onClick = {handleCancel}
          >
            Cancel
          </button>

          {/* Add task */}
          <button type = 'submit'>
            Add task
          </button>
        </div>
       

      </form>
    </main>
  )
}

export default TaskForm