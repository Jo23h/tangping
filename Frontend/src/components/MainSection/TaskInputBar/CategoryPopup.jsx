import { useState, useEffect } from 'react'
import { Archive, MagnifyingGlass } from '@phosphor-icons/react'
import './CategoryPopup.css'

function CategoryPopup({ isOpen, onClose, onSelectCategory, selectedCategoryId, projects }) {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const inbox = projects.find(p => p.isInbox)
  const regularProjects = projects.filter(p => !p.isInbox)

  const filteredProjects = regularProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="category-popup-overlay" onClick={onClose}>
      <div className="category-popup" onClick={(e) => e.stopPropagation()}>
        <div className="category-popup-header">
          <h3>Select Category</h3>
          <button className="category-popup-close" onClick={onClose}>×</button>
        </div>

        <div className="category-search">
          <MagnifyingGlass size={18} weight="light" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="category-list">
          {inbox && (
            <button
              className={`category-item ${selectedCategoryId === inbox._id ? 'selected' : ''}`}
              onClick={() => {
                onSelectCategory(inbox._id, inbox.name)
                onClose()
              }}
            >
              <Archive weight="light" size={18} />
              <span>Inbox</span>
            </button>
          )}

          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <button
                key={project._id}
                className={`category-item ${selectedCategoryId === project._id ? 'selected' : ''}`}
                onClick={() => {
                  onSelectCategory(project._id, project.name)
                  onClose()
                }}
              >
                <span>{project.name}</span>
              </button>
            ))
          ) : (
            searchTerm && (
              <div className="category-no-results">No projects found</div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPopup
