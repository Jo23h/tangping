import React, { useRef, useState, useEffect } from 'react';
import MemoPreview from './MemoPreview';
import MemoTextarea from './MemoTextarea';
import PrincipleDropdown from './PrincipleDropdown';

function MemoContentEditor({ id, memo, onMemoChange, principles, onPrincipleCreate }) {
  const textareaRef = useRef(null);
  const [showPrincipleDropdown, setShowPrincipleDropdown] = useState(false);
  const [principleFilter, setPrincipleFilter] = useState('');
  const [principleStartPos, setPrincipleStartPos] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Update dropdown position calculation
  const updateDropdownPosition = () => {
    if (textareaRef.current && textareaRef.current.getBoundingClientRect) {
      const rect = textareaRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + 20
      });
    }
  };

  const handleMemoChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Detect # for principle autocomplete
    if (value[cursorPos - 1] === '#') {
      setPrincipleStartPos(cursorPos - 1);
      setPrincipleFilter('');
      setShowPrincipleDropdown(true);
      setTimeout(updateDropdownPosition, 0);
    } else if (showPrincipleDropdown) {
      // Update filter as user types
      const textAfterHash = value.substring(principleStartPos + 1, cursorPos);
      const spaceIndex = textAfterHash.indexOf(' ');

      if (spaceIndex !== -1 || textAfterHash.includes('\n')) {
        setShowPrincipleDropdown(false);
      } else {
        setPrincipleFilter(textAfterHash);
      }
    }

    onMemoChange(id, value);
  };

  const insertPrinciple = (principleTag) => {
    const currentMemo = memo || '';
    const beforeHash = currentMemo.substring(0, principleStartPos);
    const afterCursor = currentMemo.substring(textareaRef.current.selectionStart);
    const newMemo = beforeHash + principleTag + ' ' + afterCursor;

    onMemoChange(id, newMemo);
    setShowPrincipleDropdown(false);

    // Set cursor position after the inserted tag
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = principleStartPos + principleTag.length + 1;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handlePrincipleSelect = (principle) => {
    insertPrinciple(principle.tag);
  };

  const handleCreateNewPrinciple = () => {
    if (principleFilter.trim() && onPrincipleCreate) {
      const newTag = '#' + principleFilter.trim();
      onPrincipleCreate(principleFilter.trim());
      insertPrinciple(newTag);
    }
  };

  const getFilteredPrinciples = () => {
    if (!principleFilter) return principles;
    return principles.filter(p =>
      p.tag.toLowerCase().includes('#' + principleFilter.toLowerCase())
    );
  };

  const handleMemoKeyDown = (e) => {
    if (showPrincipleDropdown) {
      const filtered = getFilteredPrinciples();
      if (e.key === 'Escape') {
        setShowPrincipleDropdown(false);
        e.preventDefault();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        if (filtered.length > 0) {
          handlePrincipleSelect(filtered[0]);
          e.preventDefault();
        } else if (principleFilter.trim()) {
          handleCreateNewPrinciple();
          e.preventDefault();
        }
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPrincipleDropdown && textareaRef.current) {
        const dropdown = document.querySelector('.memo-principle-dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
          setShowPrincipleDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPrincipleDropdown]);

  return (
    <div className='memo-content'>
      <MemoPreview memo={memo} />

      <MemoTextarea
        ref={textareaRef}
        memo={memo}
        onChange={handleMemoChange}
        onKeyDown={handleMemoKeyDown}
      />

      {showPrincipleDropdown && (
        <PrincipleDropdown
          principles={principles}
          filter={principleFilter}
          onSelect={handlePrincipleSelect}
          onCreate={handleCreateNewPrinciple}
          position={dropdownPosition}
        />
      )}
    </div>
  );
}

export default MemoContentEditor;
