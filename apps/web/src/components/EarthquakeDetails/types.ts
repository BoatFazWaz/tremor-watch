import { EarthquakeFeature } from '../../types/earthquake';

export interface EarthquakeDetailsProps {
  earthquake: EarthquakeFeature | null;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

export interface BasicInfoProps {
  magnitude: number;
  place: string;
  time: number;
  tsunami: number;
  alert: string | null;
}

export interface QuickStatsProps {
  distance: number;
  effect: string;
  travelTimes: {
    pWave: { formatted: string };
    sWave: { formatted: string };
  };
}

export interface RiskAssessmentProps {
  magnitude: number;
  depth: number;
  mmi?: number;
}

export interface PopulationImpactProps {
  magnitude: number;
}

export interface SafetyRecommendationsProps {
  magnitude: number;
}

export interface MapSectionProps {
  earthquake: EarthquakeFeature;
  selectedLocation: [number, number];
}

export interface TechnicalDetailsProps {
  coordinates: [number, number, number];
  status: string;
  felt?: number;
  cdi?: number;
  mmi?: number;
  magType: string;
  sig: number;
}

export interface HistoricalContextProps {
  magnitude: number;
  significance: number;
}

export interface DrawerHeaderProps {
  onClose: () => void;
  title: string;
} 