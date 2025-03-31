import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEarthquakes } from './useEarthquakes';
import { fetchEarthquakes } from '../services/earthquakeService';

// Mock the earthquakeService
vi.mock('../services/earthquakeService', () => ({
  fetchEarthquakes: vi.fn()
}));

// Mock debounce to execute immediately
vi.mock('lodash-es', () => ({
  debounce: (fn: Function) => fn
}));

describe('useEarthquakes', () => {
  const defaultParams = {
    latitude: 13.7563,
    longitude: 100.5018,
    radius: 2000,
    timeRange: '24h',
    limit: 10
  };

  const mockEarthquakeData = {
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

  it('should fetch earthquakes on mount', async () => {
    const promise = Promise.resolve(mockEarthquakeData);
    (fetchEarthquakes as any).mockReturnValue(promise);

    const { result } = renderHook(() => useEarthquakes(defaultParams));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.earthquakes).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for the promise to resolve
    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.earthquakes).toEqual(mockEarthquakeData.features);
    expect(fetchEarthquakes).toHaveBeenCalledWith(expect.objectContaining(defaultParams));
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Failed to fetch earthquakes');
    const promise = Promise.reject(error);
    (fetchEarthquakes as any).mockReturnValue(promise);

    const { result } = renderHook(() => useEarthquakes(defaultParams));

    await act(async () => {
      try {
        await promise;
      } catch (e) {
        // Expected error
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch earthquakes');
    expect(result.current.earthquakes).toEqual([]);
  });

  it('should refetch when parameters change', async () => {
    const firstPromise = Promise.resolve(mockEarthquakeData);
    const secondPromise = Promise.resolve(mockEarthquakeData);
    (fetchEarthquakes as any)
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    const { result, rerender } = renderHook((props) => useEarthquakes(props), {
      initialProps: defaultParams
    });

    // Wait for initial fetch
    await act(async () => {
      await firstPromise;
    });

    expect(result.current.loading).toBe(false);

    // Change parameters and wait for second fetch
    const newParams = { ...defaultParams, timeRange: '12h' };
    await act(async () => {
      rerender(newParams);
      await secondPromise;
    });

    expect(fetchEarthquakes).toHaveBeenLastCalledWith(expect.objectContaining(newParams));
  });

  it('should refetch data when refetch function is called', async () => {
    const firstPromise = Promise.resolve(mockEarthquakeData);
    const secondPromise = Promise.resolve(mockEarthquakeData);
    (fetchEarthquakes as any)
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    const { result } = renderHook(() => useEarthquakes(defaultParams));

    await act(async () => {
      await firstPromise;
    });

    expect(result.current.loading).toBe(false);

    await act(async () => {
      result.current.refetch();
      await secondPromise;
    });

    expect(fetchEarthquakes).toHaveBeenLastCalledWith(expect.objectContaining(defaultParams));
  });
}); 