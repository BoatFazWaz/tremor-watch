import { type FC } from 'react';
import clsx from 'clsx';
import { BasicInfoProps } from '../types';
import { formatDate, getMagnitudeColor } from '../utils/calculations';

export const BasicInfo: FC<BasicInfoProps> = ({
  magnitude,
  place,
  time,
  tsunami,
  alert
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={clsx(
          "px-3 py-1 text-sm font-semibold rounded-full",
          getMagnitudeColor(magnitude)
        )}>
          Magnitude {magnitude.toFixed(1)}
        </span>
        {tsunami > 0 && (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
            Tsunami Alert
          </span>
        )}
        {alert && (
          <span className={clsx(
            "px-3 py-1 text-sm font-semibold rounded-full",
            alert === 'green' ? 'bg-green-100 text-green-800' :
            alert === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            alert === 'orange' ? 'bg-orange-100 text-orange-800' :
            alert === 'red' ? 'bg-red-100 text-red-800' : ''
          )}>
            {alert.charAt(0).toUpperCase() + alert.slice(1)} Alert
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{place}</h3>
        <p className="mt-1 text-sm text-gray-500">{formatDate(time)}</p>
      </div>
    </div>
  );
}; 