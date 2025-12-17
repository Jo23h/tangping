import TaskInput from '../TaskInputBar/TaskInput';
import './ProjectPage.css';

function ProjectPage({ project, projectTitle, onTitleChange, onItemClick }) {
  return (
    <div className="project-page">
      {/* Project title */}
      <div className='project-title-row'>
        <input
          type='text'
          value={projectTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className='project-title-input'
        />
        <span className='project-menu-icon'>⋯</span>
      </div>

      {/* Project Content */}
      <div className="project-content">
        {/* Task input section with all features */}
        <TaskInput onItemClick={onItemClick} />
      </div>
    </div>
  );
}

export default ProjectPage;
