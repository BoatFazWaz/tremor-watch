import axios, { AxiosResponse, AxiosError } from 'axios';
import { EarthquakeService } from './earthquake.service';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Mock axios
vi.mock('axios');

// Load fixture data
const fixturePath = resolve(__dirname, '../test/fixtures/earthquake-data.json');
const mockEarthquakeData = JSON.parse(readFileSync(fixturePath, 'utf-8'));

describe('EarthquakeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEarthquakes', () => {
    it('should fetch earthquake data successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: mockEarthquakeData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await EarthquakeService.getEarthquakes();

      expect(result).toEqual(mockEarthquakeData);
      expect(axios.get).toHaveBeenCalledWith(
        process.env.USGS_API_URL,
        expect.objectContaining({
          params: expect.objectContaining({
            format: 'geojson',
            starttime: expect.any(String),
            endtime: expect.any(String),
          }),
        }),
      );
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      (axios.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error(errorMessage));

      await expect(EarthquakeService.getEarthquakes()).rejects.toThrow(
        `Failed to fetch earthquake data: ${errorMessage}`,
      );
    });

    it('should use correct date range', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          type: 'FeatureCollection',
          metadata: { count: 0 },
          features: [],
          bbox: [0, 0, 0, 0, 0, 0],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      await EarthquakeService.getEarthquakes();

      const call = (axios.get as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
      const params = call[1].params;

      // Check that starttime is yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(params.starttime).toBe(yesterday.toISOString().split('T')[0]);

      // Check that endtime is today
      const today = new Date();
      expect(params.endtime).toBe(today.toISOString().split('T')[0]);
    });

    it('should handle empty response', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          type: 'FeatureCollection',
          metadata: { count: 0 },
          features: [],
          bbox: [0, 0, 0, 0, 0, 0],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

      const result = await EarthquakeService.getEarthquakes();

      expect(result).toEqual(mockResponse.data);
      expect(result.features).toHaveLength(0);
    });
  });
}); 