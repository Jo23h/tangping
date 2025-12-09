import {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

function ProjectForm() {

  const [projects, setProjects] = useState([]);

  const [projectData, setProjectData] = useState({
    goalstate: '',
    currentstate: '',
    keyobstacles: []
  });

  const handleChange = (event) => {
    const {name, value} = event.target;
    setProjectData(input => ({
      ...input, [name]: value
    }));
  };

  const [currentObstacle, setCurrentObstacle] = useState('');

  const handleAddObstacle = () => {
    if (currentObstacle.trim()){
      setProjectData(input => ({
        ...input, keyobstacles: [...input.keyobstacles, currentObstacle]
      }));
      setCurrentObstacle('');
    };
  };

  const handleRemoveObstacle = (index) => {
    setProjectData(prev => ({
      ...prev,
      keyobstacles: prev.keyobstacles.filter((_, i) => i !== index)
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
        keyobstacles: []
      });
      setCurrentObstacle('');
    }
  }

  const handleCancel = () => {
    setProjectData({
      goalstate: '',
      currentstate: '',
      keyobstacles: []
    });
    setCurrentObstacle('');
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
            <label htmlFor='key-obstacles'>Key obstacles</label>
            <div>
              <input
                type='text'
                id='keyobstacles'
                name='keyobstacles'
                value={currentObstacle}
                onChange={(e) => setCurrentObstacle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddObstacle();
                  }
                }}
              />
              <button
                type='button'
                onClick={handleAddObstacle}
              >
                Add Obstacle
              </button>
            </div>

            {/* Display added obstacles */}
            {projectData.keyobstacles.length > 0 && (
              <ul>
                {projectData.keyobstacles.map((obstacle, index) => (
                  <li key={index}>
                    {obstacle}
                    <button
                      type='button'
                      onClick={() => handleRemoveObstacle(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
                <div>
                  <strong>Key Obstacles:</strong>
                  {project.keyobstacles.length > 0 ? (
                    <ul>
                      {project.keyobstacles.map((obstacle, index) => (
                        <li key={index}>{obstacle}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No obstacles listed</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ProjectForm