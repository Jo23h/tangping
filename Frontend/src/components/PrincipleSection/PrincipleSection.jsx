import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PrincipleList from './PrincipleList';
import PrincipleModal from './PrincipleModal';

function PrincipleSection({ title, onItemClick, selectedItem, principles, onPrinciplesChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Update principle when selectedItem changes
  useEffect(() => {
    if (selectedItem && selectedItem.tag && principles) {
      const updatedPrinciples = principles.map(principle =>
        principle.id === selectedItem.id
          ? {
              ...principle,
              tag: selectedItem.tag !== undefined ? selectedItem.tag : principle.tag,
              memo: selectedItem.memo !== undefined ? selectedItem.memo : principle.memo,
              memoLastModified: selectedItem.memoLastModified
            }
          : principle
      );
      onPrinciplesChange(updatedPrinciples);
    }
  }, [selectedItem]);

  const hasContent = () => {
    return principles && principles.length > 0;
  };

  const handleAddPrinciple = () => {
    setShowModal(true);
  };

  const handleSavePrinciples = (selectedPrinciples) => {
    const newPrinciples = [];

    selectedPrinciples.forEach(principle => {
      if (principle.isNew) {
        // Create new principle with proper ID
        const newPrinciple = {
          id: uuidv4(),
          tag: principle.tag,
          description: principle.description || ''
        };
        newPrinciples.push(newPrinciple);
      }
    });

    if (newPrinciples.length > 0) {
      onPrinciplesChange([...principles, ...newPrinciples]);
    }
  };

  const handleDeletePrinciple = (principleId) => {
    const updatedPrinciples = principles.filter(principle => principle.id !== principleId);
    onPrinciplesChange(updatedPrinciples);
  };

  return (
    <div className='principle-section'>
      {/* Section header with collapse arrow and add icon */}
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
            handleAddPrinciple();
          }}
        >
          +
        </span>
      </div>

      {/* Principle list - only show when expanded */}
      {isExpanded && (
        <PrincipleList
          principles={principles}
          onDelete={handleDeletePrinciple}
          onItemClick={onItemClick}
        />
      )}

      {/* Principle Modal */}
      {showModal && (
        <PrincipleModal
          onClose={() => setShowModal(false)}
          onSave={handleSavePrinciples}
          existingPrinciples={principles || []}
        />
      )}
    </div>
  );
}

export default PrincipleSection;
