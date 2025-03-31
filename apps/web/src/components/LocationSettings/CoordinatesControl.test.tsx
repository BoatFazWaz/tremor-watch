import { render, screen, fireEvent } from '@testing-library/react';
import { CoordinatesControl } from './CoordinatesControl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CoordinatesControl', () => {
  const mockProps = {
    latitude: 13.7563,
    longitude: 100.5018,
    radius: 1000,
    localRadius: 1000,
    onLatitudeChange: vi.fn(),
    onLongitudeChange: vi.fn(),
    onLocalRadiusChange: vi.fn(),
    onRadiusChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with proper responsive layout', () => {
    render(<CoordinatesControl {...mockProps} />);

    const container = screen.getByTestId('coordinates-control');
    const latitudeInput = screen.getByPlaceholderText('Enter latitude');
    const longitudeInput = screen.getByPlaceholderText('Enter longitude');
    const radiusLabel = screen.getByText('Radius');
    const radiusValue = screen.getByText('1000 km');

    // Check responsive classes
    expect(container).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-2');
    expect(screen.getByTestId('radius-section')).toHaveClass('col-span-2', 'md:col-span-1');

    // Check form elements
    expect(latitudeInput).toBeInTheDocument();
    expect(longitudeInput).toBeInTheDocument();
    expect(radiusLabel).toBeInTheDocument();
    expect(radiusValue).toBeInTheDocument();

    // Check input values
    expect(latitudeInput).toHaveValue(13.7563);
    expect(longitudeInput).toHaveValue(100.5018);
  });

  it('handles latitude change', () => {
    render(<CoordinatesControl {...mockProps} />);

    const input = screen.getByPlaceholderText('Enter latitude');
    fireEvent.change(input, { target: { value: '14.0' } });

    expect(mockProps.onLatitudeChange).toHaveBeenCalledWith(14.0);
    expect(mockProps.onLatitudeChange).toHaveBeenCalledTimes(1);
  });

  it('handles longitude change', () => {
    render(<CoordinatesControl {...mockProps} />);

    const input = screen.getByPlaceholderText('Enter longitude');
    fireEvent.change(input, { target: { value: '101.0' } });

    expect(mockProps.onLongitudeChange).toHaveBeenCalledWith(101.0);
    expect(mockProps.onLongitudeChange).toHaveBeenCalledTimes(1);
  });

  it('handles radius slider change', () => {
    render(<CoordinatesControl {...mockProps} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2000' } });

    expect(mockProps.onLocalRadiusChange).toHaveBeenCalledWith(2000);
    expect(mockProps.onLocalRadiusChange).toHaveBeenCalledTimes(1);
  });

  it('handles radius slider mouse up and touch end', () => {
    render(<CoordinatesControl {...mockProps} />);

    const slider = screen.getByRole('slider');
    
    // Test mouse up
    fireEvent.mouseUp(slider);
    expect(mockProps.onRadiusChange).toHaveBeenCalledWith(1000);
    
    // Test touch end
    fireEvent.touchEnd(slider);
    expect(mockProps.onRadiusChange).toHaveBeenCalledWith(1000);
    
    expect(mockProps.onRadiusChange).toHaveBeenCalledTimes(2);
  });

  it('handles radius quick select buttons', () => {
    render(<CoordinatesControl {...mockProps} />);

    const buttons = screen.getAllByRole('button');
    const button2000 = buttons.find(btn => btn.textContent === '2000km');
    fireEvent.click(button2000!);

    expect(mockProps.onRadiusChange).toHaveBeenCalledWith(2000);
    expect(mockProps.onRadiusChange).toHaveBeenCalledTimes(1);
  });

  it('highlights selected radius button with proper styling', () => {
    render(<CoordinatesControl {...mockProps} />);

    const buttons = screen.getAllByRole('button');
    const selectedButton = buttons.find(btn => btn.textContent === '1000km');
    const unselectedButton = buttons.find(btn => btn.textContent === '2000km');

    // Check selected button styling
    expect(selectedButton).toHaveClass('bg-blue-100', 'text-blue-700');
    expect(selectedButton).not.toHaveClass('bg-white', 'text-gray-700');

    // Check unselected button styling
    expect(unselectedButton).toHaveClass('bg-white', 'text-gray-700');
    expect(unselectedButton).not.toHaveClass('bg-blue-100', 'text-blue-700');
  });
}); 