import { useState, useRef, useEffect } from 'react'
import { CaretDown, Flag, FolderOpen } from '@phosphor-icons/react'
import './PrioritySelection.css'

function PrioritySelection({
  selectedPriority,
  onPriorityChange,
  selectedCategoryName,
  onCategoryClick
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPriority = (priority) => {
    onPriorityChange(priority)
    setIsOpen(false)
  }

  return (
    <div className="priority-dropdown" ref={dropdownRef}>
      <button
        className="priority-button"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <CaretDown weight="light" size={20} />
      </button>

      {isOpen && (
        <div className="priority-menu">
          <div className="priority-section-title">Priority</div>
          <div className="priority-flags">
            <button
              className={`priority-flag-btn ${selectedPriority === 'high' ? 'selected' : ''}`}
              onClick={() => handleSelectPriority('high')}
              type="button"
            >
              <Flag weight="light" size={20} color="#d32f2f" />
            </button>
            <button
              className={`priority-flag-btn ${selectedPriority === 'medium' ? 'selected' : ''}`}
              onClick={() => handleSelectPriority('medium')}
              type="button"
            >
              <Flag weight="light" size={20} color="#f57c00" />
            </button>
            <button
              className={`priority-flag-btn ${selectedPriority === 'low' ? 'selected' : ''}`}
              onClick={() => handleSelectPriority('low')}
              type="button"
            >
              <Flag weight="light" size={20} color="#1976d2" />
            </button>
            <button
              className={`priority-flag-btn ${selectedPriority === 'none' ? 'selected' : ''}`}
              onClick={() => handleSelectPriority('none')}
              type="button"
            >
              <Flag weight="light" size={20} color="#9e9e9e" />
            </button>
          </div>
          <div className="priority-divider"></div>
          <div className="priority-section-title">Category</div>
          <button
            className="priority-option category-option"
            onClick={() => {
              onCategoryClick()
              setIsOpen(false)
            }}
            type="button"
          >
            <FolderOpen weight="light" size={18} />
            <span>{selectedCategoryName || 'Select Category'}</span>
            <span className="priority-option-arrow">›</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default PrioritySelection
