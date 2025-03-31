import toast from 'react-hot-toast';
import { EarthquakeFeature } from '../types/earthquake';
import { WaveTravelTimes } from './RecentEarthquakes';

interface ToastCloseButtonProps {
  onClick: () => void;
  className?: string;
}

const ToastCloseButton = ({ onClick, className = "text-gray-400 hover:text-gray-500" }: ToastCloseButtonProps) => (
  <button onClick={onClick} className={className}>
    <span className="sr-only">Close</span>
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
);

export const showNewEarthquakeToast = (earthquake: EarthquakeFeature, travelTimes: WaveTravelTimes) => {
  toast((t) => (
    <div className="flex items-start gap-4">
      <div className="flex-1">
        <div className="font-medium text-gray-900">
          New Earthquake Detected!
        </div>
        <div className="mt-1 text-sm text-gray-500">
          <div>Magnitude: {earthquake.properties.mag}</div>
          <div>Location: {earthquake.properties.place}</div>
          <div>P-wave arrival: {travelTimes.pWave.formatted}</div>
          <div>S-wave arrival: {travelTimes.sWave.formatted}</div>
        </div>
      </div>
      <ToastCloseButton onClick={() => toast.dismiss(t.id)} />
    </div>
  ), {
    duration: 10000,
    position: 'top-right',
  });
};

export const showErrorToast = (error: Error) => {
  toast(
    (t) => (
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="font-medium text-red-800">
            Failed to Fetch Earthquake Data
          </div>
          <div className="mt-1 text-sm text-red-600">
            {error.message}
          </div>
          <div className="mt-2 text-xs text-red-500">
            Retrying in 2 seconds...
          </div>
        </div>
        <ToastCloseButton 
          onClick={() => toast.dismiss(t.id)} 
          className="text-red-400 hover:text-red-500"
        />
      </div>
    ),
    {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#FEF2F2',
        border: '1px solid #FCA5A5',
        borderRadius: '0.5rem',
      },
    }
  );
};

export const showLiveMonitoringToast = (isStarting: boolean) => {
  if (isStarting) {
    toast.success("Live monitoring started", {
      icon: '🔴',
    });
  } else {
    toast("Live monitoring stopped", {
      icon: '⚫',
    });
  }
}; 