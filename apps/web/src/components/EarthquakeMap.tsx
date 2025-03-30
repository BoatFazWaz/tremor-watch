import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EarthquakeFeature } from '../types/earthquake';

interface EarthquakeMapProps {
  earthquakes: EarthquakeFeature[];
  center?: [number, number];
  zoom?: number;
  onCenterChange?: (lat: number, lng: number) => void;
}

export function EarthquakeMap({ earthquakes, center = [0, 0], zoom = 2, onCenterChange }: EarthquakeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const centerMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    } else {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setView(center, currentZoom);
    }

    // Update center marker
    if (centerMarkerRef.current) {
      centerMarkerRef.current.remove();
    }
    centerMarkerRef.current = L.marker(center, {
      draggable: true,
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
          background-color: #3b82f6;
          width: 12px;
          height: 12px;
          transform: rotate(45deg);
          border: 2px solid white;
          box-shadow: 0 0 0 2px #3b82f6;
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    })
      .bindPopup('Selected Location')
      .addTo(mapRef.current);

    // Add drag event handler
    centerMarkerRef.current.on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng();
      onCenterChange?.(position.lat, position.lng);
    });

    // Clear existing earthquake markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new earthquake markers
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
  }, [earthquakes, center, zoom, onCenterChange]);

  return <div id="map" style={{ height: '500px', width: '100%' }} />;
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return '#ff0000';
  if (magnitude >= 6) return '#ff4500';
  if (magnitude >= 5) return '#ff8c00';
  if (magnitude >= 4) return '#ffd700';
  return '#90ee90';
} 