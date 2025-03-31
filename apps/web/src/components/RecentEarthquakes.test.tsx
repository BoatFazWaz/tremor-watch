import { describe, it, expect } from 'vitest';
import { 
  calculateDistance, 
  calculateArrivalTime, 
  calculateEffect,
  getEffectColor 
} from './RecentEarthquakes';

describe('calculateDistance', () => {
  it('should calculate distance between two points correctly', () => {
    // Bangkok to Chiang Mai
    const distance = calculateDistance(13.7563, 100.5018, 18.7883, 98.9853);
    expect(Math.round(distance)).toBe(582); // ~582 km
  });

  it('should return 0 for same coordinates', () => {
    const distance = calculateDistance(13.7563, 100.5018, 13.7563, 100.5018);
    expect(distance).toBe(0);
  });

  it('should handle negative coordinates', () => {
    // Sydney to Wellington
    const distance = calculateDistance(-33.8688, 151.2093, -41.2866, 174.7756);
    expect(Math.round(distance)).toBe(2226); // ~2226 km
  });
});

describe('calculateArrivalTime', () => {
  it('should calculate P-wave and S-wave arrival times correctly', () => {
    const distance = 100; // 100 km
    const result = calculateArrivalTime(distance);
    
    // P-wave velocity = 7 km/s, S-wave velocity = 4 km/s
    expect(result.pWave.seconds).toBe(100/7);
    expect(result.sWave.seconds).toBe(100/4);
  });

  it('should format travel times correctly for different durations', () => {
    // Short distance
    const shortResult = calculateArrivalTime(10);
    expect(shortResult.pWave.formatted).toMatch(/(\d+\s*(hr|min|sec|hour|minute|second)s?\s*)+/i);

    // Medium distance
    const mediumResult = calculateArrivalTime(300);
    expect(mediumResult.pWave.formatted).toMatch(/(\d+\s*(hr|min|sec|hour|minute|second)s?\s*)+/i);

    // Long distance
    const longResult = calculateArrivalTime(25200); // 7000 km
    expect(longResult.pWave.formatted).toMatch(/(\d+\s*(hr|min|sec|hour|minute|second)s?\s*)+/i);
  });
});

describe('calculateEffect', () => {
  it('should calculate Very Strong effect for high magnitude close earthquakes', () => {
    const effect = calculateEffect(7.0, 10, 50);
    expect(effect).toBe('Very Strong');
  });

  it('should calculate Strong effect for moderate conditions', () => {
    const effect = calculateEffect(6.0, 30, 100);
    expect(effect).toBe('Strong');
  });

  it('should calculate Moderate effect for average conditions', () => {
    const effect = calculateEffect(5.0, 50, 200);
    expect(effect).toBe('Moderate');
  });

  it('should calculate Light effect for lower impact conditions', () => {
    const effect = calculateEffect(4.0, 100, 300);
    expect(effect).toBe('Light');
  });

  it('should calculate Minimal effect for low impact conditions', () => {
    const effect = calculateEffect(3.0, 150, 400);
    expect(effect).toBe('Minimal');
  });
});

describe('getEffectColor', () => {
  it('should return correct color classes for each effect level', () => {
    expect(getEffectColor('Very Strong')).toBe('bg-red-100 text-red-800');
    expect(getEffectColor('Strong')).toBe('bg-orange-100 text-orange-800');
    expect(getEffectColor('Moderate')).toBe('bg-yellow-100 text-yellow-800');
    expect(getEffectColor('Light')).toBe('bg-blue-100 text-blue-800');
    expect(getEffectColor('Minimal')).toBe('bg-gray-100 text-gray-800');
    expect(getEffectColor('Unknown')).toBe('bg-gray-100 text-gray-800');
  });
}); 