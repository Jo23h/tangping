import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ProjectForm.css';
import TextSection from './TextSection';
import TaskInput from './TaskInput';

function ProjectForm() {
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState({
    id: 'new',
    name: 'New Project',
    content: ''
  });

  const [projectTitle, setProjectTitle] = useState('New Project');
  const [goalStateContent, setGoalStateContent] = useState('');
  const [currentStateContent, setCurrentStateContent] = useState('');

  const handleCreateNewProject = () => {
    const newProject = {
      id: uuidv4(),
      name: 'New Project',
      goalState: '',
      currentState: '',
      tasks: []
    };
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setProjectTitle('New Project');
    setGoalStateContent('');
    setCurrentStateContent('');
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setProjectTitle(project.name);
    setGoalStateContent(project.goalState || '');
    setCurrentStateContent(project.currentState || '');
  };

  return (
    <div className='project-form-container'>
      {/* Main content area */}
      <div className='project-form-main'>
        {/* Content area */}
        <div className='project-form-content'>
          {/* Project title row with menu */}
          <div className='project-form-title-row'>
            <input
              type='text'
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className='project-form-title-input'
            />
            <span className='project-form-menu-icon'>⋯</span>
          </div>

          {/* Goal state section - child component */}
          <TextSection
            title='Goal state'
            content={goalStateContent}
            onContentChange={setGoalStateContent}
          />

          {/* Current state section - child component */}
          <TextSection
            title='Current state'
            content={currentStateContent}
            onContentChange={setCurrentStateContent}
          />

          {/* Task input - child component */}
          <TaskInput />
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;
