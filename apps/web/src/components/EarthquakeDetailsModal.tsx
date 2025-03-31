import { EarthquakeFeature } from '../types/earthquake';
import { EarthquakeMap } from './EarthquakeMap';
import clsx from 'clsx';
import { calculateDistance, calculateEffect, calculateArrivalTime, getEffectColor } from './RecentEarthquakes';

interface EarthquakeDetailsModalProps {
  earthquake: EarthquakeFeature | null;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

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

const getMagnitudeColor = (magnitude: number) => {
  if (magnitude >= 6) return 'bg-red-100 text-red-800';
  if (magnitude >= 5) return 'bg-orange-100 text-orange-800';
  if (magnitude >= 4) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const EarthquakeDetailsModal: React.FC<EarthquakeDetailsModalProps> = ({
  earthquake,
  onClose,
  latitude,
  longitude,
}) => {
  if (!earthquake) return null;

  const {
    properties: {
      mag,
      place,
      time,
      status,
      alert,
      tsunami,
      felt,
      url,
      cdi,
      mmi,
      sig,
      magType,
    },
    geometry: { coordinates },
  } = earthquake;

  const distance = calculateDistance(
    latitude,
    longitude,
    coordinates[1],
    coordinates[0]
  );

  const effect = calculateEffect(
    mag,
    coordinates[2],
    distance
  );

  const travelTimes = calculateArrivalTime(distance);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      {/* Modal */}
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] p-4 overflow-y-auto"
        style={{ zIndex: 10000 }}
      >
        <div className="relative bg-white rounded-xl shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={clsx(
                  "px-3 py-1 text-sm font-semibold rounded-full",
                  getMagnitudeColor(mag)
                )}>
                  Magnitude {mag.toFixed(1)}
                </span>
                {tsunami > 0 && (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    Tsunami Alert
                  </span>
                )}
                {alert && (
                  <span className={clsx(
                    "px-3 py-1 text-sm font-semibold rounded-full",
                    alert === 'green' ? 'bg-green-100 text-green-800' :
                    alert === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    alert === 'orange' ? 'bg-orange-100 text-orange-800' :
                    alert === 'red' ? 'bg-red-100 text-red-800' : ''
                  )}>
                    {alert.charAt(0).toUpperCase() + alert.slice(1)} Alert
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{place}</h3>
                <p className="mt-1 text-sm text-gray-500">{formatDate(time)}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <div className="text-xs text-gray-500">Distance</div>
                  <div className="text-sm font-medium">{distance.toFixed(1)} km</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Potential Effect</div>
                  <span className={clsx(
                    "inline-block px-2 py-0.5 text-sm rounded-full font-medium mt-0.5",
                    getEffectColor(effect)
                  )}>
                    {effect}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Seismic Wave Travel Time</div>
                  <div className="text-sm font-medium space-y-1 mt-1">
                    <div className="flex items-center gap-1">
                      <div className="group relative">
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 cursor-help">
                          P-waves
                        </span>
                        <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-500 text-white text-xs rounded shadow-lg -top-1 left-full ml-1">
                          P-waves (Primary waves) are the fastest seismic waves, traveling through solids and liquids. They compress and expand material in the same direction they travel.
                        </div>
                      </div>
                      <span>{travelTimes.pWave.formatted}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="group relative">
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 cursor-help">
                          S-waves
                        </span>
                        <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-500 text-white text-xs rounded shadow-lg -top-1 left-full ml-1">
                          S-waves (Secondary waves) are slower seismic waves that can only travel through solids. They move material perpendicular to their direction of travel.
                        </div>
                      </div>
                      <span>{travelTimes.sWave.formatted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors flex-shrink-0 ml-4"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Map Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Location Map</h4>
              <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
                <EarthquakeMap
                  earthquakes={[earthquake]}
                  center={[coordinates[1], coordinates[0]]}
                  zoom={8}
                  radius={100}
                  containerId="modal-map"
                  selectedLocation={[latitude, longitude]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Location Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Coordinates</div>
                      <div className="text-sm font-medium">
                        {coordinates[1].toFixed(4)}°N, {coordinates[0].toFixed(4)}°E
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Depth</div>
                      <div className="text-sm font-medium">{coordinates[2].toFixed(1)} km</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Magnitude Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-sm font-medium">{magType.toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Significance</div>
                      <div className="text-sm font-medium">{sig}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {(felt !== null || cdi !== null || mmi !== null) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Impact Assessment</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {felt !== null && (
                        <div>
                          <div className="text-xs text-gray-500">Felt Reports</div>
                          <div className="text-sm font-medium">{felt} reports</div>
                        </div>
                      )}
                      {cdi !== null && (
                        <div>
                          <div className="text-xs text-gray-500">Community Intensity</div>
                          <div className="text-sm font-medium">CDI {cdi.toFixed(1)}</div>
                        </div>
                      )}
                      {mmi !== null && (
                        <div>
                          <div className="text-xs text-gray-500">Modified Mercalli Intensity</div>
                          <div className="text-sm font-medium">MMI {mmi.toFixed(1)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Review Status</div>
                      <div className="text-sm font-medium capitalize">{status}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Tsunami Warning</div>
                      <div className="text-sm font-medium">{tsunami ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View on USGS Website
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 