import { EarthquakeFeature } from '../types/earthquake';
import { EarthquakeMap } from './EarthquakeMap';
import clsx from 'clsx';
import { calculateDistance, calculateEffect, calculateArrivalTime, getEffectColor } from './RecentEarthquakes';
import { useEffect } from 'react';

interface EarthquakeDetailsDrawerProps {
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

// Add new helper functions
const calculateAfterShockProbability = (magnitude: number): string => {
  if (magnitude >= 7) return 'Very High (>90%)';
  if (magnitude >= 6) return 'High (70-90%)';
  if (magnitude >= 5) return 'Moderate (40-70%)';
  if (magnitude >= 4) return 'Low (20-40%)';
  return 'Very Low (<20%)';
};

const getIntensityDescription = (mmi: number): string => {
  if (mmi >= 9) return 'Violent - Considerable damage to specially designed structures';
  if (mmi >= 8) return 'Severe - Considerable damage in ordinary buildings';
  if (mmi >= 7) return 'Very Strong - Negligible damage in buildings of good design';
  if (mmi >= 6) return 'Strong - Felt by all, many frightened';
  if (mmi >= 5) return 'Moderate - Felt by nearly everyone';
  if (mmi >= 4) return 'Light - Felt indoors by many';
  if (mmi >= 3) return 'Weak - Felt quite noticeably by people indoors';
  if (mmi >= 2) return 'Very Weak - Felt only by a few people at rest';
  return 'Not Felt';
};

const getRiskLevel = (mag: number, depth: number): string => {
  if (mag >= 7 && depth < 70) return 'Extreme';
  if (mag >= 6 && depth < 100) return 'High';
  if (mag >= 5 || (mag >= 4 && depth < 50)) return 'Moderate';
  return 'Low';
};

export const EarthquakeDetailsDrawer: React.FC<EarthquakeDetailsDrawerProps> = ({
  earthquake,
  onClose,
  latitude,
  longitude,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
        className={clsx(
          "fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          earthquake ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      {/* Drawer */}
      <div 
        className={clsx(
          "fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transition-transform duration-300 transform",
          earthquake ? "translate-x-0" : "translate-x-full"
        )}
        style={{ zIndex: 10000 }}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Earthquake Details</h2>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Drawer Content */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
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
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
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

            {/* Risk Assessment Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Assessment</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Overall Risk Level</div>
                  <div className="text-sm font-medium">
                    {getRiskLevel(mag, coordinates[2])}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Aftershock Probability</div>
                  <div className="text-sm font-medium">
                    {calculateAfterShockProbability(mag)}
                  </div>
                </div>
                {mmi && (
                  <div>
                    <div className="text-xs text-gray-500">Expected Impact</div>
                    <div className="text-sm font-medium">
                      {getIntensityDescription(mmi)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Population Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Population Impact</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Potential Affected Area</div>
                  <div className="text-sm font-medium">
                    {mag >= 7 ? '> 200km radius' : 
                     mag >= 6 ? '100-200km radius' : 
                     mag >= 5 ? '50-100km radius' : 
                     '< 50km radius'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Building Damage Risk</div>
                  <div className="text-sm font-medium">
                    {mag >= 7 ? 'Severe structural damage likely' :
                     mag >= 6 ? 'Moderate structural damage possible' :
                     mag >= 5 ? 'Light damage possible' :
                     'Minimal to no damage expected'}
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Safety Recommendations</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="text-sm">
                  {mag >= 6 ? (
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Evacuate buildings if safe to do so</li>
                      <li>Stay away from windows and exterior walls</li>
                      <li>Be prepared for aftershocks</li>
                      <li>Monitor local emergency broadcasts</li>
                      <li>Check on neighbors if possible</li>
                    </ul>
                  ) : mag >= 4 ? (
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Stay calm and be prepared for aftershocks</li>
                      <li>Check for building damage</li>
                      <li>Monitor local news</li>
                    </ul>
                  ) : (
                    <ul className="list-disc pl-4 space-y-2">
                      <li>No immediate action required</li>
                      <li>Stay informed of any updates</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Location Map</h4>
              <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
                <EarthquakeMap
                  earthquakes={[earthquake]}
                  center={[coordinates[1], coordinates[0]]}
                  zoom={8}
                  radius={100}
                  containerId="drawer-map"
                  selectedLocation={[latitude, longitude]}
                />
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Technical Information</h4>
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
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="text-sm font-medium capitalize">{status}</div>
                </div>
                {felt && (
                  <div>
                    <div className="text-xs text-gray-500">Felt Reports</div>
                    <div className="text-sm font-medium">{felt} reports</div>
                  </div>
                )}
                {cdi && (
                  <div>
                    <div className="text-xs text-gray-500">Community Intensity (CDI)</div>
                    <div className="text-sm font-medium">{cdi.toFixed(1)}</div>
                  </div>
                )}
                {mmi && (
                  <div>
                    <div className="text-xs text-gray-500">Modified Mercalli Intensity (MMI)</div>
                    <div className="text-sm font-medium">{mmi.toFixed(1)}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500">Magnitude Type</div>
                  <div className="text-sm font-medium">{magType.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Significance</div>
                  <div className="text-sm font-medium">{sig}</div>
                </div>
              </div>
            </div>

            {/* Historical Context */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Historical Context</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Significance Rating</div>
                  <div className="text-sm font-medium">
                    {sig >= 1000 ? 'Exceptionally Significant' :
                     sig >= 750 ? 'Highly Significant' :
                     sig >= 500 ? 'Significant' :
                     sig >= 250 ? 'Moderately Significant' :
                     'Low Significance'} ({sig})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Magnitude Classification</div>
                  <div className="text-sm font-medium">
                    {mag >= 8 ? 'Great Earthquake' :
                     mag >= 7 ? 'Major Earthquake' :
                     mag >= 6 ? 'Strong Earthquake' :
                     mag >= 5 ? 'Moderate Earthquake' :
                     mag >= 4 ? 'Light Earthquake' :
                     'Minor Earthquake'}
                  </div>
                </div>
              </div>
            </div>

            {/* External Link */}
            <div className="pt-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
              >
                View on USGS
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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