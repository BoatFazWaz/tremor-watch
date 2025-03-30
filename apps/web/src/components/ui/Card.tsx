import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white shadow-sm rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
} 