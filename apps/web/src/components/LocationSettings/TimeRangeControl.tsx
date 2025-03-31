import DatePicker from 'react-datepicker';
import { Select } from '../ui/Select';
import clsx from 'clsx';

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

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-4">
        <div className="space-y-2">
          <div className="relative">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => onDateRangeChange(update)}
              isClearable={true}
              placeholderText="Select date range"
              maxDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              dateFormat="MMM d, yyyy"
              calendarClassName="date-picker-custom"
              wrapperClassName="date-picker-wrapper"
            />
          </div>
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
      </div>

      <div className="col-span-2">
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
  );
} 