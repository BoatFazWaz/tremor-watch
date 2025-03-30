import { useState, useEffect } from 'react';
import { EarthquakeMap } from './components/EarthquakeMap';
import { RecentEarthquakes } from './components/RecentEarthquakes';
import { api } from './services/api';
import { EarthquakeFeature } from './types/earthquake';
import { SettingsIcon, MapIcon } from './components/icons';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import RootLayout from './app/layout';
import { useDebounce } from './hooks/useDebounce';
import clsx from 'clsx';

function App() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(13.7454881);
  const [longitude, setLongitude] = useState(100.5622455);
  const [radius, setRadius] = useState(2000);
  const [timeRange, setTimeRange] = useState('24h');
  const [limit, setLimit] = useState(10);

  // Only debounce radius changes, pin location should update immediately
  const debouncedRadius = useDebounce(radius, 300);

  const fetchEarthquakes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate start time based on time range
      const now = new Date();
      let starttime: string;
      
      switch (timeRange) {
        case '1h':
          starttime = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
          break;
        case '24h':
          starttime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
          break;
        case '7d':
          starttime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '30d':
          starttime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        default:
          starttime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      }

      const response = await api.getEarthquakesByLocation({
        latitude,
        longitude,
        radius: debouncedRadius,
        starttime,
        endtime: new Date().toISOString(),
        limit
      });

      setEarthquakes(response.features);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch earthquakes');
    } finally {
      setLoading(false);
    }
  };

  // Update when location, radius, time range, or limit changes
  useEffect(() => {
    fetchEarthquakes();
  }, [latitude, longitude, debouncedRadius, timeRange, limit]);

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Tremor Watch</h1>
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  Live Data
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  loading={loading} 
                  onClick={fetchEarthquakes}
                >
                  Refresh Data
                </Button>
                <a
                  href="https://github.com/BoatFazWaz/tremor-watch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Card */}
            <Card className="hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SettingsIcon />
                  <h2 className="text-lg font-semibold text-gray-900">Location Settings</h2>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Latitude"
                    type="number"
                    value={latitude.toString()}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    placeholder="Enter latitude"
                    min={-90}
                    max={90}
                    step="any"
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    value={longitude.toString()}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    placeholder="Enter longitude"
                    min={-180}
                    max={180}
                    step="any"
                  />
                  <div className="space-y-2">
                    <Input
                      label="Radius (km)"
                      type="number"
                      value={radius.toString()}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      placeholder="Enter radius"
                      min={1}
                      max={20000}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setRadius(500)}
                        className={clsx(
                          "px-3 py-1 text-sm font-medium rounded-full transition-colors",
                          radius === 500
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        )}
                      >
                        500 km
                      </button>
                      <button
                        onClick={() => setRadius(1000)}
                        className={clsx(
                          "px-3 py-1 text-sm font-medium rounded-full transition-colors",
                          radius === 1000
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        )}
                      >
                        1000 km
                      </button>
                      <button
                        onClick={() => setRadius(2000)}
                        className={clsx(
                          "px-3 py-1 text-sm font-medium rounded-full transition-colors",
                          radius === 2000
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        )}
                      >
                        2000 km
                      </button>
                    </div>
                  </div>
                  <Select
                    label="Time Range"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </Select>
                  <Select
                    label="Results Limit"
                    value={limit.toString()}
                    onChange={(e) => setLimit(Number(e.target.value))}
                  >
                    <option value="10">10 Records</option>
                    <option value="25">25 Records</option>
                    <option value="50">50 Records</option>
                    <option value="100">100 Records</option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Map Card */}
            <Card className="lg:col-span-2">
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
                    onCenterChange={(lat, lng) => {
                      setLatitude(lat);
                      setLongitude(lng);
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Recent Earthquakes Card */}
            <RecentEarthquakes earthquakes={earthquakes} loading={loading} />
          </div>
        </main>
      </div>
    </RootLayout>
  );
}

export default App;
