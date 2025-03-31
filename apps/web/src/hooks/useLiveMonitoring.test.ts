import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLiveMonitoring } from './useLiveMonitoring';
import { showNewEarthquakeToast, showErrorToast, showLiveMonitoringToast } from '../components/Toast';
import { Earthquake } from '../types/earthquake';

// Mock the toast notifications
vi.mock('../components/Toast', () => ({
  showNewEarthquakeToast: vi.fn(),
  showErrorToast: vi.fn(),
  showLiveMonitoringToast: vi.fn(),
}));

// Mock window.Notification
const mockNotification = vi.fn();
vi.stubGlobal('Notification', mockNotification);

describe('useLiveMonitoring', () => {
  const mockEarthquake: Earthquake = {
    id: 'test123',
    properties: {
      mag: 5.5,
      place: 'Test Location',
      time: Date.now(),
      updated: Date.now(),
      url: 'http://example.com',
      detail: 'http://example.com/detail',
      status: 'reviewed',
      tsunami: 0,
      type: 'earthquake'
    },
    geometry: {
      type: 'Point',
      coordinates: [100.5622455, 13.7454881, 10]
    },
    type: 'Feature'
  };

  const defaultProps = {
    earthquakes: [mockEarthquake],
    latitude: 13.7454881,
    longitude: 100.5622455,
    timeRange: '24h',
    refetch: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    mockNotification.requestPermission = vi.fn().mockResolvedValue('granted');
    mockNotification.permission = 'granted';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));

    expect(result.current.isLiveFetchEnabled).toBe(false);
    expect(result.current.previousTimeRange).toBe(null);
  });

  it('should toggle live monitoring on and off', async () => {
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));

    // Enable live monitoring
    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(result.current.isLiveFetchEnabled).toBe(true);
    expect(result.current.previousTimeRange).toBe('24h');
    expect(showLiveMonitoringToast).toHaveBeenCalledWith(true);

    // Disable live monitoring
    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(result.current.isLiveFetchEnabled).toBe(false);
    expect(result.current.previousTimeRange).toBe(null);
    expect(showLiveMonitoringToast).toHaveBeenCalledWith(false);
  });

  it('should request notification permission when enabling live monitoring', async () => {
    mockNotification.permission = 'default';
    
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));

    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(mockNotification.requestPermission).toHaveBeenCalled();
  });

  it('should show error toast when notifications are not supported', async () => {
    // Remove Notification from window
    const originalNotification = window.Notification;
    // @ts-ignore
    delete window.Notification;

    const { result } = renderHook(() => useLiveMonitoring(defaultProps));

    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(showErrorToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'This browser does not support desktop notifications'
      })
    );

    // Restore Notification
    window.Notification = originalNotification;
  });

  it('should show error toast when notification permission is denied', async () => {
    mockNotification.requestPermission = vi.fn().mockResolvedValue('denied');
    mockNotification.permission = 'default';

    const { result } = renderHook(() => useLiveMonitoring(defaultProps));

    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(showErrorToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Please enable notifications to receive earthquake alerts.'
      })
    );
  });

  it('should check for new earthquakes when data is fetched', async () => {
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));

    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(showNewEarthquakeToast).toHaveBeenCalled();
    expect(mockNotification).toHaveBeenCalledWith(
      'New Earthquake Detected!',
      expect.objectContaining({
        body: expect.stringContaining('Magnitude 5.5 earthquake detected')
      })
    );
  });

  it('should not check for new earthquakes when there are no earthquakes', async () => {
    const propsWithNoEarthquakes = {
      ...defaultProps,
      earthquakes: [],
    };

    const { result } = renderHook(() => useLiveMonitoring(propsWithNoEarthquakes));

    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(showNewEarthquakeToast).not.toHaveBeenCalled();
    expect(mockNotification).not.toHaveBeenCalled();
  });

  it('should not show notification for the same earthquake twice', async () => {
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));

    // First notification
    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    // Clear mocks
    vi.clearAllMocks();

    // Second check with same earthquake
    await act(async () => {
      await defaultProps.refetch();
    });

    expect(showNewEarthquakeToast).not.toHaveBeenCalled();
    expect(mockNotification).not.toHaveBeenCalled();
  });
}); 