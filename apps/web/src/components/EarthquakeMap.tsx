import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EarthquakeFeature } from '../types/earthquake';

interface EarthquakeMapProps {
  earthquakes: EarthquakeFeature[];
  center?: [number, number];
  zoom?: number;
  radius?: number; // in kilometers
  onCenterChange?: (lat: number, lng: number) => void;
  containerId?: string; // Add containerId prop
}

export function EarthquakeMap({ 
  earthquakes, 
  center = [0, 0], 
  zoom = 2, 
  radius = 2000, // default radius of 2000km
  onCenterChange,
  containerId = 'map' // Default to 'map' for backwards compatibility
}: EarthquakeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(containerId).setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Only add center marker and radius circle if onCenterChange is provided
      if (onCenterChange) {
        // Initialize center marker
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

        // Initialize radius circle
        radiusCircleRef.current = L.circle(center, {
          radius: radius * 1000, // Convert km to meters
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 1,
          dashArray: '5, 10',
        }).addTo(mapRef.current);

        // Add drag event handler
        centerMarkerRef.current.on('dragend', (event) => {
          const marker = event.target;
          const position = marker.getLatLng();
          // Update radius circle position
          if (radiusCircleRef.current) {
            radiusCircleRef.current.setLatLng(position);
          }
          onCenterChange(position.lat, position.lng);
        });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [containerId]); // Add containerId to dependencies

  // Update center marker and radius circle position
  useEffect(() => {
    if (centerMarkerRef.current && !centerMarkerRef.current.getLatLng().equals(center)) {
      centerMarkerRef.current.setLatLng(center);
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng(center);
      }
    }
    // Update map view if it exists
    if (mapRef.current) {
      mapRef.current.setView(center, mapRef.current.getZoom());
    }
  }, [center]);

  // Update radius circle size
  useEffect(() => {
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setRadius(radius * 1000); // Convert km to meters
    }
  }, [radius]);

  // Update earthquake markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

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
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [earthquakes]);

  return <div id={containerId} style={{ height: '100%', width: '100%' }} />;
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return '#ff0000';
  if (magnitude >= 6) return '#ff4500';
  if (magnitude >= 5) return '#ff8c00';
  if (magnitude >= 4) return '#ffd700';
  return '#90ee90';
} 