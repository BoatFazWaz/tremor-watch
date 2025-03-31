import { Button } from './ui/Button';
import { clsx } from 'clsx';
import { useState } from 'react';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
  isLiveFetchEnabled: boolean;
  onToggleLiveFetch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  loading, 
  onRefresh, 
  isLiveFetchEnabled,
  onToggleLiveFetch 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tremor Watch</h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Beta
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Desktop Navigation"
            className="hidden sm:flex items-center gap-4"
          >
            <Button 
              variant="secondary"
              onClick={onToggleLiveFetch}
              className={clsx(
                isLiveFetchEnabled && "bg-red-500 hover:bg-red-600 text-white border-red-400 animate-pulse"
              )}
            >
              {isLiveFetchEnabled ? "Live Monitoring" : "Start Live Monitoring"}
            </Button>
            <Button 
              loading={loading} 
              onClick={onRefresh}
            >
              Refresh Data
            </Button>
            <a
              href="https://github.com/BoatFazWaz/tremor-watch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </nav>

          {/* Mobile Burger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <nav
          aria-label="Mobile Menu"
          className={`fixed inset-0 z-[100] ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } transition-all duration-300 sm:hidden`}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Menu Content */}
          <div className="relative z-[101] bg-white p-4 max-w-sm mx-auto mt-16 rounded-lg shadow-lg space-y-3">
            <Button 
              variant="secondary"
              onClick={() => {
                onToggleLiveFetch();
                setIsMobileMenuOpen(false);
              }}
              className={clsx(
                "w-full justify-center",
                isLiveFetchEnabled && "bg-red-500 hover:bg-red-600 text-white border-red-400 animate-pulse"
              )}
            >
              {isLiveFetchEnabled ? "Live Monitoring" : "Start Live Monitoring"}
            </Button>
            <Button 
              loading={loading} 
              onClick={() => {
                onRefresh();
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-center"
            >
              Refresh Data
            </Button>
            <a
              href="https://github.com/BoatFazWaz/tremor-watch"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 w-full"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}; 