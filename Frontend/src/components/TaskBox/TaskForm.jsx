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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newTask.taskName.trim()){
          const assignTaskId = {
            ...newTask, 
            id: uuidv4(),
            createdAt: new Date().toISOString()
          };
        };

        setTasks([...tasks, assignTaskId]); 

        setNewTask({
          taskName: '',
          description: '',
          date: '',
          priority: '',
          category: ''
        });
    };

  return (
    <div>addTask</div>
  )
}

export default TaskForm