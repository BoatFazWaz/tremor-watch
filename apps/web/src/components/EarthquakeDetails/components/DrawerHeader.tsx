import { type FC } from 'react';
import { DrawerHeaderProps } from '../types';

export const DrawerHeader: FC<DrawerHeaderProps> = ({ onClose, title }) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors"
          aria-label="Close drawer"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="w-6" /> {/* Spacer for centering */}
      </div>
    </div>
  );
}; 