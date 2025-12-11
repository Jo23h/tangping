import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DateSelector from '../Project/TaskSection/AddTask/TaskOptions/DateSelector';
import NoteInputBar from './NoteInputBar';
import NoteList from './NoteList';
import { formatDueDate } from '../Project/TaskSection/AddTask/utils/dateFormatter';

function TextSection({ title, onItemClick, selectedItem }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState([]);

  // Update note memo when selectedItem changes
  useEffect(() => {
    if (selectedItem && selectedItem.memo !== undefined) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === selectedItem.id
            ? { ...note, memo: selectedItem.memo }
            : note
        )
      );
    }
  }, [selectedItem]);

  // Check if there's any content
  const hasContent = () => {
    return notes.length > 0;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && noteText.trim()) {
      e.preventDefault();

      // Create new note
      const newNote = {
        id: uuidv4(),
        text: noteText,
        dueDate: dueDate
      };
      setNotes([...notes, newNote]);
      setNoteText('');
      setDueDate('');
      setShowDatePicker(false);
    }
  };

  const handleDateSelect = (date) => {
    setDueDate(date);
    setShowDatePicker(false);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
  };

  return (
    <div className='text-section'>
      {/* Section header with collapse arrow */}
      <div
        className='text-section-header'
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

      {/* Note input and list - only show when expanded */}
      {isExpanded && (
        <>
          <NoteInputBar
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
            onCalendarClick={() => setShowDatePicker(!showDatePicker)}
            dueDate={dueDate}
            formatDueDate={formatDueDate}
          />

          {/* Note list */}
          <NoteList
            notes={notes}
            onDelete={handleDeleteNote}
            formatDueDate={formatDueDate}
            onItemClick={onItemClick}
          />

          {/* Date selector modal */}
          {showDatePicker && (
            <DateSelector
              onDateSelect={handleDateSelect}
              onClose={() => setShowDatePicker(false)}
              initialDate={dueDate ? new Date(dueDate) : null}
            />
          )}
        </>
      )}
    </div>
  );
}

export default TextSection;
