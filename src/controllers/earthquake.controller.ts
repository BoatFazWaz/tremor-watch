import { Request, Response } from 'express';
import { EarthquakeService } from '../services/earthquake.service';

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
} 