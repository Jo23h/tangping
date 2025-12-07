import {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

function ProjectForm() {

  const [projects, setProjects] = useState([]);

  const [projectData, setProjectData] = useState({
    goalstate: '',
    currentstate: '',
    keyobstacles: ''
  });

  const handleChange = (event) => {
    const {name, value} = event.target;
    setProjectData(input => ({
      ...input, [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (projectData.goalstate.trim()) {
      const newProject = {
        ...projectData,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };

      setProjects([...projects, newProject]);

      setProjectData({
        goalstate: '',
        currentstate: '',
        keyobstacles: ''
      });
    }
  }

  const handleCancel = () => {
    setProjectData({
      goalstate: '',
      currentstate: '',
      keyobstacles: ''
    });
  };


  return (
    <div>
      <form onSubmit = {handleSubmit}>

        {/* Goal state */}
        <div>
            <label htmlFor ='goal-state'>Goal state</label>
            <input
              type = 'text'
              id = 'goalstate'
              name = 'goalstate'
              value = {projectData.goalstate}
              onChange = {handleChange}
              required
            />
        </div>

        {/* Current state */}
        <div>
            <label htmlFor ='current-state'>Current state</label>
            <input
              type = 'text'
              id = 'currentstate'
              name = 'currentstate'
              value = {projectData.currentstate}
              onChange = {handleChange}
            />
        </div>

        {/* Key obstacles */}
        <div>
            <label htmlFor ='key-obstacles'>Key obstacles</label>
            <input
              type = 'text'
              id = 'keyobstacles'
              name = 'keyobstacles'
              value = {projectData.keyobstacles}
              onChange = {handleChange}
            />
        </div>

        {/* Cancel and submit button */}
        <button
          type = 'button'
          onClick = {handleCancel}
        >
          Cancel
        </button>

        <button
          type = 'submit'
          onClick = {handleSubmit}
        >
          Submit
        </button>

      </form>

      {/* Display submitted projects */}
      <div className='projects-list'>
        <h2>Created Projects</h2>
        {projects.length === 0 ? (
          <p>No projects created yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <p><strong>Goal State:</strong> {project.goalstate}</p>
                <p><strong>Current State:</strong> {project.currentstate}</p>
                <p><strong>Key Obstacles:</strong> {project.keyobstacles}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ProjectForm