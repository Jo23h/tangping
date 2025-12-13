import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteList from './NoteList';
import { formatDueDate } from '../Project/TaskSection/AddTask/utils/dateFormatter';

function TextSection({ title, onItemClick, selectedItem }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [notes, setNotes] = useState([]);

  // Update note when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === selectedItem.id
            ? {
                ...note,
                text: selectedItem.text !== undefined ? selectedItem.text : note.text,
                memo: selectedItem.memo !== undefined ? selectedItem.memo : note.memo,
                memoLastModified: selectedItem.memoLastModified
              }
            : note
        )
      );
    }
  }, [selectedItem]);

  // Check if there's any content
  const hasContent = () => {
    return notes.length > 0;
  };

  const handleAddNote = () => {
    // Create new "Untitled" note
    const newNote = {
      id: uuidv4(),
      text: 'Untitled',
      dueDate: ''
    };
    setNotes([...notes, newNote]);

    // Immediately open the note in memo section
    if (onItemClick) {
      onItemClick(newNote);
    }
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
  };

  return (
    <div className='text-section'>
      {/* Section header with collapse arrow and add note icon */}
      <div className='text-section-header'>
        <div
          className='text-section-header-left'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className='text-section-arrow'>
            {isExpanded ? 'v' : '>'}
          </span>
          <h2 className='project-form-section-title'>{title}</h2>
          {!isExpanded && hasContent() && (
            <span className='text-section-ellipsis'>...</span>
          )}
        </div>
        <span
          className='text-section-add-icon'
          onClick={(e) => {
            e.stopPropagation();
            handleAddNote();
          }}
        >
          +
        </span>
      </div>

      {/* Note list - only show when expanded */}
      {isExpanded && (
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          formatDueDate={formatDueDate}
          onItemClick={onItemClick}
        />
      )}
    </div>
  );
}

export default TextSection;
