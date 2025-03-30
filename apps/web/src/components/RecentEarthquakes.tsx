import { useState, useMemo } from 'react';
import { EarthquakeFeature } from '../types/earthquake';
import { Card } from './ui/Card';
import { 
  ClockIcon, 
  ChevronUpIcon, 
  ChevronDownIcon, 
  DownloadIcon,
  FilterIcon,
  InfoIcon
} from './icons';
import clsx from 'clsx';

interface RecentEarthquakesProps {
  earthquakes: EarthquakeFeature[];
  loading?: boolean;
}

type SortField = 'time' | 'magnitude' | 'depth';
type SortDirection = 'asc' | 'desc';
type ExportFormat = 'csv' | 'json' | 'excel';

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

export function RecentEarthquakes({ earthquakes, loading = false }: RecentEarthquakesProps) {
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [minMagnitude, setMinMagnitude] = useState<number | ''>('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const itemsPerPage = 10;

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
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [earthquakes, sortField, sortDirection, minMagnitude, searchLocation]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedEarthquakes.length / itemsPerPage);
  const paginatedEarthquakes = filteredAndSortedEarthquakes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

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
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <DownloadIcon />
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEarthquakes.map((earthquake) => (
                  <tr key={earthquake.id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        earthquake.properties.status === 'reviewed'
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      )}>
                        {earthquake.properties.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setShowDetails(showDetails === earthquake.id ? null : earthquake.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <InfoIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Earthquake Details Modal */}
        {showDetails && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
              style={{ zIndex: 9999 }}
              onClick={() => setShowDetails(null)}
            />
            {/* Modal */}
            <div 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-4"
              style={{ zIndex: 10000 }}
            >
              <div className="relative bg-white rounded-lg shadow-xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Earthquake Details</h3>
                  <button
                    onClick={() => setShowDetails(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Modal Content */}
                <div className="p-6">
                  {(() => {
                    const earthquake = filteredAndSortedEarthquakes.find(e => e.id === showDetails);
                    if (!earthquake) return null;
                    return (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Location</h4>
                          <p className="mt-1 text-sm text-gray-900">{earthquake.properties.place}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Magnitude</h4>
                          <p className="mt-1 text-sm text-gray-900">{earthquake.properties.mag.toFixed(1)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Time</h4>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(earthquake.properties.time)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Depth</h4>
                          <p className="mt-1 text-sm text-gray-900">{earthquake.geometry.coordinates[2].toFixed(1)} km</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Status</h4>
                          <p className="mt-1 text-sm text-gray-900">{earthquake.properties.status}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Alert Level</h4>
                          <p className="mt-1 text-sm text-gray-900">{earthquake.properties.alert || 'None'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Tsunami Warning</h4>
                          <p className="mt-1 text-sm text-gray-900">{earthquake.properties.tsunami ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Felt Reports</h4>
                          <p className="mt-1 text-sm text-gray-900">{earthquake.properties.felt || 0} reports</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">More Information</h4>
                          <a
                            href={earthquake.properties.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            View on USGS Website
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </>
        )}

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