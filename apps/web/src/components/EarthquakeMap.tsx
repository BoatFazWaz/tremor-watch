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
  containerId?: string;
  selectedLocation?: [number, number]; // Add selected location coordinates
}

export function EarthquakeMap({ 
  earthquakes, 
  center = [0, 0], 
  zoom = 2, 
  radius = 2000,
  onCenterChange,
  containerId = 'map',
  selectedLocation
}: EarthquakeMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const selectedLocationMarkerRef = useRef<L.Marker | null>(null);
  const connectionLineRef = useRef<L.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(containerId).setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

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
  }, [containerId]);

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

  // Update selected location marker and connection line
  useEffect(() => {
    if (!mapRef.current || !selectedLocation || earthquakes.length === 0) return;

    // Remove existing selected location marker and connection line
    if (selectedLocationMarkerRef.current) {
      selectedLocationMarkerRef.current.remove();
    }
    if (connectionLineRef.current) {
      connectionLineRef.current.remove();
    }

    const [earthquakeLng, earthquakeLat] = earthquakes[0].geometry.coordinates;
    const distance = calculateDistance(
      earthquakeLat,
      earthquakeLng,
      selectedLocation[0],
      selectedLocation[1]
    );

    // Calculate arrival times
    const pWaveVelocity = 7; // km/s
    const sWaveVelocity = 4; // km/s
    const pWaveSeconds = distance / pWaveVelocity;
    const sWaveSeconds = distance / sWaveVelocity;
    
    const earthquakeTime = earthquakes[0].properties.time;
    const pWaveArrival = new Date(earthquakeTime + (pWaveSeconds * 1000));
    const sWaveArrival = new Date(earthquakeTime + (sWaveSeconds * 1000));

    // Format arrival times
    const formatArrivalTime = (date: Date) => {
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    // Add new selected location marker
    selectedLocationMarkerRef.current = L.marker(selectedLocation, {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
          background-color: #10b981;
          width: 12px;
          height: 12px;
          transform: rotate(45deg);
          border: 2px solid white;
          box-shadow: 0 0 0 2px #10b981;
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    })
      .bindPopup(`
        <strong>Seismic Wave Arrival Times:</strong><br>
        P-waves: ${formatArrivalTime(pWaveArrival)}<br>
        S-waves: ${formatArrivalTime(sWaveArrival)}
      `)
      .addTo(mapRef.current);

    // Add connection line between earthquake and selected location
    connectionLineRef.current = L.polyline(
      [
        [earthquakeLat, earthquakeLng],
        selectedLocation
      ],
      {
        color: '#6b7280', // gray-500
        weight: 2,
        dashArray: '4, 8',
        opacity: 0.7,
      }
    ).addTo(mapRef.current);

  }, [selectedLocation, earthquakes]);

  // Update earthquake markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing earthquake markers and connection line
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    if (connectionLineRef.current) {
      connectionLineRef.current.remove();
    }

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

      // Add connection line if selected location exists
      if (selectedLocation) {
        connectionLineRef.current = L.polyline(
          [
            [lat, lng],
            selectedLocation
          ],
          {
            color: '#6b7280', // gray-500
            weight: 2,
            dashArray: '4, 8',
            opacity: 0.7,
          }
        ).addTo(map);
      }
    });
  }, [earthquakes, selectedLocation]);

  return <div id={containerId} style={{ height: '100%', width: '100%' }} />;
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return '#ff0000';
  if (magnitude >= 6) return '#ff4500';
  if (magnitude >= 5) return '#ff8c00';
  if (magnitude >= 4) return '#ffd700';
  return '#90ee90';
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}