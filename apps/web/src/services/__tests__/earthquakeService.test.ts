import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateStartTime, fetchEarthquakes } from '../earthquakeService';
import { api } from '../api';

// Mock the api module
vi.mock('../api', () => ({
  api: {
    getEarthquakesByLocation: vi.fn()
  }
}));

describe('calculateStartTime', () => {
  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-06T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should calculate correct start time for 1h', () => {
    const result = calculateStartTime('1h');
    expect(result).toBe('2024-03-05T23:00:00.000Z');
  });

  it('should calculate correct start time for 24h', () => {
    const result = calculateStartTime('24h');
    expect(result).toBe('2024-03-05T00:00:00.000Z');
  });

  it('should calculate correct start time for 7d', () => {
    const result = calculateStartTime('7d');
    expect(result).toBe('2024-02-28T00:00:00.000Z');
  });

  it('should calculate correct start time for 30d', () => {
    const result = calculateStartTime('30d');
    expect(result).toBe('2024-02-05T00:00:00.000Z');
  });

  it('should use 24h as default for invalid time range', () => {
    const result = calculateStartTime('invalid');
    expect(result).toBe('2024-03-05T00:00:00.000Z');
  });
});

describe('fetchEarthquakes', () => {
  const mockParams = {
    latitude: 13.7563,
    longitude: 100.5018,
    radius: 2000,
    timeRange: '24h',
    limit: 10
  };

  const mockResponse = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'test1',
        properties: {
          mag: 5.0,
          place: 'Test Location',
          time: 1709692800000,
          status: 'reviewed',
          tsunami: 0,
          felt: null
        },
        geometry: {
          type: 'Point',
          coordinates: [100.5018, 13.7563, 10]
        }
      }
    ],
    metadata: {
      generated: 1709692800000,
      count: 1
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api with correct parameters', async () => {
    (api.getEarthquakesByLocation as any).mockResolvedValue(mockResponse);

    await fetchEarthquakes(mockParams);

    expect(api.getEarthquakesByLocation).toHaveBeenCalledWith({
      latitude: mockParams.latitude,
      longitude: mockParams.longitude,
      radius: mockParams.radius,
      starttime: expect.any(String),
      endtime: expect.any(String),
      limit: mockParams.limit
    });
  });

  it('should return earthquake data successfully', async () => {
    (api.getEarthquakesByLocation as any).mockResolvedValue(mockResponse);

    const result = await fetchEarthquakes(mockParams);
    expect(result).toEqual(mockResponse);
  });

  it('should handle api errors', async () => {
    const error = new Error('API Error');
    (api.getEarthquakesByLocation as any).mockRejectedValue(error);

    await expect(fetchEarthquakes(mockParams)).rejects.toThrow('API Error');
  });
}); 