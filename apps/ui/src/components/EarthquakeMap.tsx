import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EarthquakeFeature } from '../types/earthquake';

interface EarthquakeMapProps {
  earthquakes: EarthquakeFeature[];
  center?: [number, number];
  zoom?: number;
}

export function EarthquakeMap({ earthquakes, center = [0, 0], zoom = 2 }: EarthquakeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    earthquakes.forEach(earthquake => {
      const [lng, lat] = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;
      const marker = L.circleMarker([lat, lng], {
        radius: Math.max(5, magnitude * 3),
        fillColor: getMagnitudeColor(magnitude),
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(`
          <strong>Magnitude ${magnitude}</strong><br>
          ${earthquake.properties.place}<br>
          ${new Date(earthquake.properties.time).toLocaleString()}
        `)
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [earthquakes, center, zoom]);

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return '#ff0000';
  if (magnitude >= 6) return '#ff4500';
  if (magnitude >= 5) return '#ff8c00';
  if (magnitude >= 4) return '#ffd700';
  return '#90ee90';
} 