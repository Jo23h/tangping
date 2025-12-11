import { useState } from 'react';
import './DateSelector.css';

function DateSelector({ onDateSelect, onClose, initialDate }) {
  const [selectedDate, setSelectedDate] = useState(initialDate || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Date');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const handleQuickDate = (daysToAdd) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
    setCurrentMonth(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const handleOK = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onDateSelect(formattedDate);
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedDate(null);
    onDateSelect('');
    onClose();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className='date-selector-overlay' onClick={onClose}>
      <div className='date-selector' onClick={(e) => e.stopPropagation()}>
        {/* Date content */}
        {true && (
          <>
            {/* Quick date buttons */}
            <div className='date-quick-buttons'>
              <button className='date-quick-btn' onClick={handleToday} title='Today'>
                ☀️
              </button>
              <button className='date-quick-btn' onClick={() => handleQuickDate(1)} title='Tomorrow'>
                🌅
              </button>
              <button className='date-quick-btn' onClick={() => handleQuickDate(7)} title='+7 days'>
                📅 +7
              </button>
              <button className='date-quick-btn' onClick={() => handleQuickDate(14)} title='+14 days'>
                🌙
              </button>
            </div>

            {/* Calendar header */}
            <div className='date-calendar-header'>
              <span className='date-month-year'>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <div className='date-nav-buttons'>
                <button className='date-nav-btn' onClick={handlePrevMonth}>‹</button>
                <button className='date-nav-btn' onClick={handleToday}>○</button>
                <button className='date-nav-btn' onClick={handleNextMonth}>›</button>
              </div>
            </div>

            {/* Calendar */}
            <div className='date-calendar'>
              <div className='date-weekdays'>
                <div className='date-weekday'>S</div>
                <div className='date-weekday'>M</div>
                <div className='date-weekday'>T</div>
                <div className='date-weekday'>W</div>
                <div className='date-weekday'>T</div>
                <div className='date-weekday'>F</div>
                <div className='date-weekday'>S</div>
              </div>
              <div className='date-days'>
                {days.map((dayObj, index) => (
                  <button
                    key={index}
                    className={`date-day ${!dayObj.isCurrentMonth ? 'other-month' : ''}
                                ${isSameDay(dayObj.date, today) ? 'today' : ''}
                                ${isSameDay(dayObj.date, selectedDate) ? 'selected' : ''}`}
                    onClick={() => handleDateClick(dayObj.date)}
                  >
                    {dayObj.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional options */}
            <div className='date-options'>
              <button className='date-option'>
                <span>🕐 Time</span>
                <span>›</span>
              </button>
              <button className='date-option'>
                <span>⏰ Reminder</span>
                <span>›</span>
              </button>
            </div>
          </>
        )}

        {/* Bottom buttons */}
        <div className='date-selector-actions'>
          <button className='date-clear-btn' onClick={handleClear}>Clear</button>
          <button className='date-ok-btn' onClick={handleOK}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default DateSelector;
