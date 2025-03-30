import axios from 'axios';
import { EarthquakeResponse, EarthquakeQueryParams } from '../types/earthquake';

const USGS_API_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export const api = {
  async getEarthquakesByLocation(params: EarthquakeQueryParams): Promise<EarthquakeResponse> {
    const { latitude, longitude, radius = 100, starttime, endtime } = params;
    
    const queryParams = {
      format: 'geojson',
      latitude,
      longitude,
      maxradiuskm: radius,
      starttime: starttime || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to last 30 days
      endtime: endtime || new Date().toISOString(),
      minmagnitude: 2.5, // Filter out smaller earthquakes
      orderby: 'magnitude', // Order by magnitude
      limit: 100 // Limit results
    };

    const response = await axios.get<EarthquakeResponse>(USGS_API_BASE_URL, {
      params: queryParams,
    });
    return response.data;
  },

  async getEarthquakes(): Promise<EarthquakeResponse> {
    const queryParams = {
      format: 'geojson',
      starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      endtime: new Date().toISOString(),
      minmagnitude: 2.5,
      orderby: 'magnitude',
      limit: 100
    };

    const response = await axios.get<EarthquakeResponse>(USGS_API_BASE_URL, {
      params: queryParams,
    });
    return response.data;
  },
}; 