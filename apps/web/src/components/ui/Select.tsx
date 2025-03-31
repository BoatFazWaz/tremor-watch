import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, children, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            block w-full rounded-lg
            px-4 py-2.5 pr-10
            bg-white
            border border-gray-300
            text-gray-900 text-sm
            appearance-none
            transition duration-150 ease-in-out
            hover:border-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed
            [&>option]:px-4 [&>option]:py-2
            [&>option]:text-gray-900 [&>option]:bg-white
            [&>option:hover]:bg-blue-50 [&>option:hover]:text-blue-700
            [&>option:checked]:bg-blue-50 [&>option:checked]:text-blue-700
            [&>optgroup]:font-semibold [&>optgroup]:text-gray-900 [&>optgroup]:bg-gray-50
            [&>optgroup>option]:bg-white [&>optgroup>option]:pl-4
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div 
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
          aria-hidden="true"
        >
          <svg 
            className="h-4 w-4 transition-transform duration-200 ease-in-out" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
} 