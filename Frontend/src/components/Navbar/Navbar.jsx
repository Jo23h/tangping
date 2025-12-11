import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [selectedItem, setSelectedItem] = useState('inbox');

  return (
    <div className='navbar'>
      {/* Main Navigation */}
      <nav className='navbar-main'>
        <div
          className={`navbar-item ${selectedItem === 'inbox' ? 'active' : ''}`}
          onClick={() => setSelectedItem('inbox')}
        >
          <span className='navbar-icon'>📥</span>
          <span className='navbar-label'>Inbox</span>
          <span className='navbar-count'>11</span>
        </div>
      </nav>

      {/* Lists Section */}
      <div className='navbar-section'>
        <div className='navbar-section-header'>Lists</div>

        <div className='navbar-item'>
          <span className='navbar-icon'>☰</span>
          <span className='navbar-label'>My Todoist</span>
          <span className='navbar-count'>5</span>
        </div>

        <div className='navbar-item'>
          <span className='navbar-icon'>📋</span>
          <span className='navbar-label'>躺平</span>
          <span className='navbar-dot blue'></span>
          <span className='navbar-count'>2</span>
        </div>

        <div className='navbar-item'>
          <span className='navbar-icon'>👋</span>
          <span className='navbar-label'>Welcome</span>
          <span className='navbar-count'>10</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className='navbar-section'>
        <div className='navbar-section-header'>Filters</div>
        <div className='navbar-section-description'>
          Display tasks filtered by list, date, priority, tag, and more
        </div>
      </div>

      {/* Tags Section */}
      <div className='navbar-section'>
        <div className='navbar-section-header'>Tags</div>

        <div className='navbar-item'>
          <span className='navbar-icon'>🏷️</span>
          <span className='navbar-label'>Best</span>
          <span className='navbar-dot yellow'></span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='navbar-bottom'>
        <div className='navbar-item'>
          <span className='navbar-icon'>✓</span>
          <span className='navbar-label'>Completed</span>
        </div>

        <div className='navbar-item'>
          <span className='navbar-icon'>🗑️</span>
          <span className='navbar-label'>Trash</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className='navbar-actions'>
        <button className='navbar-action-btn'>
          <span>🔄</span>
        </button>
        <button className='navbar-action-btn'>
          <span>🔔</span>
        </button>
        <button className='navbar-action-btn'>
          <span>?</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
