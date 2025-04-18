import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { EarthquakeDetailsDrawer } from '../components/EarthquakeDetailsDrawer';

// Mock the EarthquakeMap component since we don't want to test its functionality here
vi.mock('../components/EarthquakeMap', () => ({
  EarthquakeMap: () => <div data-testid="earthquake-map">Map Component</div>
}));

describe('EarthquakeDetailsDrawer', () => {
  const mockEarthquake = {
    type: 'Feature',
    id: 'test123',
    properties: {
      mag: 6.5,
      place: 'Test Location',
      time: new Date('2024-04-18T12:00:00Z').getTime(),
      status: 'reviewed',
      alert: 'yellow',
      tsunami: 1,
      felt: 100,
      url: 'http://example.com',
      cdi: 5.5,
      mmi: 7.0,
      sig: 800,
      magType: 'mb'
    },
    geometry: {
      type: 'Point',
      coordinates: [120, 30, 10] // longitude, latitude, depth
    }
  };

  const defaultProps = {
    earthquake: mockEarthquake,
    onClose: vi.fn(),
    latitude: 35,
    longitude: 125
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null when earthquake is null', () => {
    const { container } = render(
      <EarthquakeDetailsDrawer {...defaultProps} earthquake={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all main sections when earthquake data is provided', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);

    // Check main sections
    expect(screen.getByText('Earthquake Details')).toBeInTheDocument();
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Population Impact')).toBeInTheDocument();
    expect(screen.getByText('Safety Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Location Map')).toBeInTheDocument();
    expect(screen.getByText('Technical Information')).toBeInTheDocument();
    expect(screen.getByText('Historical Context')).toBeInTheDocument();
  });

  it('displays basic earthquake information correctly', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);

    expect(screen.getByText('Magnitude 6.5')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Tsunami Alert')).toBeInTheDocument();
    expect(screen.getByText('Yellow Alert')).toBeInTheDocument();
  });

  it('shows correct risk assessment information', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);

    const riskSection = within(screen.getByText('Risk Assessment').parentElement!);
    expect(riskSection.getByText('High')).toBeInTheDocument();
    expect(riskSection.getByText('High (70-90%)')).toBeInTheDocument();
    expect(riskSection.getByText(/Very Strong/)).toBeInTheDocument();
  });

  it('displays correct population impact information', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);

    const impactSection = within(screen.getByText('Population Impact').parentElement!);
    expect(impactSection.getByText('100-200km radius')).toBeInTheDocument();
    expect(impactSection.getByText('Moderate structural damage possible')).toBeInTheDocument();
  });

  it('shows appropriate safety recommendations based on magnitude', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);

    const recommendations = [
      'Evacuate buildings if safe to do so',
      'Stay away from windows and exterior walls',
      'Be prepared for aftershocks',
      'Monitor local emergency broadcasts',
      'Check on neighbors if possible'
    ];

    recommendations.forEach(recommendation => {
      expect(screen.getByText(recommendation)).toBeInTheDocument();
    });
  });

  it('displays technical details correctly', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);

    const technicalSection = within(screen.getByText('Technical Information').parentElement!);
    expect(technicalSection.getByText('30.0000°N, 120.0000°E')).toBeInTheDocument();
    expect(technicalSection.getByText('10.0 km')).toBeInTheDocument();
    expect(technicalSection.getByText('reviewed')).toBeInTheDocument();
    expect(technicalSection.getByText('100 reports')).toBeInTheDocument();
    expect(technicalSection.getByText('5.5')).toBeInTheDocument();
    expect(technicalSection.getByText('7.0')).toBeInTheDocument();
    expect(technicalSection.getByText('MB')).toBeInTheDocument();
  });

  it('shows correct historical context', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);

    const historicalSection = within(screen.getByText('Historical Context').parentElement!);
    expect(historicalSection.getByText(/Highly Significant/)).toBeInTheDocument();
    expect(historicalSection.getByText(/Strong Earthquake/)).toBeInTheDocument();
  });

  it('closes drawer when backdrop is clicked', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);
    
    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('closes drawer when escape key is pressed', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders external link correctly', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);
    
    const link = screen.getByText('View on USGS');
    expect(link).toHaveAttribute('href', 'http://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders map component with correct props', () => {
    render(<EarthquakeDetailsDrawer {...defaultProps} />);
    
    const map = screen.getByTestId('earthquake-map');
    expect(map).toBeInTheDocument();
  });
}); 