import { render, screen, fireEvent } from '@testing-library/react';
import { RegionSelector } from './RegionSelector';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { THAI_REGIONS } from '../../constants/locations';

describe('RegionSelector', () => {
  const mockProps = {
    selectedRegion: '13.7563,100.5018',
    onRegionChange: vi.fn(),
    onGetCurrentLocation: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RegionSelector {...mockProps} />);

    expect(screen.getByText('Current Location')).toBeInTheDocument();
    expect(screen.getByText('Select Region')).toBeInTheDocument();
  });

  it('calls onGetCurrentLocation when current location button is clicked', () => {
    render(<RegionSelector {...mockProps} />);

    fireEvent.click(screen.getByText('Current Location'));
    expect(mockProps.onGetCurrentLocation).toHaveBeenCalled();
  });

  it('calls onRegionChange when a region is selected', () => {
    render(<RegionSelector {...mockProps} />);

    const chiangMai = THAI_REGIONS.find(region => region.name === 'Chiang Mai')!;
    const value = `${chiangMai.latitude},${chiangMai.longitude}`;
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value } });

    expect(mockProps.onRegionChange).toHaveBeenCalledWith(value);
  });

  it('displays the correct selected region', () => {
    render(<RegionSelector {...mockProps} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue(mockProps.selectedRegion);
  });
}); 