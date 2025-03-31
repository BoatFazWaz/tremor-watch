import { useState, useEffect } from 'react';
import { THAI_REGIONS } from '../constants/locations';

interface UseLocationSettingsProps {
  latitude: number;
  longitude: number;
  radius: number;
  timeRange: string;
  onLatitudeChange: (value: number) => void;
  onLongitudeChange: (value: number) => void;
  onRadiusChange: (value: number) => void;
  onTimeRangeChange: (value: string) => void;
  onRefresh?: () => void;
}

interface UseLocationSettingsReturn {
  dateRange: [Date | null, Date | null];
  startDate: Date | null;
  endDate: Date | null;
  localRadius: number;
  handleDateRangeChange: (update: [Date | null, Date | null]) => void;
  handleRadiusChange: (value: number) => void;
  handleRegionSelect: (lat: number, lng: number) => void;
  handleGetCurrentLocation: () => void;
  getCurrentSelectedRegion: () => string;
  handleRegionChange: (value: string) => void;
  isSelectedRegion: (lat: number, lng: number) => boolean;
}

export function useLocationSettings({
  latitude,
  longitude,
  radius,
  timeRange,
  onLatitudeChange,
  onLongitudeChange,
  onRadiusChange,
  onTimeRangeChange,
  onRefresh
}: UseLocationSettingsProps): UseLocationSettingsReturn {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [localRadius, setLocalRadius] = useState(radius);

  // Update local radius when prop changes
  useEffect(() => {
    setLocalRadius(radius);
  }, [radius]);

  // Update date range when time range changes
  useEffect(() => {
    const now = new Date();
    let start = new Date();
    
    switch (timeRange) {
      case '1h':
        start.setHours(now.getHours() - 1);
        break;
      case '24h':
        start.setDate(now.getDate() - 1);
        break;
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '14d':
        start.setDate(now.getDate() - 14);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
      default:
        return;
    }
    
    setDateRange([start, now]);
  }, [timeRange]);

  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      const diffHours = Math.abs(update[1].getTime() - update[0].getTime()) / 36e5;
      if (diffHours <= 1) {
        onTimeRangeChange('1h');
      } else if (diffHours <= 24) {
        onTimeRangeChange('24h');
      } else if (diffHours <= 168) { // 7 days
        onTimeRangeChange('7d');
      } else if (diffHours <= 336) { // 14 days
        onTimeRangeChange('14d');
      } else {
        onTimeRangeChange('30d');
      }
      onRefresh?.();
    }
  };

  const handleRadiusChange = (value: number) => {
    setLocalRadius(value);
    onRadiusChange(value);
  };

  const handleRegionSelect = (lat: number, lng: number) => {
    onLatitudeChange(lat);
    onLongitudeChange(lng);
  };

  const isSelectedRegion = (lat: number, lng: number) => {
    return Math.abs(latitude - lat) < 0.0001 && Math.abs(longitude - lng) < 0.0001;
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLatitudeChange(position.coords.latitude);
          onLongitudeChange(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const getCurrentSelectedRegion = () => {
    const selectedRegion = THAI_REGIONS.find(region => 
      isSelectedRegion(region.latitude, region.longitude)
    );
    return selectedRegion ? `${selectedRegion.latitude},${selectedRegion.longitude}` : '';
  };

  const handleRegionChange = (value: string) => {
    if (value === 'current') {
      handleGetCurrentLocation();
      return;
    }
    
    if (value) {
      const [lat, lng] = value.split(',').map(Number);
      handleRegionSelect(lat, lng);
    }
  };

  return {
    dateRange,
    startDate,
    endDate,
    localRadius,
    handleDateRangeChange,
    handleRadiusChange,
    handleRegionSelect,
    handleGetCurrentLocation,
    getCurrentSelectedRegion,
    handleRegionChange,
    isSelectedRegion
  };
} 