import { Card } from './ui/Card';
import { MapIcon } from './icons';
import { EarthquakeMap } from './EarthquakeMap';
import { EarthquakeFeature } from '../types/earthquake';
import { useEffect, useRef, useState } from 'react';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Force map rerender when height changes
      setKey((prev: number) => prev + 1);
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Card className="lg:col-span-3 h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <MapIcon />
          <h2 className="text-lg font-semibold text-gray-900">Earthquake Map</h2>
        </div>
        <div ref={mapContainerRef} className="flex-1 rounded-lg overflow-hidden">
          <EarthquakeMap
            key={key}
            earthquakes={earthquakes}
            center={[latitude, longitude]}
            zoom={5}
            radius={radius}
            onCenterChange={onCenterChange}
          />
        </div>
      </div>
    </Card>
  );
}; 