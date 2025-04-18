import { describe, it, expect } from 'vitest';
import {
  calculateAfterShockProbability,
  getIntensityDescription,
  getRiskLevel,
  getMagnitudeColor,
  formatDate,
  getAffectedAreaRadius,
  getBuildingDamageRisk,
  getSignificanceLevel,
  getMagnitudeClassification,
  getSafetyRecommendations
} from '../utils/calculations';

describe('Earthquake Calculations', () => {
  describe('calculateAfterShockProbability', () => {
    it('should return correct probability ranges', () => {
      expect(calculateAfterShockProbability(7.5)).toBe('Very High (>90%)');
      expect(calculateAfterShockProbability(6.5)).toBe('High (70-90%)');
      expect(calculateAfterShockProbability(5.5)).toBe('Moderate (40-70%)');
      expect(calculateAfterShockProbability(4.5)).toBe('Low (20-40%)');
      expect(calculateAfterShockProbability(3.5)).toBe('Very Low (<20%)');
    });
  });

  describe('getIntensityDescription', () => {
    it('should return correct intensity descriptions', () => {
      expect(getIntensityDescription(9)).toContain('Violent');
      expect(getIntensityDescription(8)).toContain('Severe');
      expect(getIntensityDescription(7)).toContain('Very Strong');
      expect(getIntensityDescription(6)).toContain('Strong');
      expect(getIntensityDescription(5)).toContain('Moderate');
      expect(getIntensityDescription(4)).toContain('Light');
      expect(getIntensityDescription(3)).toContain('Weak');
      expect(getIntensityDescription(2)).toContain('Very Weak');
      expect(getIntensityDescription(1)).toBe('Not Felt');
    });
  });

  describe('getRiskLevel', () => {
    it('should return correct risk levels based on magnitude and depth', () => {
      expect(getRiskLevel(7.5, 60)).toBe('Extreme');
      expect(getRiskLevel(6.5, 90)).toBe('High');
      expect(getRiskLevel(5.5, 120)).toBe('Moderate');
      expect(getRiskLevel(4.5, 40)).toBe('Moderate');
      expect(getRiskLevel(3.5, 30)).toBe('Low');
    });
  });

  describe('getMagnitudeColor', () => {
    it('should return correct color classes', () => {
      expect(getMagnitudeColor(6.5)).toBe('bg-red-100 text-red-800');
      expect(getMagnitudeColor(5.5)).toBe('bg-orange-100 text-orange-800');
      expect(getMagnitudeColor(4.5)).toBe('bg-yellow-100 text-yellow-800');
      expect(getMagnitudeColor(3.5)).toBe('bg-green-100 text-green-800');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const timestamp = new Date('2024-04-18T12:00:00Z').getTime();
      const formatted = formatDate(timestamp);
      expect(formatted).toMatch(/Apr 18, 2024/);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/); // Time format
      expect(formatted).toMatch(/(AM|PM)/); // Contains AM/PM
    });
  });

  describe('getAffectedAreaRadius', () => {
    it('should return correct radius ranges', () => {
      expect(getAffectedAreaRadius(7.5)).toBe('> 200km radius');
      expect(getAffectedAreaRadius(6.5)).toBe('100-200km radius');
      expect(getAffectedAreaRadius(5.5)).toBe('50-100km radius');
      expect(getAffectedAreaRadius(3.5)).toBe('< 50km radius');
    });
  });

  describe('getBuildingDamageRisk', () => {
    it('should return correct damage risk descriptions', () => {
      expect(getBuildingDamageRisk(7.5)).toBe('Severe structural damage likely');
      expect(getBuildingDamageRisk(6.5)).toBe('Moderate structural damage possible');
      expect(getBuildingDamageRisk(5.5)).toBe('Light damage possible');
      expect(getBuildingDamageRisk(3.5)).toBe('Minimal to no damage expected');
    });
  });

  describe('getSignificanceLevel', () => {
    it('should return correct significance levels', () => {
      expect(getSignificanceLevel(1100)).toBe('Exceptionally Significant');
      expect(getSignificanceLevel(800)).toBe('Highly Significant');
      expect(getSignificanceLevel(600)).toBe('Significant');
      expect(getSignificanceLevel(300)).toBe('Moderately Significant');
      expect(getSignificanceLevel(200)).toBe('Low Significance');
    });
  });

  describe('getMagnitudeClassification', () => {
    it('should return correct magnitude classifications', () => {
      expect(getMagnitudeClassification(8.5)).toBe('Great Earthquake');
      expect(getMagnitudeClassification(7.5)).toBe('Major Earthquake');
      expect(getMagnitudeClassification(6.5)).toBe('Strong Earthquake');
      expect(getMagnitudeClassification(5.5)).toBe('Moderate Earthquake');
      expect(getMagnitudeClassification(4.5)).toBe('Light Earthquake');
      expect(getMagnitudeClassification(3.5)).toBe('Minor Earthquake');
    });
  });

  describe('getSafetyRecommendations', () => {
    it('should return appropriate safety recommendations based on magnitude', () => {
      const highMagRecommendations = getSafetyRecommendations(6.5);
      expect(highMagRecommendations).toContain('Evacuate buildings if safe to do so');
      expect(highMagRecommendations).toHaveLength(5);

      const mediumMagRecommendations = getSafetyRecommendations(4.5);
      expect(mediumMagRecommendations).toContain('Stay calm and be prepared for aftershocks');
      expect(mediumMagRecommendations).toHaveLength(3);

      const lowMagRecommendations = getSafetyRecommendations(3.5);
      expect(lowMagRecommendations).toContain('No immediate action required');
      expect(lowMagRecommendations).toHaveLength(2);
    });
  });
}); 