import axios from 'axios';
import { EarthquakeResponse, EarthquakeQueryParams } from '../types/earthquake';

const API_BASE_URL = '/api';

export const api = {
  async getEarthquakesByLocation(params: EarthquakeQueryParams): Promise<EarthquakeResponse> {
    const response = await axios.get<EarthquakeResponse>(`${API_BASE_URL}/earthquakes/location`, {
      params,
    });
    return response.data;
  },

  async getEarthquakes(): Promise<EarthquakeResponse> {
    const response = await axios.get<EarthquakeResponse>(`${API_BASE_URL}/earthquakes`);
    return response.data;
  },
}; 