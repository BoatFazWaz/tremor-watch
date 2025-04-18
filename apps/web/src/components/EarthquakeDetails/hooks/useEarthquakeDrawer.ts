import { useEffect, useCallback } from 'react';
import { EarthquakeFeature } from '../../../types/earthquake';
import { calculateDistance, calculateEffect, calculateArrivalTime } from '../../RecentEarthquakes';

interface UseEarthquakeDrawerProps {
  earthquake: EarthquakeFeature | null;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

interface UseEarthquakeDrawerResult {
  distance: number;
  effect: string;
  travelTimes: {
    pWave: { formatted: string };
    sWave: { formatted: string };
  };
  handleEscapeKey: (e: KeyboardEvent) => void;
}

export const useEarthquakeDrawer = ({
  earthquake,
  onClose,
  latitude,
  longitude,
}: UseEarthquakeDrawerProps): UseEarthquakeDrawerResult => {
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  if (!earthquake) {
    return {
      distance: 0,
      effect: '',
      travelTimes: {
        pWave: { formatted: '' },
        sWave: { formatted: '' },
      },
      handleEscapeKey,
    };
  }

  const distance = calculateDistance(
    latitude,
    longitude,
    earthquake.geometry.coordinates[1],
    earthquake.geometry.coordinates[0]
  );

  const effect = calculateEffect(
    earthquake.properties.mag,
    earthquake.geometry.coordinates[2],
    distance
  );

  const travelTimes = calculateArrivalTime(distance);

  return {
    distance,
    effect,
    travelTimes,
    handleEscapeKey,
  };
}; 