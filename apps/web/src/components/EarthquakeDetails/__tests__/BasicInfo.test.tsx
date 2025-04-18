import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BasicInfo } from '../components/BasicInfo';

describe('BasicInfo', () => {
  const defaultProps = {
    magnitude: 6.5,
    place: 'Test Location',
    time: new Date('2024-04-18T12:00:00Z').getTime(),
    tsunami: 0,
    alert: null
  };

  it('renders basic earthquake information correctly', () => {
    render(<BasicInfo {...defaultProps} />);
    
    expect(screen.getByText('Magnitude 6.5')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText(/Apr 18, 2024/)).toBeInTheDocument();
  });

  it('shows tsunami alert when tsunami > 0', () => {
    render(<BasicInfo {...defaultProps} tsunami={1} />);
    expect(screen.getByText('Tsunami Alert')).toBeInTheDocument();
  });

  it('does not show tsunami alert when tsunami = 0', () => {
    render(<BasicInfo {...defaultProps} />);
    expect(screen.queryByText('Tsunami Alert')).not.toBeInTheDocument();
  });

  it('shows alert with correct color based on alert level', () => {
    const alertLevels = ['green', 'yellow', 'orange', 'red'] as const;
    
    alertLevels.forEach(level => {
      const { container } = render(<BasicInfo {...defaultProps} alert={level} />);
      const alertElement = screen.getByText(`${level.charAt(0).toUpperCase() + level.slice(1)} Alert`);
      
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveClass(`bg-${level}-100`);
      expect(alertElement).toHaveClass(`text-${level}-800`);
    });
  });

  it('uses correct magnitude color based on magnitude value', () => {
    const magnitudeTests = [
      { magnitude: 6.5, expectedClass: 'bg-red-100 text-red-800' },
      { magnitude: 5.5, expectedClass: 'bg-orange-100 text-orange-800' },
      { magnitude: 4.5, expectedClass: 'bg-yellow-100 text-yellow-800' },
      { magnitude: 3.5, expectedClass: 'bg-green-100 text-green-800' }
    ];

    magnitudeTests.forEach(({ magnitude, expectedClass }) => {
      const { container } = render(
        <BasicInfo {...defaultProps} magnitude={magnitude} />
      );
      const magnitudeElement = screen.getByText(`Magnitude ${magnitude.toFixed(1)}`);
      
      expectedClass.split(' ').forEach(className => {
        expect(magnitudeElement).toHaveClass(className);
      });
    });
  });
}); 