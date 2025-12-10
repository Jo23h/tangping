import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ProjectForm.css';
import TextSection from './TextSection';

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
      currentState: ''
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
        {/* Top bar */}
        <div className='project-form-topbar'>
          <div className='project-form-topbar-title'>
            {projectTitle}
          </div>
          <div className='project-form-topbar-menu'>
            <span className='project-form-menu-icon'>⋯</span>
          </div>
        </div>

        {/* Content area */}
        <div className='project-form-content'>
          {/* Project title - editable */}
          <input
            type='text'
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className='project-form-title-input'
          />

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
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;
