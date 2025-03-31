import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import { Select } from '../ui/Select';
import clsx from 'clsx';
import { useState, useCallback } from 'react';

interface TimeRangeControlProps {
  timeRange: string;
  limit: number;
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (update: [Date | null, Date | null]) => void;
  onTimeRangeChange: (value: string) => void;
  onLimitChange: (value: number) => void;
}

export function TimeRangeControl({
  timeRange,
  limit,
  startDate,
  endDate,
  onDateRangeChange,
  onTimeRangeChange,
  onLimitChange
}: TimeRangeControlProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleTimeRangeButtonClick = (value: string) => {
    onTimeRangeChange(value);
    const now = new Date();
    let start = new Date();
    if (value === '1h') start.setHours(now.getHours() - 1);
    if (value === '24h') start.setDate(now.getDate() - 1);
    if (value === '7d') start.setDate(now.getDate() - 7);
    if (value === '14d') start.setDate(now.getDate() - 14);
    if (value === '30d') start.setDate(now.getDate() - 30);
    onDateRangeChange([start, now]);
  };

  const renderCustomHeader = useCallback(
    ({ date, decreaseMonth, increaseMonth }: any) => {
      return (
        <div className="hidden sm:flex items-center justify-between px-2">
          <button
            onClick={decreaseMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Previous Month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-900">
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={increaseMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Next Month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      );
    },
    []
  );

  const renderMobileHeader = useCallback(
    ({ date, decreaseMonth, increaseMonth }: any) => {
      return (
        <div className="sm:hidden react-datepicker__mobile-header">
          <button
            onClick={() => setIsCalendarOpen(false)}
            className="react-datepicker__mobile-close-button"
            aria-label="Close calendar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={decreaseMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Previous Month"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg font-medium text-gray-900">
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={increaseMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Next Month"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="w-6" /> {/* Spacer to center the month/year */}
        </div>
      );
    },
    []
  );

  return (
    <div className="space-y-4">
      {/* Date Range Picker */}
      <div className="w-full">
        <div className="relative">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              onDateRangeChange(update);
              if (update[0] && update[1]) {
                setIsCalendarOpen(false);
              }
            }}
            onCalendarOpen={() => setIsCalendarOpen(true)}
            onCalendarClose={() => setIsCalendarOpen(false)}
            open={isCalendarOpen}
            isClearable={true}
            placeholderText="Select date range"
            maxDate={new Date()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
            dateFormat="MMM d, yyyy"
            popperClassName="react-datepicker-popper"
            popperPlacement="bottom-start"
            renderCustomHeader={renderMobileHeader}
            showPopperArrow={false}
          />
        </div>
      </div>

      {/* Quick Select Buttons and Results Limit */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Last Hour', value: '1h' },
              { label: 'Last 24h', value: '24h' },
              { label: 'Last 7d', value: '7d' },
              { label: 'Last 14d', value: '14d' },
              { label: 'Last 30d', value: '30d' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleTimeRangeButtonClick(option.value)}
                className={clsx(
                  "px-2 py-1 text-xs font-medium rounded-md transition-colors",
                  timeRange === option.value
                    ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full sm:w-32">
          <Select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={50}>50 results</option>
            <option value={100}>100 results</option>
            <option value={200}>200 results</option>
          </Select>
        </div>
      </div>
    </div>
  );
} 