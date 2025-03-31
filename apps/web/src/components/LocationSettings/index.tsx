import { useState } from 'react';
import { Card } from '../ui/Card';
import { SettingsIcon, ChevronDownIcon, ChevronUpIcon } from '../icons';
import { useLocationSettings } from '../../hooks/useLocationSettings';
import { RegionSelector } from './RegionSelector';
import { CoordinatesControl } from './CoordinatesControl';
import { TimeRangeControl } from './TimeRangeControl';
import { THAI_REGIONS } from '../../constants/locations';
import clsx from 'clsx';

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

function formatTimeRange(timeRange: string): string {
  switch (timeRange) {
    case '1h': return 'Last Hour';
    case '24h': return 'Last 24h';
    case '7d': return 'Last 7 Days';
    case '14d': return 'Last 14 Days';
    case '30d': return 'Last 30 Days';
    default: return timeRange;
  }
}

function getRegionName(latitude: number, longitude: number): string {
  const region = THAI_REGIONS.find(r => 
    Math.abs(r.latitude - latitude) < 0.0001 && 
    Math.abs(r.longitude - longitude) < 0.0001
  );
  return region ? region.name : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function LocationSettings({
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
}: LocationSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    dateRange,
    startDate,
    endDate,
    localRadius,
    handleDateRangeChange,
    handleRadiusChange,
    handleGetCurrentLocation,
    getCurrentSelectedRegion,
    handleRegionChange,
  } = useLocationSettings({
    latitude,
    longitude,
    radius,
    timeRange,
    onLatitudeChange,
    onLongitudeChange,
    onRadiusChange,
    onTimeRangeChange,
    onRefresh
  });

  return (
    <Card>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Location Settings</h2>
          </div>
          {/* Toggle button only visible on mobile */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
            aria-label={isExpanded ? 'collapse location controls' : 'expand location controls'}
          >
            <span>{isExpanded ? 'Close Controls' : 'Location Controls'}</span>
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile Summary (shown when collapsed) */}
        {!isExpanded && (
          <div className="md:hidden space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Location:</span>
              <span className="text-gray-900">{getRegionName(latitude, longitude)}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Radius:</span>
                <span className="text-gray-900">{radius} km</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Time:</span>
                <span className="text-gray-900">{formatTimeRange(timeRange)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Settings Content - Always visible on desktop, collapsible on mobile */}
        <div className={clsx(
          "space-y-4",
          "md:block", // Always visible on desktop
          // Mobile styles
          "block md:!block", // Force block on desktop regardless of isExpanded
          !isExpanded && "hidden" // Only hide on mobile when collapsed
        )}>
          {/* Preset Regions Section */}
          <RegionSelector
            selectedRegion={getCurrentSelectedRegion()}
            onRegionChange={handleRegionChange}
            onGetCurrentLocation={handleGetCurrentLocation}
          />

          {/* Coordinates and Radius Section */}
          <CoordinatesControl
            latitude={latitude}
            longitude={longitude}
            radius={radius}
            localRadius={localRadius}
            onLatitudeChange={onLatitudeChange}
            onLongitudeChange={onLongitudeChange}
            onLocalRadiusChange={(value) => handleRadiusChange(value)}
            onRadiusChange={handleRadiusChange}
          />

          {/* Time Range and Limit Section */}
          <TimeRangeControl
            timeRange={timeRange}
            limit={limit}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onTimeRangeChange={onTimeRangeChange}
            onLimitChange={onLimitChange}
          />
        </div>
      </div>
    </Card>
  );
} 