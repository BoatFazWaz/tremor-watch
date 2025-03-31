import { useState } from 'react';
import RootLayout from './app/layout';
import { Header } from './components/Header';
import { LocationSettings } from './components/LocationSettings';
import { MapSection } from './components/MapSection';
import { RecentEarthquakes } from './components/RecentEarthquakes';
import { useEarthquakes } from './hooks/useEarthquakes';
import { useLiveMonitoring } from './hooks/useLiveMonitoring';
import { Toaster } from 'react-hot-toast';
import { Footer } from './components/Footer';

function App() {
  const [latitude, setLatitude] = useState(13.7454881);
  const [longitude, setLongitude] = useState(100.5622455);
  const [radius, setRadius] = useState(2000);
  const [timeRange, setTimeRange] = useState('7d');
  const [limit, setLimit] = useState(50);

  const { earthquakes, loading, refetch } = useEarthquakes({
    latitude,
    longitude,
    radius,
    timeRange,
    limit,
  });

  const { isLiveFetchEnabled, handleToggleLiveFetch } = useLiveMonitoring({
    earthquakes,
    latitude,
    longitude,
    timeRange,
    refetch
  });

  return (
    <RootLayout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
          <Toaster />
          <Header 
            loading={loading} 
            onRefresh={refetch}
            isLiveFetchEnabled={isLiveFetchEnabled}
            onToggleLiveFetch={handleToggleLiveFetch}
          />
          
          <main className="w-full h-full px-4 py-8">
            <div className="grid grid-cols-6 gap-6 h-full">
              <div className="col-span-4 h-full">
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
              </div>

              <div className="col-span-2">
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
                  onRefresh={refetch}
                />

                <div className="mt-6">
                  <RecentEarthquakes 
                    earthquakes={earthquakes} 
                    loading={loading}
                    latitude={latitude}
                    longitude={longitude}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </RootLayout>
  );
}

export default App;
