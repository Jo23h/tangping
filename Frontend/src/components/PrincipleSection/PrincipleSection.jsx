import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PrincipleInputBar from './PrincipleInputBar';
import PrincipleList from './PrincipleList';

function PrincipleSection({ title, onItemClick, selectedItem }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tag, setTag] = useState('#');
  const [description, setDescription] = useState('');
  const [principles, setPrinciples] = useState([]);

  // Update principle memo when selectedItem changes
  useEffect(() => {
    if (selectedItem && selectedItem.memo !== undefined) {
      setPrinciples(prevPrinciples =>
        prevPrinciples.map(principle =>
          principle.id === selectedItem.id
            ? { ...principle, memo: selectedItem.memo }
            : principle
        )
      );
    }
  }, [selectedItem]);

  // Check if there's any content
  const hasContent = () => {
    return principles.length > 0;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tag.trim() && tag !== '#') {
      e.preventDefault();

      // Ensure tag starts with #
      const finalTag = tag.startsWith('#') ? tag : `#${tag}`;

      // Create new principle
      const newPrinciple = {
        id: uuidv4(),
        tag: finalTag,
        description: description
      };
      setPrinciples([...principles, newPrinciple]);
      setTag('#');
      setDescription('');
    }
  };

  const handleTagChange = (e) => {
    let value = e.target.value;
    // Ensure it always starts with #
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    setTag(value);
  };

  const handleDeletePrinciple = (principleId) => {
    const updatedPrinciples = principles.filter(principle => principle.id !== principleId);
    setPrinciples(updatedPrinciples);
  };

  return (
    <div className='principle-section'>
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

      {/* Principle input and list - only show when expanded */}
      {isExpanded && (
        <>
          <PrincipleInputBar
            tag={tag}
            description={description}
            onTagChange={handleTagChange}
            onDescriptionChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Principle list */}
          <PrincipleList
            principles={principles}
            onDelete={handleDeletePrinciple}
            onItemClick={onItemClick}
          />
        </>
      )}
    </div>
  );
}

export default PrincipleSection;
