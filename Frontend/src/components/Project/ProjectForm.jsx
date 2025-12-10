import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ProjectForm.css';

function ProjectForm() {
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState({
    id: 'new',
    name: 'New Project',
    content: ''
  });

  const [projectTitle, setProjectTitle] = useState('New Project');
  const [projectContent, setProjectContent] = useState('');

  const handleCreateNewProject = () => {
    const newProject = {
      id: uuidv4(),
      name: 'New Project',
      content: ''
    };
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setProjectTitle('New Project');
    setProjectContent('');
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setProjectTitle(project.name);
    setProjectContent(project.content || '');
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

          {/* Free-form content area */}
          <textarea
            value={projectContent}
            onChange={(e) => setProjectContent(e.target.value)}
            placeholder='Start typing...'
            className='project-form-content-textarea'
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;
