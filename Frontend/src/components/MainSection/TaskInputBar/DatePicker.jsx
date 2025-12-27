import { useState, forwardRef } from "react"
import DatePickerLib from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.css'
import { CalendarDots, CaretLeft, CaretRight } from '@phosphor-icons/react'

function DatePicker({selectedDate, onDateChange}) {
    const [tempDate, setTempDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const formatDisplayDate = () => {
      if (!selectedDate)
        return null;

      // Parse date in local timezone to avoid off-by-one errors
      const [year, month, day] = selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();
      const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString())
        return 'Today';
      if (date.toDateString() === tomorrow.toDateString())
        return 'Tomorrow';

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    const handleOk = () => {
      if (tempDate) {
        // Format date in local timezone to avoid off-by-one errors
        const year = tempDate.getFullYear();
        const month = String(tempDate.getMonth() + 1).padStart(2, '0');
        const day = String(tempDate.getDate()).padStart(2, '0');
        onDateChange(`${year}-${month}-${day}`);
      };
      setTempDate(null);
      setIsOpen(false);
    }

    const handleClear = () => {
      onDateChange('');
      setTempDate(null);
      setIsOpen(false);
    };

    // Custom button component that forwards ref
    const CustomButton = forwardRef(({ value, onClick }, ref) => (
      <button
        className="date-picker-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
      >
        <CalendarDots size={20} />
        {formatDisplayDate() && <span className="date-text">{formatDisplayDate()}</span>}
      </button>
    ));

  return (
    <div className="date-picker">
        <DatePickerLib
          selected={tempDate || (selectedDate ? (() => {
            const [year, month, day] = selectedDate.split('-').map(Number);
            return new Date(year, month - 1, day);
          })() : null)}
          onChange={(date) => setTempDate(date)}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          shouldCloseOnSelect={false}
          customInput={<CustomButton />}
          dateFormat="MMM d"
          showTimeSelect={false}
          showTimeInput={false}
          timeInputLabel=""
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="custom-calendar-header">
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="calendar-nav-button"
              >
                <CaretLeft size={20} weight="bold" />
              </button>
              <div className="calendar-month-year">
                {date.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="calendar-nav-button"
              >
                <CaretRight size={20} weight="bold" />
              </button>
            </div>
          )}
        >
          <div className="date-picker-actions">
            <button onClick={handleClear} type="button">Clear</button>
            <button onClick={handleOk} type="button">OK</button>
          </div>
        </DatePickerLib>
    </div>
  )
}

export default DatePicker