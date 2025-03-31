import { Card } from '../ui/Card';
import { SettingsIcon } from '../icons';
import { useLocationSettings } from '../../hooks/useLocationSettings';
import { RegionSelector } from './RegionSelector';
import { CoordinatesControl } from './CoordinatesControl';
import { TimeRangeControl } from './TimeRangeControl';

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
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon />
          <h2 className="text-lg font-semibold text-gray-900">Location Settings</h2>
        </div>

        <div className="space-y-4">
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