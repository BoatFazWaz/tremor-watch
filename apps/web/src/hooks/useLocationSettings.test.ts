import { renderHook, act } from '@testing-library/react';
import { useLocationSettings } from './useLocationSettings';
import { beforeEach, describe, expect, it, vi } from 'vitest';


describe('useLocationSettings', () => {
  const mockProps = {
    latitude: 13.7563,
    longitude: 100.5018,
    radius: 1000,
    timeRange: '24h',
    onLatitudeChange: vi.fn(),
    onLongitudeChange: vi.fn(),
    onRadiusChange: vi.fn(),
    onTimeRangeChange: vi.fn(),
    onRefresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct values', () => {
    const { result } = renderHook(() => useLocationSettings(mockProps));

    expect(result.current.localRadius).toBe(mockProps.radius);
    
    const [startDate, endDate] = result.current.dateRange;
    expect(startDate).toBeInstanceOf(Date);
    expect(endDate).toBeInstanceOf(Date);
    
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);
    
    expect(startDate?.getDate()).toBe(oneDayAgo.getDate());
    expect(endDate?.getDate()).toBe(now.getDate());
  });

  it('should update date range when time range changes', () => {
    const { result, rerender } = renderHook(
      (props) => useLocationSettings(props),
      { initialProps: mockProps }
    );

    const newProps = { ...mockProps, timeRange: '7d' };
    rerender(newProps);

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [startDate] = result.current.dateRange;
    expect(startDate?.getDate()).toBe(sevenDaysAgo.getDate());
  });

  it('should handle radius change', () => {
    const { result } = renderHook(() => useLocationSettings(mockProps));

    act(() => {
      result.current.handleRadiusChange(2000);
    });

    expect(result.current.localRadius).toBe(2000);
    expect(mockProps.onRadiusChange).toHaveBeenCalledWith(2000);
  });

  it('should handle date range change', () => {
    const { result } = renderHook(() => useLocationSettings(mockProps));

    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    act(() => {
      result.current.handleDateRangeChange([oneDayAgo, now]);
    });

    expect(mockProps.onTimeRangeChange).toHaveBeenCalledWith('24h');
    expect(mockProps.onRefresh).toHaveBeenCalled();
  });

  it('should handle region selection', () => {
    const { result } = renderHook(() => useLocationSettings(mockProps));

    act(() => {
      result.current.handleRegionSelect(14.0, 100.0);
    });

    expect(mockProps.onLatitudeChange).toHaveBeenCalledWith(14.0);
    expect(mockProps.onLongitudeChange).toHaveBeenCalledWith(100.0);
  });

  it('should check if region is selected', () => {
    const { result } = renderHook(() => useLocationSettings(mockProps));

    expect(result.current.isSelectedRegion(13.7563, 100.5018)).toBe(true);
    expect(result.current.isSelectedRegion(14.0, 100.0)).toBe(false);
  });

  it('should handle getting current location', () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => 
        success({
          coords: {
            latitude: 13.7563,
            longitude: 100.5018
          }
        })
      )
    };
    
    const originalNavigator = global.navigator;
    // @ts-ignore
    global.navigator = { geolocation: mockGeolocation };

    const { result } = renderHook(() => useLocationSettings(mockProps));

    act(() => {
      result.current.handleGetCurrentLocation();
    });

    expect(mockProps.onLatitudeChange).toHaveBeenCalledWith(13.7563);
    expect(mockProps.onLongitudeChange).toHaveBeenCalledWith(100.5018);

    // @ts-ignore
    global.navigator = originalNavigator;
  });
}); 