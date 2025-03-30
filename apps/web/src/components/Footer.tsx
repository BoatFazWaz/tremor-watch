export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About Tremor Watch</h3>
            <p className="mt-4 text-base text-gray-500">
              Tremor Watch is a real-time earthquake monitoring application that provides up-to-date information about seismic activity worldwide. Our data is sourced from the USGS Earthquake Hazards Program.
            </p>
          </div>

          {/* External Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">External Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  USGS Earthquake Hazards Program
                </a>
              </li>
              <li>
                <a href="https://www.ready.gov/earthquakes" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  Earthquake Preparedness
                </a>
              </li>
              <li>
                <a href="https://www.weather.gov/tsunamiready/" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  Tsunami Information
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              © {new Date().getFullYear()} Tremor Watch. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 