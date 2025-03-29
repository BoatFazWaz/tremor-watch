import axios from 'axios';
import { EarthquakeResponse } from '../types/earthquake';

const USGS_API_URL = process.env.USGS_API_URL as string;

if (!USGS_API_URL) {
  throw new Error('USGS_API_URL environment variable is not set');
}

export class EarthquakeService {
  private static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private static getDateRange(): { starttime: string; endtime: string } {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return {
      starttime: this.formatDate(yesterday),
      endtime: this.formatDate(today),
    };
  }

  public static async getEarthquakes(): Promise<EarthquakeResponse> {
    const { starttime, endtime } = this.getDateRange();
    
    try {
      const response = await axios.get<EarthquakeResponse>(USGS_API_URL, {
        params: {
          format: 'geojson',
          starttime,
          endtime,
        },
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch earthquake data: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch earthquake data: ${error.message}`);
      }
      throw new Error('Failed to fetch earthquake data: Unknown error');
    }
  }
} 