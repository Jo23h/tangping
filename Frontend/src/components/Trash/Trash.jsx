import { useState, useEffect } from 'react'
import './Trash.css'
import * as projectService from '../../services/projectService'
import * as taskService from '../../services/taskService'

function Trash() {
  const [deletedProjects, setDeletedProjects] = useState([])
  const [deletedTasks, setDeletedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDeletedItems()
  }, [])

  const fetchDeletedItems = async () => {
    try {
      const [projects, tasks] = await Promise.all([
        projectService.getDeletedProjects(),
        taskService.getDeletedTasks()
      ])
      setDeletedProjects(projects)
      setDeletedTasks(tasks)
    } catch (error) {
      console.error('Error fetching deleted items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#d32f2f'
      case 'medium':
        return '#f57c00'
      case 'low':
        return '#1976d2'
      default:
        return '#9e9e9e'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      case 'low':
        return 'Low'
      default:
        return 'None'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="trash-container">
        <div className="trash-content">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="trash-container">
      <div className="trash-header">
        <h1>Trash</h1>
      </div>

      <div className="trash-content">
        <h2 className="trash-section-title">Deleted Projects</h2>
        {deletedProjects.length === 0 ? (
          <div className="trash-empty">
            <p>No deleted projects</p>
          </div>
        ) : (
          <table className="trash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Priority</th>
                <th>Deleted On</th>
              </tr>
            </thead>
            <tbody>
              {deletedProjects.map((project) => (
                <tr key={project._id} className="trash-row">
                  <td className="trash-name-cell">{project.name}</td>
                  <td
                    className="trash-priority-cell"
                    style={{ color: getPriorityColor(project.priority) }}
                  >
                    {getPriorityText(project.priority)}
                  </td>
                  <td className="trash-date-cell">{formatDate(project.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="trash-section-title">Deleted Tasks</h2>
        {deletedTasks.length === 0 ? (
          <div className="trash-empty">
            <p>No deleted tasks</p>
          </div>
        ) : (
          <table className="trash-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Deleted On</th>
              </tr>
            </thead>
            <tbody>
              {deletedTasks.map((task) => (
                <tr key={task._id} className="trash-row">
                  <td className="trash-name-cell">{task.text}</td>
                  <td
                    className="trash-priority-cell"
                    style={{ color: getPriorityColor(task.priority) }}
                  >
                    {getPriorityText(task.priority)}
                  </td>
                  <td className="trash-date-cell">{formatDate(task.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Trash
