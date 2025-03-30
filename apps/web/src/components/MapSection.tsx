import { Card } from './ui/Card';
import { MapIcon } from './icons';
import { EarthquakeMap } from './EarthquakeMap';
import { EarthquakeFeature } from '../types/earthquake';

interface MapSectionProps {
  earthquakes: EarthquakeFeature[];
  latitude: number;
  longitude: number;
  radius: number;
  onCenterChange: (lat: number, lng: number) => void;
}

export const MapSection: React.FC<MapSectionProps> = ({
  earthquakes,
  latitude,
  longitude,
  radius,
  onCenterChange,
}) => {
  return (
    <Card className="lg:col-span-3">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapIcon />
          <h2 className="text-lg font-semibold text-gray-900">Earthquake Map</h2>
        </div>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <EarthquakeMap
            earthquakes={earthquakes}
            center={[latitude, longitude]}
            zoom={6}
            radius={radius}
            onCenterChange={onCenterChange}
          />
        </div>
      </div>
    </Card>
  );
}; 