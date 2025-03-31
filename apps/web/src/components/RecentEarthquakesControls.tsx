import { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { FilterIcon, ChevronUpIcon, ChevronDownIcon, DownloadIcon } from './icons';
import clsx from 'clsx';

interface RecentEarthquakesControlsProps {
  sortField: 'time' | 'magnitude' | 'depth' | 'distance';
  sortDirection: 'asc' | 'desc';
  minMagnitude: number | '';
  searchLocation: string;
  onSortChange: (field: 'time' | 'magnitude' | 'depth' | 'distance') => void;
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
  onMinMagnitudeChange: (magnitude: number | '') => void;
  onSearchLocationChange: (location: string) => void;
  onExport: (format: 'csv' | 'json' | 'excel') => void;
}

export function RecentEarthquakesControls({
  sortField,
  sortDirection,
  minMagnitude,
  searchLocation,
  onSortChange,
  onSortDirectionChange,
  onMinMagnitudeChange,
  onSearchLocationChange,
  onExport
}: RecentEarthquakesControlsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: 'time' | 'magnitude' | 'depth' | 'distance') => {
    if (sortField === field) {
      onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field);
      onSortDirectionChange('desc');
    }
  };

  return (
    <div className="relative sm:hidden">
      {/* Mobile Controls Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
        aria-label="toggle filters menu"
        aria-expanded={isMenuOpen}
      >
        <FilterIcon className="h-4 w-4" />
        <span>Filters & Sort</span>
      </button>

      {/* Mobile Controls Menu */}
      <div
        ref={menuRef}
        className={clsx(
          "fixed inset-0 z-[100] transition-all duration-300",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Menu Content */}
        <div className="relative z-[101] bg-white p-4 max-w-sm mx-auto mt-16 rounded-lg shadow-lg space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Filters & Sort</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              aria-label="close menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Search Location */}
          <div className="space-y-2">
            <label htmlFor="location-search" className="block text-sm font-medium text-gray-700">
              Search Location
            </label>
            <input
              id="location-search"
              type="text"
              value={searchLocation}
              onChange={(e) => onSearchLocationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location..."
            />
          </div>

          {/* Magnitude Filters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Minimum Magnitude
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[3.0, 4.0, 5.0, 6.0].map((mag) => (
                <button
                  key={mag}
                  onClick={() => onMinMagnitudeChange(minMagnitude === mag ? '' : mag)}
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

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <div className="space-y-2">
              {[
                { field: 'time', label: 'Time' },
                { field: 'magnitude', label: 'Magnitude' },
                { field: 'distance', label: 'Distance' }
              ].map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field as 'time' | 'magnitude' | 'depth' | 'distance')}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md",
                    sortField === field
                      ? "bg-blue-50 text-blue-800"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span>{label}</span>
                  {sortField === field && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <DownloadIcon />
                Export Data
              </button>
              {showExportMenu && (
                <div className="absolute inset-x-0 top-full mt-2 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      onExport('csv');
                      setShowExportMenu(false);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      onExport('json');
                      setShowExportMenu(false);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => {
                      onExport('excel');
                      setShowExportMenu(false);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 