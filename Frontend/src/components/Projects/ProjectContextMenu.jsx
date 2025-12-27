import { useEffect, useRef } from 'react'
import './ProjectContextMenu.css'

function ProjectContextMenu({ x, y, onClose, onEdit, onDelete, onArchive }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="project-context-menu"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <button
        className="context-menu-item"
        onClick={() => {
          onEdit()
          onClose()
        }}
      >
        Edit
      </button>
      <button
        className="context-menu-item"
        onClick={() => {
          onArchive()
          onClose()
        }}
      >
        Archive
      </button>
      <button
        className="context-menu-item delete"
        onClick={() => {
          onDelete()
          onClose()
        }}
      >
        Delete
      </button>
    </div>
  )
}

export default ProjectContextMenu
