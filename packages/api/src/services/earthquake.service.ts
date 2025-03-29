import axios from 'axios';
import type { FeatureCollection, EarthquakeQueryParams } from '../types/earthquake';

export class EarthquakeService {
  static async getEarthquakes(): Promise<FeatureCollection> {
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data } = await axios.get(process.env.USGS_API_URL!, {
        params: {
          format: 'geojson',
          starttime: yesterday.toISOString().split('T')[0],
          endtime: today.toISOString().split('T')[0],
        },
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch earthquake data: ${(error as Error).message}`);
    }
  }

  static async getEarthquakesByLocation(params: EarthquakeQueryParams): Promise<FeatureCollection> {
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data } = await axios.get(process.env.USGS_API_URL!, {
        params: {
          format: 'geojson',
          latitude: params.latitude,
          longitude: params.longitude,
          maxradiuskm: params.radius || 2000,
          starttime: params.starttime || yesterday.toISOString().split('T')[0],
          endtime: params.endtime || today.toISOString().split('T')[0],
        },
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch earthquake data: ${(error as Error).message}`);
    }
  }
} 