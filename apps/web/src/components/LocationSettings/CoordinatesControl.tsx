import { Input } from '../ui/Input';
import clsx from 'clsx';

interface CoordinatesControlProps {
  latitude: number;
  longitude: number;
  radius: number;
  localRadius: number;
  onLatitudeChange: (value: number) => void;
  onLongitudeChange: (value: number) => void;
  onLocalRadiusChange: (value: number) => void;
  onRadiusChange: (value: number) => void;
}

export function CoordinatesControl({
  latitude,
  longitude,
  radius,
  localRadius,
  onLatitudeChange,
  onLongitudeChange,
  onLocalRadiusChange,
  onRadiusChange
}: CoordinatesControlProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2" data-testid="coordinates-control">
      <div>
        <Input
          label="Latitude"
          type="number"
          value={latitude}
          onChange={(e) => onLatitudeChange(Number(e.target.value))}
          placeholder="Enter latitude"
          step="0.0001"
        />
      </div>
      <div>
        <Input
          label="Longitude"
          type="number"
          value={longitude}
          onChange={(e) => onLongitudeChange(Number(e.target.value))}
          placeholder="Enter longitude"
          step="0.0001"
        />
      </div>
      <div className="col-span-2 md:col-span-1" data-testid="radius-section">
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
            onChange={(e) => onLocalRadiusChange(Number(e.target.value))}
            onMouseUp={(e) => onRadiusChange(Number(e.currentTarget.value))}
            onTouchEnd={(e) => onRadiusChange(Number((e.target as HTMLInputElement).value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            min="100"
            max="5000"
            step="100"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5">
              {[1000, 2000, 5000].map((value) => (
                <button
                  key={value}
                  onClick={() => onRadiusChange(value)}
                  className={clsx(
                    "px-2 py-1 text-xs font-medium rounded-full transition-colors",
                    localRadius === value
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  )}
                >
                  {value}km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 