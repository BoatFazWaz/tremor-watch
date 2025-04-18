import { type FC } from 'react';
import clsx from 'clsx';
import { EarthquakeDetailsProps } from '../types';
import { useEarthquakeDrawer } from '../hooks/useEarthquakeDrawer';
import { DrawerHeader } from './DrawerHeader';
import { BasicInfo } from './BasicInfo';
import { QuickStats } from './QuickStats';
import { EarthquakeMap } from '../../EarthquakeMap';
import {
  calculateAfterShockProbability,
  getIntensityDescription,
  getRiskLevel,
  getAffectedAreaRadius,
  getBuildingDamageRisk,
  getSignificanceLevel,
  getMagnitudeClassification,
  getSafetyRecommendations
} from '../utils/calculations';

export const EarthquakeDetailsDrawer: FC<EarthquakeDetailsProps> = ({
  earthquake,
  onClose,
  latitude,
  longitude,
}) => {
  const { distance, effect, travelTimes } = useEarthquakeDrawer({
    earthquake,
    onClose,
    latitude,
    longitude,
  });

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

  return (
    <>
      {/* Backdrop */}
      <div 
        role="presentation"
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
        <DrawerHeader onClose={onClose} title="Earthquake Details" />

        {/* Drawer Content */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <BasicInfo
              magnitude={mag}
              place={place}
              time={time}
              tsunami={tsunami}
              alert={alert}
            />

            {/* Enhanced Quick Stats */}
            <QuickStats
              distance={distance}
              effect={effect}
              travelTimes={travelTimes}
            />

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
                    {getAffectedAreaRadius(mag)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Building Damage Risk</div>
                  <div className="text-sm font-medium">
                    {getBuildingDamageRisk(mag)}
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Safety Recommendations</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="text-sm">
                  <ul className="list-disc pl-4 space-y-2">
                    {getSafetyRecommendations(mag).map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
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
                    {getSignificanceLevel(sig)} ({sig})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Magnitude Classification</div>
                  <div className="text-sm font-medium">
                    {getMagnitudeClassification(mag)}
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