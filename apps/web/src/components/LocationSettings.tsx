import { Card } from './ui/Card';
import { SettingsIcon } from './icons';
import { THAI_REGIONS } from '../constants/locations';
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
}) => {
  const handleRegionSelect = (lat: number, lng: number) => {
    onLatitudeChange(lat);
    onLongitudeChange(lng);
  };

  const isSelectedRegion = (lat: number, lng: number) => {
    return Math.abs(latitude - lat) < 0.0001 && Math.abs(longitude - lng) < 0.0001;
  };

  return (
    <Card className="lg:col-span-3">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon />
          <h2 className="text-lg font-semibold text-gray-900">Location Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Preset Regions Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preset Regions</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {THAI_REGIONS.map((region) => (
                <button
                  key={region.name}
                  onClick={() => handleRegionSelect(region.latitude, region.longitude)}
                  className={clsx(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isSelectedRegion(region.latitude, region.longitude)
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  )}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          {/* All Other Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
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
              <label className="block text-sm font-medium text-gray-600 mb-1">
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
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Radius (km)
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => onRadiusChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter radius"
                  min="1"
                  max="20000"
                />
                <div className="flex flex-wrap gap-2">
                  {[1000, 2000].map((value) => (
                    <button
                      key={value}
                      onClick={() => onRadiusChange(value)}
                      className={clsx(
                        "px-3 py-1 text-sm font-medium rounded-full transition-colors",
                        radius === value
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      )}
                    >
                      {value} km
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => onTimeRangeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Results Limit
              </label>
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={10}>10 Records</option>
                <option value={25}>25 Records</option>
                <option value={50}>50 Records</option>
                <option value={100}>100 Records</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 