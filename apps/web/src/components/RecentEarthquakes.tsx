import { useState, useMemo, useEffect, useRef } from 'react';
import { EarthquakeFeature } from '../types/earthquake';
import { Card } from './ui/Card';
import { 
  ClockIcon, 
  ChevronUpIcon, 
  ChevronDownIcon, 
  DownloadIcon,
  FilterIcon
} from './icons';
import { EarthquakeDetailsModal } from './EarthquakeDetailsModal';
import clsx from 'clsx';

interface RecentEarthquakesProps {
  earthquakes: EarthquakeFeature[];
  loading?: boolean;
  latitude: number;
  longitude: number;
}

type SortField = 'time' | 'magnitude' | 'depth' | 'distance';
type SortDirection = 'asc' | 'desc';
type ExportFormat = 'csv' | 'json' | 'excel';

export interface WaveTravelTimes {
  pWave: {
    seconds: number;
    formatted: string;
  };
  sWave: {
    seconds: number;
    formatted: string;
  };
}

interface EarthquakeData {
  time: string;
  magnitude: number;
  location: string;
  depth: number;
  status: string;
  alert: string;
  tsunami: string;
  felt: number;
  id: string;
  url: string;
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// Calculate estimated arrival time of seismic waves
export function calculateArrivalTime(distance: number): WaveTravelTimes {
  // P-waves (Primary waves) travel at approximately 6-8 km/s
  // Using average velocity of 7 km/s for P-waves
  const pWaveVelocity = 7; // km/s
  
  // S-waves (Secondary waves) travel at approximately 3.5-4.5 km/s
  // Using average velocity of 4 km/s for S-waves
  const sWaveVelocity = 4; // km/s

  const pWaveSeconds = distance / pWaveVelocity;
  const sWaveSeconds = distance / sWaveVelocity;

  // Format travel times
  const formatTravelTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
    }
  };

  return {
    pWave: {
      seconds: pWaveSeconds,
      formatted: formatTravelTime(pWaveSeconds)
    },
    sWave: {
      seconds: sWaveSeconds,
      formatted: formatTravelTime(sWaveSeconds)
    }
  };
}

// Calculate potential effect based on magnitude, depth, and distance
export function calculateEffect(magnitude: number, depth: number, distance: number): string {
  // Magnitude has exponential impact (each point is 10x stronger)
  const magnitudeFactor = Math.pow(10, magnitude - 5); // normalize around magnitude 5

  // Depth reduces impact (deeper = less effect)
  const depthFactor = 1 / (1 + depth / 100);

  // Distance reduces impact (further = less effect)
  const distanceFactor = 1 / (1 + distance / 100);

  // Combine factors
  const effect = magnitudeFactor * depthFactor * distanceFactor;

  // Categorize effect
  if (effect >= 10) return 'Very Strong';
  if (effect >= 1) return 'Strong';
  if (effect >= 0.1) return 'Moderate';
  if (effect >= 0.01) return 'Light';
  return 'Minimal';
}

export function getEffectColor(effect: string): string {
  switch (effect) {
    case 'Very Strong':
      return 'bg-red-100 text-red-800';
    case 'Strong':
      return 'bg-orange-100 text-orange-800';
    case 'Moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Light':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }).replace(/,/g, '');
}

export function RecentEarthquakes({ earthquakes, loading = false, latitude, longitude }: RecentEarthquakesProps) {
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [minMagnitude, setMinMagnitude] = useState<number | ''>('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeFeature | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        exportMenuRef.current && 
        exportButtonRef.current && 
        !exportMenuRef.current.contains(event.target as Node) &&
        !exportButtonRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter and sort earthquakes
  const filteredAndSortedEarthquakes = useMemo(() => {
    let filtered = [...earthquakes];

    // Apply magnitude filter
    if (minMagnitude !== '') {
      filtered = filtered.filter(e => e.properties.mag >= minMagnitude);
    }

    // Apply location search
    if (searchLocation) {
      filtered = filtered.filter(e => 
        e.properties.place.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'time':
          comparison = b.properties.time - a.properties.time;
          break;
        case 'magnitude':
          comparison = b.properties.mag - a.properties.mag;
          break;
        case 'depth':
          comparison = a.geometry.coordinates[2] - b.geometry.coordinates[2];
          break;
        case 'distance':
          const distA = calculateDistance(latitude, longitude, a.geometry.coordinates[1], a.geometry.coordinates[0]);
          const distB = calculateDistance(latitude, longitude, b.geometry.coordinates[1], b.geometry.coordinates[0]);
          comparison = distA - distB;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [earthquakes, sortField, sortDirection, minMagnitude, searchLocation, latitude, longitude]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportData = (format: ExportFormat) => {
    const data: EarthquakeData[] = filteredAndSortedEarthquakes.map(e => ({
      time: formatDate(e.properties.time),
      magnitude: e.properties.mag,
      location: e.properties.place,
      depth: e.geometry.coordinates[2],
      status: e.properties.status,
      alert: e.properties.alert || 'none',
      tsunami: e.properties.tsunami ? 'Yes' : 'No',
      felt: e.properties.felt || 0,
      id: e.id,
      url: e.properties.url
    }));

    switch (format) {
      case 'csv':
        const headers = Object.keys(data[0]) as (keyof EarthquakeData)[];
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => 
            typeof row[header] === 'string' ? `"${row[header]}"` : row[header]
          ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `earthquakes_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        break;

      case 'json':
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const jsonLink = document.createElement('a');
        jsonLink.href = URL.createObjectURL(jsonBlob);
        jsonLink.download = `earthquakes_${new Date().toISOString().split('T')[0]}.json`;
        jsonLink.click();
        break;

      case 'excel':
        // For Excel export, we'll use a CSV with UTF-8 BOM for better Excel compatibility
        const excelContent = '\ufeff' + [
          Object.keys(data[0]).join('\t'),
          ...data.map(row => Object.values(row).join('\t'))
        ].join('\n');

        const excelBlob = new Blob([excelContent], { type: 'text/tab-separated-values;charset=utf-8;' });
        const excelLink = document.createElement('a');
        excelLink.href = URL.createObjectURL(excelBlob);
        excelLink.download = `earthquakes_${new Date().toISOString().split('T')[0]}.xls`;
        excelLink.click();
        break;
    }
    setShowExportMenu(false);
  };

  return (
    <Card className="lg:col-span-3">
      <div className="h-[640px] flex flex-col">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ClockIcon />
              <h2 className="text-lg font-semibold text-gray-900">Recent Earthquakes</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                >
                  <span>Sort by: {sortField.charAt(0).toUpperCase() + sortField.slice(1)}</span>
                  {sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <button
                      onClick={() => {
                        handleSort('time');
                        setShowSortMenu(false);
                      }}
                      className={clsx(
                        "block w-full text-left px-4 py-2 text-sm",
                        sortField === 'time' 
                          ? "bg-blue-50 text-blue-800" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      Time {sortField === 'time' && (
                        sortDirection === 'asc' ? '(Oldest first)' : '(Latest first)'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleSort('magnitude');
                        setShowSortMenu(false);
                      }}
                      className={clsx(
                        "block w-full text-left px-4 py-2 text-sm",
                        sortField === 'magnitude' 
                          ? "bg-blue-50 text-blue-800" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      Magnitude {sortField === 'magnitude' && (
                        sortDirection === 'asc' ? '(Lowest first)' : '(Highest first)'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleSort('distance');
                        setShowSortMenu(false);
                      }}
                      className={clsx(
                        "block w-full text-left px-4 py-2 text-sm",
                        sortField === 'distance' 
                          ? "bg-blue-50 text-blue-800" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      Distance {sortField === 'distance' && (
                        sortDirection === 'asc' ? '(Nearest first)' : '(Farthest first)'
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  ref={exportButtonRef}
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <DownloadIcon />
                  Export
                </button>
                {showExportMenu && (
                  <div 
                    ref={exportMenuRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  >
                    <button
                      onClick={() => exportData('csv')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => exportData('json')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as JSON
                    </button>
                    <button
                      onClick={() => exportData('excel')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => {
                    setSearchLocation(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by location"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                {[3.0, 4.0, 5.0, 6.0].map((mag) => (
                  <button
                    key={mag}
                    onClick={() => setMinMagnitude(minMagnitude === mag ? 0 : mag)}
                    className={clsx(
                      "px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                      minMagnitude === mag
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                    )}
                  >
                    ≥ {mag.toFixed(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Earthquakes Grid */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto pr-2 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredAndSortedEarthquakes.length === 0 ? (
                <div className="text-center py-12">
                  <FilterIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No earthquakes found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              ) : (
                filteredAndSortedEarthquakes.map((earthquake) => {
                  const distance = calculateDistance(
                    latitude,
                    longitude,
                    earthquake.geometry.coordinates[1],
                    earthquake.geometry.coordinates[0]
                  );

                  const effect = calculateEffect(
                    earthquake.properties.mag,
                    earthquake.geometry.coordinates[2],
                    distance
                  );

                  const travelTimes = calculateArrivalTime(distance);
                  
                  return (
                    <div 
                      key={earthquake.id}
                      onClick={() => setSelectedEarthquake(earthquake)}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">
                            {formatDate(earthquake.properties.time)}
                          </div>
                          <div className="text-base font-medium text-gray-900 max-w-[500px]">
                            {earthquake.properties.place}
                          </div>
                        </div>
                        <span className={clsx(
                          "px-3 py-1 text-sm font-semibold rounded-full",
                          earthquake.properties.mag >= 6
                            ? "bg-red-100 text-red-800"
                            : earthquake.properties.mag >= 5
                            ? "bg-orange-100 text-orange-800"
                            : earthquake.properties.mag >= 4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        )}>
                          M {earthquake.properties.mag.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Distance</div>
                          <div className="font-medium">{distance.toFixed(0)} km</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Effect</div>
                          <span className={clsx(
                            "px-2 py-0.5 text-xs font-semibold rounded-full",
                            getEffectColor(effect)
                          )}>
                            {effect}
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-500">P-Wave</div>
                          <div className="font-medium">{travelTimes.pWave.formatted}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
                        <div>
                          Depth: {earthquake.geometry.coordinates[2].toFixed(1)} km
                        </div>
                        {earthquake.properties.tsunami === 1 && (
                          <div className="text-orange-600 font-medium flex items-center gap-1">
                            Tsunami Warning
                          </div>
                        )}
                        {earthquake.properties.felt && (
                          <div>
                            Felt by {earthquake.properties.felt} people
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Earthquake Details Modal */}
          <EarthquakeDetailsModal
            earthquake={selectedEarthquake}
            onClose={() => setSelectedEarthquake(null)}
            latitude={latitude}
            longitude={longitude}
          />
        </div>
      </div>
    </Card>
  );
} 