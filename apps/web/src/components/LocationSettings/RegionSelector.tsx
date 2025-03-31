import { THAI_REGIONS } from '../../constants/locations';
import { Select } from '../ui/Select';
import clsx from 'clsx';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  onGetCurrentLocation: () => void;
}

export function RegionSelector({ selectedRegion, onRegionChange, onGetCurrentLocation }: RegionSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onGetCurrentLocation}
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
      <Select
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="flex-1"
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
      </Select>
    </div>
  );
} 