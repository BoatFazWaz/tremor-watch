import { useState, useEffect } from 'react';
import { Card, Title, Text, Grid, Button, TextInput, Select, SelectItem } from '@tremor/react';
import { EarthquakeMap } from './components/EarthquakeMap';
import { api } from './services/api';
import { EarthquakeFeature } from './types/earthquake';
import './App.css';

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
    <div className="app-container">
      <header className="header">
        <h1 className="title">Tremor Watch</h1>
        <Button 
          loading={loading} 
          onClick={fetchEarthquakes}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Refresh Data
        </Button>
      </header>
      
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
        <Card className="settings-card">
          <Title>Location Settings</Title>
          <div className="mt-4 space-y-4">
            <div>
              <Text>Latitude</Text>
              <TextInput
                value={latitude.toString()}
                onChange={(e) => setLatitude(Number(e.target.value))}
                placeholder="Enter latitude"
                className="mt-1"
              />
            </div>
            <div>
              <Text>Longitude</Text>
              <TextInput
                value={longitude.toString()}
                onChange={(e) => setLongitude(Number(e.target.value))}
                placeholder="Enter longitude"
                className="mt-1"
              />
            </div>
            <div>
              <Text>Radius (km)</Text>
              <TextInput
                value={radius.toString()}
                onChange={(e) => setRadius(Number(e.target.value))}
                placeholder="Enter radius"
                className="mt-1"
              />
            </div>
            <div>
              <Text>Time Range</Text>
              <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
                className="mt-1"
              >
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <Title className="stats-title">Statistics</Title>
          <div className="mt-4 space-y-4">
            <div>
              <Text className="text-blue-100">Total Earthquakes</Text>
              <div className="stats-value">{earthquakes.length}</div>
            </div>
            <div>
              <Text className="text-blue-100">Magnitude Range</Text>
              <div className="stats-value">
                {earthquakes.length > 0
                  ? `${Math.min(...earthquakes.map(e => e.properties.mag)).toFixed(1)} - ${Math.max(
                      ...earthquakes.map(e => e.properties.mag)
                    ).toFixed(1)}`
                  : 'N/A'}
              </div>
            </div>
            <div>
              <Text className="text-blue-100">Average Magnitude</Text>
              <div className="stats-value">
                {earthquakes.length > 0
                  ? (
                      earthquakes.reduce((sum, e) => sum + e.properties.mag, 0) / earthquakes.length
                    ).toFixed(2)
                  : 'N/A'}
              </div>
            </div>
          </div>
        </Card>
      </Grid>

      {error && (
        <div className="error-card">
          <Text>{error}</Text>
        </div>
      )}

      <Card className="map-container">
        <EarthquakeMap
          earthquakes={earthquakes}
          center={[latitude, longitude]}
          zoom={6}
        />
      </Card>
    </div>
  );
}

export default App;
