import axios from 'axios';
import { EarthquakeResponse, EarthquakeQueryParams } from '../types/earthquake';

export class EarthquakeService {
  private static getApiUrl(): string {
    const url = process.env.USGS_API_URL;
    if (!url) {
      throw new Error('USGS_API_URL environment variable is not set');
    }
    return url;
  }

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
      const response = await axios.get<EarthquakeResponse>(this.getApiUrl(), {
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

  public static async getEarthquakesByLocation(params: EarthquakeQueryParams): Promise<EarthquakeResponse> {
    const { latitude, longitude, radius = 2000, starttime, endtime } = params;
    const { starttime: defaultStarttime, endtime: defaultEndtime } = this.getDateRange();
    
    try {
      const response = await axios.get<EarthquakeResponse>(this.getApiUrl(), {
        params: {
          format: 'geojson',
          latitude,
          longitude,
          maxradiuskm: radius,
          starttime: starttime || defaultStarttime,
          endtime: endtime || defaultEndtime,
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