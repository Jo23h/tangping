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
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [projectFilter, setProjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [taskPage, setTaskPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const itemsPerPage = 5;

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
    let filtered;

    if (taskFilter === 'all') {
      filtered = tasks.filter(task => !task.isDeleted && !task.isCompleted);
    } else {
      const now = new Date();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      filtered = tasks.filter(task => {
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
    }

    // Apply priority filter if set
    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    return filtered;
  };

  const getFilteredProjects = () => {
    const activeProjects = projects.filter(p => !p.isDeleted && !p.isArchived && p.name !== 'Inbox');

    let filtered;
    if (projectFilter === 'all') {
      filtered = activeProjects;
    } else {
      filtered = activeProjects.filter(p => p.priority === projectFilter);
    }

    // Sort by priority first, then by days since change (higher days first)
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const now = new Date();

    return filtered.sort((a, b) => {
      // First, sort by priority
      const priorityA = priorityOrder[a.priority] || 4;
      const priorityB = priorityOrder[b.priority] || 4;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same priority, sort by days since change (descending - higher days first)
      const lastModifiedA = a.lastModified || a.updatedAt || a.createdAt;
      const lastModifiedB = b.lastModified || b.updatedAt || b.createdAt;
      const daysSinceA = Math.floor((now - new Date(lastModifiedA)) / (1000 * 60 * 60 * 24));
      const daysSinceB = Math.floor((now - new Date(lastModifiedB)) / (1000 * 60 * 60 * 24));

      return daysSinceB - daysSinceA; // Higher days first
    });
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
      case 'medium': return '#4dabf7';
      case 'low': return '#9e9e9e'; // Gray color for low priority
      default: return null;
    }
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return '#2e3338'; // default black

    const now = new Date();
    const due = new Date(dueDate);
    const timeUntilDue = due - now;
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (timeUntilDue >= 0 && timeUntilDue <= threeDays) {
      return '#ff6b6b'; // Red for due soon
    } else if (timeUntilDue > threeDays && timeUntilDue <= sevenDays) {
      return '#4dabf7'; // Blue for upcoming
    }
    return '#2e3338'; // Black for others
  };

  const filteredTasks = getFilteredTasks();
  const filteredProjects = getFilteredProjects();

  // Pagination
  const totalTaskPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const totalProjectPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const paginatedTasks = filteredTasks.slice(
    (taskPage - 1) * itemsPerPage,
    taskPage * itemsPerPage
  );

  const paginatedProjects = filteredProjects.slice(
    (projectPage - 1) * itemsPerPage,
    projectPage * itemsPerPage
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setTaskPage(1);
  }, [taskFilter, priorityFilter]);

  useEffect(() => {
    setProjectPage(1);
  }, [projectFilter]);

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
              <div className="priority-filter-container">
                <button
                  className={`filter-btn ${priorityFilter ? 'active' : ''}`}
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                >
                  {priorityFilter ? `Priority: ${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}` : 'Priority'}
                </button>
                {priorityFilter && (
                  <button
                    className="filter-clear-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriorityFilter(null);
                      setShowPriorityDropdown(false);
                    }}
                    title="Clear priority filter"
                  >
                    ×
                  </button>
                )}
                {showPriorityDropdown && (
                  <div className="priority-dropdown">
                    <button onClick={() => { setPriorityFilter('high'); setShowPriorityDropdown(false); }}>
                      High
                    </button>
                    <button onClick={() => { setPriorityFilter('medium'); setShowPriorityDropdown(false); }}>
                      Medium
                    </button>
                    <button onClick={() => { setPriorityFilter('low'); setShowPriorityDropdown(false); }}>
                      Low
                    </button>
                  </div>
                )}
              </div>
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
                {paginatedTasks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  paginatedTasks.map(task => (
                    <tr key={task._id} onClick={() => navigate('/dashboard')}>
                      <td className="task-name">{task.text}</td>
                      <td className="project-name">
                        {projects.find(p => p._id === task.projectId)?.name || 'Inbox'}
                      </td>
                      <td className="due-date" style={{ color: getDueDateColor(task.dueDate) }}>
                        {formatDate(task.dueDate)}
                      </td>
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

          {totalTaskPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setTaskPage(p => Math.max(1, p - 1))}
                disabled={taskPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {taskPage} of {totalTaskPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setTaskPage(p => Math.min(totalTaskPages, p + 1))}
                disabled={taskPage === totalTaskPages}
              >
                Next
              </button>
            </div>
          )}
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
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map(project => {
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

          {totalProjectPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setProjectPage(p => Math.max(1, p - 1))}
                disabled={projectPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {projectPage} of {totalProjectPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setProjectPage(p => Math.min(totalProjectPages, p + 1))}
                disabled={projectPage === totalProjectPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
