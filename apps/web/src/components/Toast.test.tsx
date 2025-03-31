import { describe, it, expect, vi, beforeEach } from 'vitest';
import toast from 'react-hot-toast';
import { showNewEarthquakeToast, showErrorToast, showLiveMonitoringToast } from './Toast';
import { EarthquakeFeature } from '../types/earthquake';
import { WaveTravelTimes } from './RecentEarthquakes';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn()
  })
}));

describe('Toast notifications', () => {
  const mockEarthquake: EarthquakeFeature = {
    id: '123',
    type: 'Feature',
    properties: {
      mag: 5.5,
      place: 'Test Location',
      time: Date.now(),
      status: 'reviewed',
      tsunami: 0,
      felt: null,
      alert: null,
      url: 'http://example.com',
      detail: 'http://example.com/detail',
      updated: Date.now(),
      tz: null,
      code: '',
      ids: '',
      sources: '',
      types: '',
      nst: 0,
      dmin: 0,
      rms: 0,
      gap: 0,
      magType: '',
      featureType: 'earthquake',
      title: 'Test Earthquake',
      cdi: null,
      mmi: null,
      sig: 0,
      net: ''
    },
    geometry: {
      type: 'Point',
      coordinates: [100, 13, 10]
    }
  };

  const mockTravelTimes: WaveTravelTimes = {
    pWave: {
      seconds: 60,
      formatted: '1 min'
    },
    sWave: {
      seconds: 120,
      formatted: '2 mins'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show earthquake notification with correct details', () => {
    showNewEarthquakeToast(mockEarthquake, mockTravelTimes);
    
    expect(toast).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        duration: 10000,
        position: 'top-right'
      })
    );
  });

  it('should show error notification with message', () => {
    const testError = new Error('Test error message');
    showErrorToast(testError);
    
    expect(toast).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        duration: 5000,
        position: 'top-right',
        style: expect.objectContaining({
          background: '#FEF2F2',
          border: '1px solid #FCA5A5'
        })
      })
    );
  });

  it('should show start monitoring notification', () => {
    showLiveMonitoringToast(true);
    
    expect(toast.success).toHaveBeenCalledWith(
      'Live monitoring started',
      expect.objectContaining({
        icon: '🔴'
      })
    );
  });

  it('should show stop monitoring notification', () => {
    showLiveMonitoringToast(false);
    
    expect(toast).toHaveBeenCalledWith(
      'Live monitoring stopped',
      expect.objectContaining({
        icon: '⚫'
      })
    );
  });
}); 