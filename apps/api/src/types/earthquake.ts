export interface EarthquakeProperties {
  mag: number;
  place: string;
  time: number;
  updated: number;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number;
  dmin: number;
  rms: number;
  gap: number;
  magType: string;
  type: string;
  title: string;
}

export interface EarthquakeGeometry {
  type: string;
  coordinates: [number, number, number];
}

export interface EarthquakeFeature {
  type: string;
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
  bbox: [number, number, number, number, number, number];
}

export interface EarthquakeQueryParams {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
  starttime?: string;
  endtime?: string;
}

export interface Feature {
  type: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
  id: string;
}

export interface FeatureCollection {
  type: string;
  metadata: {
    count: number;
    [key: string]: any;
  };
  features: Feature[];
  bbox: number[];
} 