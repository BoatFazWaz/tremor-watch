import { useState, useEffect } from 'react';
import { Card, Title, Text, Grid, Button, TextInput, Select, SelectItem } from '@tremor/react';
import { EarthquakeMap } from './components/EarthquakeMap';
import { api } from './services/api';
import { EarthquakeFeature } from './types/earthquake';

function App() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
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
    <div className="p-4 max-w-7xl mx-auto">
      <Title className="mb-4">Tremor Watch</Title>
      
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4 mb-4">
        <Card>
          <Title>Location Settings</Title>
          <div className="mt-4 space-y-4">
            <div>
              <Text>Latitude</Text>
              <TextInput
                value={latitude.toString()}
                onChange={(e) => setLatitude(Number(e.target.value))}
                placeholder="Enter latitude"
              />
            </div>
            <div>
              <Text>Longitude</Text>
              <TextInput
                value={longitude.toString()}
                onChange={(e) => setLongitude(Number(e.target.value))}
                placeholder="Enter longitude"
              />
            </div>
            <div>
              <Text>Radius (km)</Text>
              <TextInput
                value={radius.toString()}
                onChange={(e) => setRadius(Number(e.target.value))}
                placeholder="Enter radius"
              />
            </div>
            <div>
              <Text>Time Range</Text>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </Select>
            </div>
            <Button loading={loading} onClick={fetchEarthquakes}>
              Update Map
            </Button>
          </div>
        </Card>

        <Card>
          <Title>Statistics</Title>
          <div className="mt-4 space-y-2">
            <Text>Total Earthquakes: {earthquakes.length}</Text>
            <Text>
              Magnitude Range:{' '}
              {earthquakes.length > 0
                ? `${Math.min(...earthquakes.map(e => e.properties.mag)).toFixed(1)} - ${Math.max(
                    ...earthquakes.map(e => e.properties.mag)
                  ).toFixed(1)}`
                : 'N/A'}
            </Text>
            <Text>
              Average Magnitude:{' '}
              {earthquakes.length > 0
                ? (
                    earthquakes.reduce((sum, e) => sum + e.properties.mag, 0) / earthquakes.length
                  ).toFixed(2)
                : 'N/A'}
            </Text>
          </div>
        </Card>
      </Grid>

      {error && (
        <Card className="mb-4">
          <Text className="text-red-500">{error}</Text>
        </Card>
      )}

      <Card>
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
