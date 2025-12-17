import { useState, forwardRef } from "react"
import DatePickerLib from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.css'

function DatePicker({selectedDate, onDateChange}) {
    const [tempDate, setTempDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const formatDisplayDate = () => {
      if (!selectedDate)
        return '📅';
      const date = new Date(selectedDate);
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
        onDateChange(tempDate.toISOString().split('T')[0]);
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
        {formatDisplayDate()}
      </button>
    ));

  return (
    <div className="date-picker">
        <DatePickerLib
          selected={tempDate || (selectedDate ? new Date(selectedDate) : null)}
          onChange={(date) => setTempDate(date)}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          shouldCloseOnSelect={false}
          customInput={<CustomButton />}
          dateFormat="MMM d"
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