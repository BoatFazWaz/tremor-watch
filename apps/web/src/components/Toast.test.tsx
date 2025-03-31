import { describe, it, expect, vi } from 'vitest';
import toast from 'react-hot-toast';
import { showNewEarthquakeToast, showErrorToast, showLiveMonitoringToast } from './Toast';
import { EarthquakeFeature } from '../types/earthquake';
import { WaveTravelTimes } from './RecentEarthquakes';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    dismiss: vi.fn(),
    __esModule: true,
    ...vi.fn()
  }
}));

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showNewEarthquakeToast', () => {
    it('should show a toast with earthquake details', () => {
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
          url: '',
          detail: '',
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
          featureType: '',
          title: ''
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

      showNewEarthquakeToast(mockEarthquake, mockTravelTimes);
      expect(toast).toHaveBeenCalled();
    });
  });

  describe('showErrorToast', () => {
    it('should show an error toast with the error message', () => {
      const error = new Error('Test error message');
      showErrorToast(error);
      expect(toast).toHaveBeenCalled();
    });
  });

  describe('showLiveMonitoringToast', () => {
    it('should show success toast when starting monitoring', () => {
      showLiveMonitoringToast(true);
      expect(toast.success).toHaveBeenCalledWith('Live monitoring started', {
        icon: '🔴'
      });
    });

    it('should show regular toast when stopping monitoring', () => {
      showLiveMonitoringToast(false);
      expect(toast).toHaveBeenCalledWith('Live monitoring stopped', {
        icon: '⚫'
      });
    });
  });
}); 