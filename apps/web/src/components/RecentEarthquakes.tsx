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
  const [currentPage, setCurrentPage] = useState(1);
  const [minMagnitude, setMinMagnitude] = useState<number | ''>('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeFeature | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const itemsPerPage = 10;

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedEarthquakes.length / itemsPerPage);
  const paginatedEarthquakes = filteredAndSortedEarthquakes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ClockIcon />
            <h2 className="text-lg font-semibold text-gray-900">Recent Earthquakes</h2>
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

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Magnitude
              </label>
              <input
                type="number"
                value={minMagnitude}
                onChange={(e) => {
                  setMinMagnitude(e.target.value ? Number(e.target.value) : '');
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by magnitude"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Location
              </label>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => {
                  setSearchLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by location"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMinMagnitude(6)}
              className={clsx(
                "px-3 py-1 text-sm font-medium rounded-full",
                "bg-red-100 text-red-800 hover:bg-red-200"
              )}
            >
              Magnitude ≥ 6.0
            </button>
            <button
              onClick={() => setMinMagnitude(5)}
              className={clsx(
                "px-3 py-1 text-sm font-medium rounded-full",
                "bg-orange-100 text-orange-800 hover:bg-orange-200"
              )}
            >
              Magnitude ≥ 5.0
            </button>
            <button
              onClick={() => setMinMagnitude(4)}
              className={clsx(
                "px-3 py-1 text-sm font-medium rounded-full",
                "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              )}
            >
              Magnitude ≥ 4.0
            </button>
            <button
              onClick={() => setMinMagnitude(3)}
              className={clsx(
                "px-3 py-1 text-sm font-medium rounded-full",
                "bg-green-100 text-green-800 hover:bg-green-200"
              )}
            >
              Magnitude ≥ 3.0
            </button>
            <button
              onClick={() => setMinMagnitude('')}
              className={clsx(
                "px-3 py-1 text-sm font-medium rounded-full",
                "bg-gray-100 text-gray-800 hover:bg-gray-200"
              )}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('time')}
                  >
                    <div className="flex items-center gap-1">
                      Time
                      {sortField === 'time' && (
                        sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('magnitude')}
                  >
                    <div className="flex items-center gap-1">
                      Magnitude
                      {sortField === 'magnitude' && (
                        sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('depth')}
                  >
                    <div className="flex items-center gap-1">
                      Depth
                      {sortField === 'depth' && (
                        sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('distance')}
                  >
                    <div className="flex items-center gap-1">
                      Distance
                      {sortField === 'distance' && (
                        sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potential Effect
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Travel Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEarthquakes.map((earthquake) => {
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
                    <tr 
                      key={earthquake.id} 
                      onClick={() => setSelectedEarthquake(earthquake)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(earthquake.properties.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          earthquake.properties.mag >= 6
                            ? "bg-red-100 text-red-800"
                            : earthquake.properties.mag >= 5
                            ? "bg-orange-100 text-orange-800"
                            : earthquake.properties.mag >= 4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        )}>
                          {earthquake.properties.mag.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {earthquake.properties.place}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {earthquake.geometry.coordinates[2].toFixed(1)} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {distance.toFixed(1)} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          getEffectColor(effect)
                        )}>
                          {effect}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {travelTimes.pWave.formatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Earthquake Details Modal */}
        <EarthquakeDetailsModal
          earthquake={selectedEarthquake}
          onClose={() => setSelectedEarthquake(null)}
          latitude={latitude}
          longitude={longitude}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedEarthquakes.length)} of {filteredAndSortedEarthquakes.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={clsx(
                  "px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50",
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                )}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={clsx(
                  "px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50",
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 