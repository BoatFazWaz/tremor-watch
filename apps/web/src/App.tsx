import { useState } from 'react';
import RootLayout from './app/layout';
import { Header } from './components/Header';
import { LocationSettings } from './components/LocationSettings';
import { MapSection } from './components/MapSection';
import { RecentEarthquakes } from './components/RecentEarthquakes';
import { useEarthquakes } from './hooks/useEarthquakes';

function App() {
  const [latitude, setLatitude] = useState(13.7454881);
  const [longitude, setLongitude] = useState(100.5622455);
  const [radius, setRadius] = useState(2000);
  const [timeRange, setTimeRange] = useState('24h');
  const [limit, setLimit] = useState(10);

  const { earthquakes, loading, error, refetch } = useEarthquakes({
    latitude,
    longitude,
    radius,
    timeRange,
    limit,
  });

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header loading={loading} onRefresh={refetch} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LocationSettings
              latitude={latitude}
              longitude={longitude}
              radius={radius}
              timeRange={timeRange}
              limit={limit}
              onLatitudeChange={setLatitude}
              onLongitudeChange={setLongitude}
              onRadiusChange={setRadius}
              onTimeRangeChange={setTimeRange}
              onLimitChange={setLimit}
            />

            <MapSection
              earthquakes={earthquakes}
              latitude={latitude}
              longitude={longitude}
              radius={radius}
              onCenterChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            <RecentEarthquakes 
              earthquakes={earthquakes} 
              loading={loading}
              latitude={latitude}
              longitude={longitude}
            />
          </div>
        </main>
      </div>
    </RootLayout>
  );
}

export default App;
