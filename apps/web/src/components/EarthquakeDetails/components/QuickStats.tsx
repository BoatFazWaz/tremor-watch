import { type FC } from 'react';
import clsx from 'clsx';
import { QuickStatsProps } from '../types';

export const QuickStats: FC<QuickStatsProps> = ({
  distance,
  effect,
  travelTimes,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
      <div>
        <div className="text-xs text-gray-500">Distance</div>
        <div className="text-sm font-medium">{distance.toFixed(1)} km</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Potential Effect</div>
        <span className={clsx(
          "inline-block px-2 py-0.5 text-sm rounded-full font-medium mt-0.5",
          effect === 'Severe' ? 'bg-red-100 text-red-800' :
          effect === 'Strong' ? 'bg-orange-100 text-orange-800' :
          effect === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        )}>
          {effect}
        </span>
      </div>
      <div>
        <div className="text-xs text-gray-500">Seismic Wave Travel Time</div>
        <div className="text-sm font-medium space-y-1 mt-1">
          <div className="flex items-center gap-1">
            <div className="group relative">
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 cursor-help">
                P-waves
              </span>
              <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-500 text-white text-xs rounded shadow-lg -top-1 left-full ml-1">
                P-waves (Primary waves) are the fastest seismic waves, traveling through solids and liquids.
              </div>
            </div>
            <span>{travelTimes.pWave.formatted}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="group relative">
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 cursor-help">
                S-waves
              </span>
              <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-500 text-white text-xs rounded shadow-lg -top-1 left-full ml-1">
                S-waves (Secondary waves) are slower seismic waves that can only travel through solids.
              </div>
            </div>
            <span>{travelTimes.sWave.formatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 