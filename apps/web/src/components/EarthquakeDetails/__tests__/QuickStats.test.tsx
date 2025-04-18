import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuickStats } from '../components/QuickStats';

describe('QuickStats', () => {
  const defaultProps = {
    distance: 150.5,
    effect: 'Strong',
    travelTimes: {
      pWave: { formatted: '2 min' },
      sWave: { formatted: '4 min' }
    }
  };

  it('renders distance correctly', () => {
    render(<QuickStats {...defaultProps} />);
    expect(screen.getByText('150.5 km')).toBeInTheDocument();
  });

  it('renders effect with correct color based on severity', () => {
    const effectTests = [
      { effect: 'Severe', expectedClass: 'bg-red-100 text-red-800' },
      { effect: 'Strong', expectedClass: 'bg-orange-100 text-orange-800' },
      { effect: 'Moderate', expectedClass: 'bg-yellow-100 text-yellow-800' },
      { effect: 'Light', expectedClass: 'bg-green-100 text-green-800' }
    ];

    effectTests.forEach(({ effect, expectedClass }) => {
      const { container } = render(
        <QuickStats {...defaultProps} effect={effect} />
      );
      const effectElement = screen.getByText(effect);
      
      expectedClass.split(' ').forEach(className => {
        expect(effectElement).toHaveClass(className);
      });
    });
  });

  it('renders seismic wave travel times correctly', () => {
    render(<QuickStats {...defaultProps} />);
    
    expect(screen.getByText('2 min')).toBeInTheDocument();
    expect(screen.getByText('4 min')).toBeInTheDocument();
  });

  it('renders wave type tooltips', () => {
    render(<QuickStats {...defaultProps} />);
    
    expect(screen.getByText('P-waves')).toBeInTheDocument();
    expect(screen.getByText('S-waves')).toBeInTheDocument();
    expect(screen.getByText(/Primary waves.*fastest seismic waves/)).toBeInTheDocument();
    expect(screen.getByText(/Secondary waves.*slower seismic waves/)).toBeInTheDocument();
  });
}); 