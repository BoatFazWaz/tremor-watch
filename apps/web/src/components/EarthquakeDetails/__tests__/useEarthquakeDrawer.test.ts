/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEarthquakeDrawer } from '../hooks/useEarthquakeDrawer';

const mockEarthquake = {
  geometry: {
    coordinates: [120, 30, 10] // longitude, latitude, depth
  },
  properties: {
    mag: 6.5,
    place: 'Test Location',
    time: Date.now(),
    status: 'reviewed',
    tsunami: 0,
    sig: 800
  }
} as any; // Type assertion for test simplicity

describe('useEarthquakeDrawer', () => {
  const defaultProps = {
    earthquake: mockEarthquake,
    onClose: vi.fn(),
    latitude: 35,
    longitude: 125
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates distance and effect correctly', () => {
    const { result } = renderHook(() => useEarthquakeDrawer(defaultProps));
    
    expect(result.current.distance).toBeGreaterThan(0);
    expect(result.current.effect).toBeDefined();
    expect(result.current.travelTimes.pWave.formatted).toBeDefined();
    expect(result.current.travelTimes.sWave.formatted).toBeDefined();
  });

  it('handles null earthquake gracefully', () => {
    const { result } = renderHook(() => 
      useEarthquakeDrawer({ ...defaultProps, earthquake: null })
    );
    
    expect(result.current.distance).toBe(0);
    expect(result.current.effect).toBe('');
    expect(result.current.travelTimes.pWave.formatted).toBe('');
    expect(result.current.travelTimes.sWave.formatted).toBe('');
  });

  it('calls onClose when escape key is pressed', () => {
    renderHook(() => useEarthquakeDrawer(defaultProps));
    
    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
    });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', () => {
    renderHook(() => useEarthquakeDrawer(defaultProps));
    
    act(() => {
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);
    });
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useEarthquakeDrawer(defaultProps));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
}); 