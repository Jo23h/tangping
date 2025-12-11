function NoteList({ notes, onDelete, formatDueDate, onItemClick }) {
  if (notes.length === 0) {
    return null;
  }

  const handleNoteClick = (note) => {
    if (onItemClick) {
      onItemClick(note);
    }
  };

  return (
    <div className='note-list'>
      {notes.map((note) => (
        <div
          key={note.id}
          className='note-item'
          onClick={() => handleNoteClick(note)}
        >
          <span className='note-text'>{note.text}</span>
          {note.dueDate && formatDueDate(note.dueDate) && (
            <span
              className={`note-due-date ${
                formatDueDate(note.dueDate).isOverdue ? 'overdue' : ''
              }`}
            >
              {formatDueDate(note.dueDate).displayText}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className='note-delete-btn'
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
