import { useState, useEffect, useCallback, useRef } from 'react';
import RootLayout from './app/layout';
import { Header } from './components/Header';
import { LocationSettings } from './components/LocationSettings';
import { MapSection } from './components/MapSection';
import { RecentEarthquakes } from './components/RecentEarthquakes';
import { useEarthquakes } from './hooks/useEarthquakes';
import { calculateDistance, calculateArrivalTime } from './components/RecentEarthquakes';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [latitude, setLatitude] = useState(13.7454881);
  const [longitude, setLongitude] = useState(100.5622455);
  const [radius, setRadius] = useState(2000);
  const [timeRange, setTimeRange] = useState('24h');
  const [limit, setLimit] = useState(10);
  const [isLiveFetchEnabled, setIsLiveFetchEnabled] = useState(false);
  const [lastCheckedEarthquakeId, setLastCheckedEarthquakeId] = useState<string | null>(null);

  // Store the original time range when live monitoring starts
  const [previousTimeRange, setPreviousTimeRange] = useState<string | null>(null);

  const { earthquakes, loading, error, refetch } = useEarthquakes({
    latitude,
    longitude,
    radius,
    timeRange: isLiveFetchEnabled ? '1h' : timeRange,
    limit,
  });

  // Use refs to track interval and fetching state
  const intervalRef = useRef<number | null>(null);
  const isFetchingRef = useRef(false);

  const checkForNewEarthquakes = useCallback(() => {
    if (!earthquakes.length) return;

    const latestEarthquake = earthquakes[0];
    if (latestEarthquake.id === lastCheckedEarthquakeId) return;

    // Calculate distance and arrival times for the latest earthquake
    const distance = calculateDistance(
      latitude,
      longitude,
      latestEarthquake.geometry.coordinates[1],
      latestEarthquake.geometry.coordinates[0]
    );

    const travelTimes = calculateArrivalTime(distance, latestEarthquake.properties.time);

    // Show toast notification for new earthquake
    toast((t) => (
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="font-medium text-gray-900">
            New Earthquake Detected!
          </div>
          <div className="mt-1 text-sm text-gray-500">
            <div>Magnitude: {latestEarthquake.properties.mag}</div>
            <div>Location: {latestEarthquake.properties.place}</div>
            <div>P-wave arrival: {travelTimes.pWave.formatted}</div>
            <div>S-wave arrival: {travelTimes.sWave.formatted}</div>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ), {
      duration: 10000, // 10 seconds
      position: 'top-right',
    });

    // Check if we have permission to send notifications
    if (Notification.permission === "granted") {
      // Create notification with earthquake details
      const notification = new Notification("New Earthquake Detected!", {
        body: `Magnitude ${latestEarthquake.properties.mag} earthquake detected.\nLocation: ${latestEarthquake.properties.place}\nP-wave arrival: ${travelTimes.pWave.formatted}\nS-wave arrival: ${travelTimes.sWave.formatted}`,
        icon: "/favicon.ico"
      });
    }

    setLastCheckedEarthquakeId(latestEarthquake.id);
  }, [earthquakes, lastCheckedEarthquakeId, latitude, longitude]);

  // Request notification permission when live monitoring is enabled
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notifications");
      return;
    }

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Please enable notifications to receive earthquake alerts.");
      }
    }
  };

  // Set up live monitoring interval
  useEffect(() => {
    const fetchData = async () => {
      // If already fetching, skip this cycle
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        await refetch();
        checkForNewEarthquakes();
      } catch (error) {
        console.error('Error fetching earthquake data:', error);
        toast.error(
          (t) => (
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="font-medium text-red-800">
                  Failed to Fetch Earthquake Data
                </div>
                <div className="mt-1 text-sm text-red-600">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </div>
                <div className="mt-2 text-xs text-red-500">
                  Retrying in 2 seconds...
                </div>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-red-400 hover:text-red-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ),
          {
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '0.5rem',
            },
          }
        );
      } finally {
        isFetchingRef.current = false;
      }
    };

    const fetchWithDelay = async () => {
      await fetchData();
      // Only schedule next fetch if live monitoring is still enabled
      if (isLiveFetchEnabled) {
        // Wait 2 seconds before next fetch
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Check if still enabled before recursing
        if (isLiveFetchEnabled) {
          fetchWithDelay();
        }
      }
    };

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isLiveFetchEnabled) {
      // Start the fetch cycle
      fetchWithDelay();
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLiveFetchEnabled, refetch, checkForNewEarthquakes]);

  // Handle live monitoring toggle
  const handleToggleLiveFetch = useCallback(() => {
    if (!isLiveFetchEnabled) {
      // Starting live monitoring
      setPreviousTimeRange(timeRange);
      requestNotificationPermission();
      toast.success("Live monitoring started", {
        icon: '🔴',
      });
    } else {
      // Stopping live monitoring
      if (previousTimeRange) {
        setTimeRange(previousTimeRange);
      }
      // Clear interval immediately when stopping
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      toast("Live monitoring stopped", {
        icon: '⚫',
      });
    }
    setIsLiveFetchEnabled(!isLiveFetchEnabled);
  }, [isLiveFetchEnabled, timeRange, previousTimeRange]);

  // Initial check for earthquakes when enabled
  useEffect(() => {
    if (isLiveFetchEnabled && earthquakes.length > 0) {
      checkForNewEarthquakes();
    }
  }, [isLiveFetchEnabled, earthquakes, checkForNewEarthquakes]);

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Toaster />
        <Header 
          loading={loading} 
          onRefresh={refetch}
          isLiveFetchEnabled={isLiveFetchEnabled}
          onToggleLiveFetch={handleToggleLiveFetch}
        />
        
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
