import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { fetchEarthquakes } from '../services/earthquakeService';
import { EarthquakeFeature } from '../types/earthquake';

interface UseEarthquakesParams {
  latitude: number;
  longitude: number;
  radius: number;
  timeRange: string;
  limit: number;
}

interface UseEarthquakesResult {
  earthquakes: EarthquakeFeature[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEarthquakes = ({
  latitude,
  longitude,
  radius,
  timeRange,
  limit,
}: UseEarthquakesParams): UseEarthquakesResult => {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only debounce radius changes, pin location should update immediately
  const debouncedRadius = useDebounce(radius, 300);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEarthquakes({
        latitude,
        longitude,
        radius: debouncedRadius,
        timeRange,
        limit,
      });
      setEarthquakes(response.features);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch earthquakes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [latitude, longitude, debouncedRadius, timeRange, limit]);

  return {
    earthquakes,
    loading,
    error,
    refetch: fetchData,
  };
}; 