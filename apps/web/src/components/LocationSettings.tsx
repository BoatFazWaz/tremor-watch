import { Card } from './ui/Card';
import { SettingsIcon } from './icons';
import { THAI_REGIONS } from '../constants/locations';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react';

// Add custom styles for the date picker
import "./date-picker.css";

interface LocationSettingsProps {
  latitude: number;
  longitude: number;
  radius: number;
  timeRange: string;
  limit: number;
  onLatitudeChange: (value: number) => void;
  onLongitudeChange: (value: number) => void;
  onRadiusChange: (value: number) => void;
  onTimeRangeChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  onRefresh?: () => void;
}

export const LocationSettings: React.FC<LocationSettingsProps> = ({
  latitude,
  longitude,
  radius,
  timeRange,
  limit,
  onLatitudeChange,
  onLongitudeChange,
  onRadiusChange,
  onTimeRangeChange,
  onLimitChange,
  onRefresh
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [localRadius, setLocalRadius] = useState(radius);

  // Update local radius when prop changes
  useEffect(() => {
    setLocalRadius(radius);
  }, [radius]);

  const handleRadiusChange = (value: number) => {
    setLocalRadius(value);
    onRadiusChange(value);
  };

  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      const diffHours = Math.abs(update[1].getTime() - update[0].getTime()) / 36e5;
      if (diffHours <= 1) {
        onTimeRangeChange('1h');
      } else if (diffHours <= 24) {
        onTimeRangeChange('24h');
      } else if (diffHours <= 168) { // 7 days
        onTimeRangeChange('7d');
      } else {
        onTimeRangeChange('30d');
      }
      // Trigger refetch after updating the time range
      onRefresh?.();
    }
  };

  const handleRegionSelect = (lat: number, lng: number) => {
    onLatitudeChange(lat);
    onLongitudeChange(lng);
  };

  const isSelectedRegion = (lat: number, lng: number) => {
    return Math.abs(latitude - lat) < 0.0001 && Math.abs(longitude - lng) < 0.0001;
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLatitudeChange(position.coords.latitude);
          onLongitudeChange(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const getCurrentSelectedRegion = () => {
    const selectedRegion = THAI_REGIONS.find(region => 
      isSelectedRegion(region.latitude, region.longitude)
    );
    return selectedRegion ? `${selectedRegion.latitude},${selectedRegion.longitude}` : '';
  };

  const handleRegionChange = (value: string) => {
    if (value === 'current') {
      handleGetCurrentLocation();
      return;
    }
    
    if (value) {
      const [lat, lng] = value.split(',').map(Number);
      handleRegionSelect(lat, lng);
    }
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon />
          <h2 className="text-lg font-semibold text-gray-900">Location Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Preset Regions Section */}
          <div>
            <div className="flex gap-2">
              <button
                onClick={handleGetCurrentLocation}
                className={clsx(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-1.5',
                  'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                )}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                Current Location
              </button>
              <select
                value={getCurrentSelectedRegion()}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Region</option>
                {THAI_REGIONS.map((region) => (
                  <option 
                    key={region.name} 
                    value={`${region.latitude},${region.longitude}`}
                  >
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coordinates and Radius Section */}
          <div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  value={latitude}
                  onChange={(e) => onLatitudeChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter latitude"
                  step="0.0001"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  value={longitude}
                  onChange={(e) => onLongitudeChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter longitude"
                  step="0.0001"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs text-gray-500">
                    Radius
                  </label>
                  <span className="text-xs text-gray-500">
                    {localRadius} km
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    value={localRadius}
                    onChange={(e) => setLocalRadius(Number(e.target.value))}
                    onMouseUp={(e) => onRadiusChange(Number(e.currentTarget.value))}
                    onTouchEnd={(e) => onRadiusChange(Number((e.target as HTMLInputElement).value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    min="100"
                    max="5000"
                    step="100"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[1000, 2000, 5000].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleRadiusChange(value)}
                          className={clsx(
                            "px-1.5 py-0.5 text-xs font-medium rounded-full transition-colors",
                            localRadius === value
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Range and Limit Section */}
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-4">
              <div className="space-y-2">
                <div className="relative">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => handleDateRangeChange(update)}
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
                      onClick={() => {
                        onTimeRangeChange(option.value);
                        const now = new Date();
                        let start = new Date();
                        if (option.value === '1h') start.setHours(now.getHours() - 1);
                        if (option.value === '24h') start.setDate(now.getDate() - 1);
                        if (option.value === '7d') start.setDate(now.getDate() - 7);
                        if (option.value === '14d') start.setDate(now.getDate() - 14);
                        if (option.value === '30d') start.setDate(now.getDate() - 30);
                        setDateRange([start, now]);
                      }}
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
              <select
                id="limit"
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value={50}>50 results</option>
                <option value={100}>100 results</option>
                <option value={200}>200 results</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 