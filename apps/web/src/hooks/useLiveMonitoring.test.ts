import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLiveMonitoring } from './useLiveMonitoring';
import { showNewEarthquakeToast, showErrorToast, showLiveMonitoringToast } from '../components/Toast';
import { EarthquakeFeature } from '../types/earthquake';

// Mock the toast notifications
vi.mock('../components/Toast', () => ({
  showNewEarthquakeToast: vi.fn(),
  showErrorToast: vi.fn(),
  showLiveMonitoringToast: vi.fn(),
}));

describe('useLiveMonitoring', () => {
  const mockEarthquake: EarthquakeFeature = {
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
      felt: null,
      cdi: null,
      mmi: null,
      alert: null,
      tz: null,
      title: 'Test Earthquake',
      types: '',
      sig: 0,
      net: '',
      code: '',
      ids: '',
      sources: '',
      nst: 0,
      dmin: 0,
      rms: 0,
      gap: 0,
      magType: '',
      featureType: 'earthquake'
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
    // Mock the Notification API
    const NotificationMock = vi.fn();
    Object.defineProperty(NotificationMock, 'permission', {
      value: 'granted',
      writable: true
    });
    Object.defineProperty(NotificationMock, 'requestPermission', {
      value: vi.fn().mockResolvedValue('granted'),
      writable: true
    });
    vi.stubGlobal('Notification', NotificationMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should initialize with live monitoring disabled', () => {
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));
    expect(result.current.isLiveFetchEnabled).toBe(false);
    expect(result.current.previousTimeRange).toBe(null);
  });

  it('should toggle live monitoring state', async () => {
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));
    
    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(result.current.isLiveFetchEnabled).toBe(true);
    expect(result.current.previousTimeRange).toBe('24h');
    expect(showLiveMonitoringToast).toHaveBeenCalledWith(true);

    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    expect(result.current.isLiveFetchEnabled).toBe(false);
    expect(result.current.previousTimeRange).toBe(null);
    expect(showLiveMonitoringToast).toHaveBeenCalledWith(false);
  });

  it('should not trigger notifications for same earthquake', async () => {
    const { result } = renderHook(() => useLiveMonitoring(defaultProps));
    
    await act(async () => {
      result.current.handleToggleLiveFetch();
    });

    const initialCalls = vi.mocked(showNewEarthquakeToast).mock.calls.length;

    // Trigger refetch with same data
    await act(async () => {
      await defaultProps.refetch();
    });

    expect(showNewEarthquakeToast).toHaveBeenCalledTimes(initialCalls);
  });
}); 