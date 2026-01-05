import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import './ProjectView.css'
import ViewTasks from '../MainSection/ViewTasks/ViewTasks'
import * as projectService from '../../services/projectService'

function ProjectView({ onTaskSelect, onTaskUpdate, onCreateMemo }) {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    fetchProject()
  }, [id])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const fetchProject = async () => {
    try {
      const data = await projectService.getProject(id)
      setProject(data)
      setEditName(data.name)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameClick = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editName.trim() && editName !== project.name) {
      try {
        const updatedProject = await projectService.updateProject(id, {
          name: editName.trim(),
          priority: project.priority
        })
        setProject(updatedProject)
      } catch (error) {
        console.error('Error updating project name:', error)
        setEditName(project.name)
      }
    } else {
      setEditName(project.name)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSave()
    } else if (event.key === 'Escape') {
      setEditName(project.name)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  if (isLoading) {
    return (
      <div className="project-view-container">
        <p>Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-view-container">
        <p>Project not found</p>
      </div>
    )
  }

  return (
    <div className="project-view-container">
      <div className="project-view-header">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="project-name-input"
            maxLength={120}
          />
        ) : (
          <h1 onClick={handleNameClick} className="project-name">
            {project.name}
          </h1>
        )}
      </div>
      <ViewTasks
        projectId={id}
        onTaskSelect={onTaskSelect}
        onTaskUpdate={onTaskUpdate}
        onCreateMemo={onCreateMemo}
      />
    </div>
  )
}

export default ProjectView
