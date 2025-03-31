import { useState, useEffect, useCallback, useRef } from 'react';
import { showNewEarthquakeToast, showErrorToast, showLiveMonitoringToast } from '../components/Toast';
import { calculateDistance, calculateArrivalTime } from '../components/RecentEarthquakes';
import { Earthquake } from '../types/earthquake';

interface UseLiveMonitoringProps {
  earthquakes: Earthquake[];
  latitude: number;
  longitude: number;
  timeRange: string;
  refetch: () => Promise<void>;
}

export function useLiveMonitoring({
  earthquakes,
  latitude,
  longitude,
  timeRange,
  refetch
}: UseLiveMonitoringProps) {
  const [isLiveFetchEnabled, setIsLiveFetchEnabled] = useState(false);
  const [lastCheckedEarthquakeId, setLastCheckedEarthquakeId] = useState<string | null>(null);
  const [previousTimeRange, setPreviousTimeRange] = useState<string | null>(null);

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

    const travelTimes = calculateArrivalTime(distance);

    // Show toast notification for new earthquake
    showNewEarthquakeToast(latestEarthquake, travelTimes);

    // Check if we have permission to send notifications
    if (Notification.permission === "granted") {
      // Create notification with earthquake details
      new Notification("New Earthquake Detected!", {
        body: `Magnitude ${latestEarthquake.properties.mag} earthquake detected.\nLocation: ${latestEarthquake.properties.place}\nP-wave arrival: ${travelTimes.pWave.formatted}\nS-wave arrival: ${travelTimes.sWave.formatted}`,
        icon: "/favicon.ico"
      });
    }

    setLastCheckedEarthquakeId(latestEarthquake.id);
  }, [earthquakes, lastCheckedEarthquakeId, latitude, longitude]);

  // Request notification permission when live monitoring is enabled
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      showErrorToast(new Error("This browser does not support desktop notifications"));
      return;
    }

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        showErrorToast(new Error("Please enable notifications to receive earthquake alerts."));
      }
    }
  };

  // Set up live monitoring interval
  useEffect(() => {
    const fetchData = async () => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        await refetch();
        checkForNewEarthquakes();
      } catch (error) {
        console.error('Error fetching earthquake data:', error);
        showErrorToast(error instanceof Error ? error : new Error('An unexpected error occurred'));
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
      showLiveMonitoringToast(true);
    } else {
      // Stopping live monitoring
      if (previousTimeRange) {
        // Note: We return the previous time range instead of setting it directly
        setPreviousTimeRange(null);
      }
      // Clear interval immediately when stopping
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      showLiveMonitoringToast(false);
    }
    setIsLiveFetchEnabled(!isLiveFetchEnabled);
  }, [isLiveFetchEnabled, timeRange, previousTimeRange]);

  // Initial check for earthquakes when enabled
  useEffect(() => {
    if (isLiveFetchEnabled && earthquakes.length > 0) {
      checkForNewEarthquakes();
    }
  }, [isLiveFetchEnabled, earthquakes, checkForNewEarthquakes]);

  return {
    isLiveFetchEnabled,
    previousTimeRange,
    handleToggleLiveFetch
  };
} 