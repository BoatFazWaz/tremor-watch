import { Request, Response } from 'express';
import { EarthquakeService } from '../services/earthquake.service';
import { EarthquakeQueryParams } from '../types/earthquake';

export class EarthquakeController {
  public static async getEarthquakes(req: Request, res: Response): Promise<void> {
    try {
      const earthquakes = await EarthquakeService.getEarthquakes();
      res.json(earthquakes);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  public static async getEarthquakesByLocation(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, radius, starttime, endtime } = req.query;

      // Validate required parameters
      if (!latitude || !longitude) {
        res.status(400).json({
          error: 'Latitude and longitude are required parameters',
        });
        return;
      }

      // Convert and validate numeric parameters
      const params: EarthquakeQueryParams = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };

      if (isNaN(params.latitude) || isNaN(params.longitude)) {
        res.status(400).json({
          error: 'Latitude and longitude must be valid numbers',
        });
        return;
      }

      // Validate coordinate ranges
      if (params.latitude < -90 || params.latitude > 90) {
        res.status(400).json({
          error: 'Latitude must be between -90 and 90 degrees',
        });
        return;
      }

      if (params.longitude < -180 || params.longitude > 180) {
        res.status(400).json({
          error: 'Longitude must be between -180 and 180 degrees',
        });
        return;
      }

      // Add optional parameters if provided
      if (radius) {
        const radiusNum = Number(radius);
        if (isNaN(radiusNum) || radiusNum <= 0) {
          res.status(400).json({
            error: 'Radius must be a positive number',
          });
          return;
        }
        params.radius = radiusNum;
      }

      if (starttime) {
        params.starttime = starttime as string;
      }

      if (endtime) {
        params.endtime = endtime as string;
      }

      const earthquakes = await EarthquakeService.getEarthquakesByLocation(params);
      res.json(earthquakes);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
} 