import { useState, useEffect } from 'react';
import { EarthquakeMap } from './components/EarthquakeMap';
import { RecentEarthquakes } from './components/RecentEarthquakes';
import { api } from './services/api';
import { EarthquakeFeature } from './types/earthquake';
import { SettingsIcon, ChartIcon, MapIcon, ErrorIcon } from './components/icons';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';

function App() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(13.7454881);
  const [longitude, setLongitude] = useState(100.5622455);
  const [radius, setRadius] = useState(2000);
  const [timeRange, setTimeRange] = useState('24h');

  const fetchEarthquakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getEarthquakesByLocation({
        latitude,
        longitude,
        radius,
      });
      setEarthquakes(response.features);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch earthquake data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
  }, []);

  return (
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
            <Button 
              loading={loading} 
              onClick={fetchEarthquakes}
            >
              Refresh Data
            </Button>
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
                />
                <Input
                  label="Longitude"
                  type="number"
                  value={longitude.toString()}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  placeholder="Enter longitude"
                />
                <Input
                  label="Radius (km)"
                  type="number"
                  value={radius.toString()}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  placeholder="Enter radius"
                />
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
              </div>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ChartIcon />
                <h2 className="text-lg font-semibold text-white">Statistics</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Earthquakes</p>
                  <div className="text-3xl font-bold text-white mt-1">{earthquakes.length}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100">Magnitude Range</p>
                  <div className="text-3xl font-bold text-white mt-1">
                    {earthquakes.length > 0
                      ? `${Math.min(...earthquakes.map(e => e.properties.mag)).toFixed(1)} - ${Math.max(
                          ...earthquakes.map(e => e.properties.mag)
                        ).toFixed(1)}`
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100">Average Magnitude</p>
                  <div className="text-3xl font-bold text-white mt-1">
                    {earthquakes.length > 0
                      ? (
                          earthquakes.reduce((sum, e) => sum + e.properties.mag, 0) / earthquakes.length
                        ).toFixed(2)
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Map Card */}
          <Card className="lg:col-span-3">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapIcon />
                <h2 className="text-lg font-semibold text-gray-900">Earthquake Map</h2>
              </div>
              <EarthquakeMap
                earthquakes={earthquakes}
                center={[latitude, longitude]}
                zoom={6}
              />
            </div>
          </Card>

          {/* Recent Earthquakes Card */}
          <RecentEarthquakes earthquakes={earthquakes} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <ErrorIcon />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
