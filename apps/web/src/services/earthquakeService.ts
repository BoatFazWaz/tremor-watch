import { api } from './api';
import { EarthquakeFeature } from '../types/earthquake';

interface FetchEarthquakesParams {
  latitude: number;
  longitude: number;
  radius: number;
  timeRange: string;
  limit: number;
}

interface FetchEarthquakesResult {
  features: EarthquakeFeature[];
}

export const calculateStartTime = (timeRange: string): string => {
  const now = new Date();
  
  switch (timeRange) {
    case '1h':
      return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  }
};

export const fetchEarthquakes = async ({
  latitude,
  longitude,
  radius,
  timeRange,
  limit,
}: FetchEarthquakesParams): Promise<FetchEarthquakesResult> => {
  const starttime = calculateStartTime(timeRange);
  
  const response = await api.getEarthquakesByLocation({
    latitude,
    longitude,
    radius,
    starttime,
    endtime: new Date().toISOString(),
    limit
  });

  return response;
}; 