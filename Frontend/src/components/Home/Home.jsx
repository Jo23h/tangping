import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import * as taskService from '../../services/taskService';
import * as projectService from '../../services/projectService';

function Home() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskFilter, setTaskFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAllTasks(),
        projectService.getAllProjects()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    if (taskFilter === 'all') {
      return tasks.filter(task => !task.isDeleted && !task.isCompleted);
    }

    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return tasks.filter(task => {
      if (task.isDeleted || task.isCompleted || !task.dueDate) return false;

      const dueDate = new Date(task.dueDate);
      const timeUntilDue = dueDate - now;

      if (taskFilter === 'due-soon') {
        return timeUntilDue >= 0 && timeUntilDue <= threeDays;
      } else if (taskFilter === 'upcoming') {
        return timeUntilDue > threeDays && timeUntilDue <= sevenDays;
      }
      return false;
    });
  };

  const getFilteredProjects = () => {
    const activeProjects = projects.filter(p => !p.isDeleted && !p.isArchived && p.name !== 'Inbox');

    if (projectFilter === 'all') {
      return activeProjects;
    }
    return activeProjects.filter(p => p.priority === projectFilter);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa500';
      case 'low': return '#4dabf7';
      default: return '#adb5bd';
    }
  };

  const filteredTasks = getFilteredTasks();
  const filteredProjects = getFilteredProjects();

  if (loading) {
    return (
      <div className="home">
        <div className="home-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>Home</h1>
      </div>

      <div className="home-content">
        {/* Tasks Table */}
        <div className="home-section">
          <div className="section-header">
            <h2>Tasks</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${taskFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTaskFilter('all')}
              >
                All Tasks
              </button>
              <button
                className={`filter-btn ${taskFilter === 'due-soon' ? 'active' : ''}`}
                onClick={() => setTaskFilter('due-soon')}
              >
                Due Soon
              </button>
              <button
                className={`filter-btn ${taskFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setTaskFilter('upcoming')}
              >
                Upcoming
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr key={task._id} onClick={() => navigate('/dashboard')}>
                      <td className="task-name">{task.text}</td>
                      <td className="project-name">
                        {projects.find(p => p._id === task.projectId)?.name || 'Inbox'}
                      </td>
                      <td className="due-date">{formatDate(task.dueDate)}</td>
                      <td>
                        {task.priority && (
                          <span
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                          >
                            {task.priority}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Table */}
        <div className="home-section">
          <div className="section-header">
            <h2>Projects</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`}
                onClick={() => setProjectFilter('all')}
              >
                All Projects
              </button>
              <button
                className={`filter-btn ${projectFilter === 'high' ? 'active' : ''}`}
                onClick={() => setProjectFilter('high')}
              >
                High Priority
              </button>
              <button
                className={`filter-btn ${projectFilter === 'medium' ? 'active' : ''}`}
                onClick={() => setProjectFilter('medium')}
              >
                Medium Priority
              </button>
              <button
                className={`filter-btn ${projectFilter === 'low' ? 'active' : ''}`}
                onClick={() => setProjectFilter('low')}
              >
                Low Priority
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Tasks (Due Soon / Upcoming / Total)</th>
                  <th>Days Since Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map(project => {
                    const projectTasks = tasks.filter(t => t.projectId === project._id && !t.isDeleted && !t.isCompleted);

                    const now = new Date();
                    const threeDays = 3 * 24 * 60 * 60 * 1000;
                    const sevenDays = 7 * 24 * 60 * 60 * 1000;

                    const dueSoon = projectTasks.filter(t => {
                      if (!t.dueDate) return false;
                      const dueDate = new Date(t.dueDate);
                      const timeUntilDue = dueDate - now;
                      return timeUntilDue >= 0 && timeUntilDue <= threeDays;
                    }).length;

                    const upcoming = projectTasks.filter(t => {
                      if (!t.dueDate) return false;
                      const dueDate = new Date(t.dueDate);
                      const timeUntilDue = dueDate - now;
                      return timeUntilDue > threeDays && timeUntilDue <= sevenDays;
                    }).length;

                    // Calculate days since last change
                    const lastModified = project.lastModified || project.updatedAt || project.createdAt;
                    const daysSinceChange = Math.floor((now - new Date(lastModified)) / (1000 * 60 * 60 * 24));

                    return (
                      <tr key={project._id} onClick={() => navigate(`/projects/${project._id}`)}>
                        <td className="project-name">{project.name}</td>
                        <td>
                          {project.priority && (
                            <span
                              className="priority-badge"
                              style={{ backgroundColor: getPriorityColor(project.priority) }}
                            >
                              {project.priority}
                            </span>
                          )}
                        </td>
                        <td className="task-count">
                          {dueSoon} / {upcoming} / {projectTasks.length}
                        </td>
                        <td className="days-since-change">
                          {daysSinceChange === 0 ? 'Today' : `${daysSinceChange} day${daysSinceChange === 1 ? '' : 's'}`}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
