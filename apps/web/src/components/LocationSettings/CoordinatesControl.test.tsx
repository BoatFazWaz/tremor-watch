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

  it('renders correctly', () => {
    render(<CoordinatesControl {...mockProps} />);

    const latitudeInput = screen.getByPlaceholderText('Enter latitude');
    const longitudeInput = screen.getByPlaceholderText('Enter longitude');
    const radiusLabel = screen.getByText('Radius');
    const radiusValue = screen.getByText('1000 km');

    expect(latitudeInput).toBeInTheDocument();
    expect(longitudeInput).toBeInTheDocument();
    expect(radiusLabel).toBeInTheDocument();
    expect(radiusValue).toBeInTheDocument();

    expect(latitudeInput).toHaveValue(13.7563);
    expect(longitudeInput).toHaveValue(100.5018);
  });

  it('handles latitude change', () => {
    render(<CoordinatesControl {...mockProps} />);

    const input = screen.getByPlaceholderText('Enter latitude');
    fireEvent.change(input, { target: { value: '14.0' } });

    expect(mockProps.onLatitudeChange).toHaveBeenCalledWith(14.0);
  });

  it('handles longitude change', () => {
    render(<CoordinatesControl {...mockProps} />);

    const input = screen.getByPlaceholderText('Enter longitude');
    fireEvent.change(input, { target: { value: '101.0' } });

    expect(mockProps.onLongitudeChange).toHaveBeenCalledWith(101.0);
  });

  it('handles radius slider change', () => {
    render(<CoordinatesControl {...mockProps} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2000' } });

    expect(mockProps.onLocalRadiusChange).toHaveBeenCalledWith(2000);
  });

  it('handles radius slider mouse up', () => {
    render(<CoordinatesControl {...mockProps} />);

    const slider = screen.getByRole('slider');
    fireEvent.mouseUp(slider);

    expect(mockProps.onRadiusChange).toHaveBeenCalledWith(1000);
  });

  it('handles radius quick select buttons', () => {
    render(<CoordinatesControl {...mockProps} />);

    const buttons = screen.getAllByRole('button');
    const button2000 = buttons.find(btn => btn.textContent === '2000');
    fireEvent.click(button2000!);

    expect(mockProps.onRadiusChange).toHaveBeenCalledWith(2000);
  });

  it('highlights selected radius button', () => {
    render(<CoordinatesControl {...mockProps} />);

    const buttons = screen.getAllByRole('button');
    const selectedButton = buttons.find(btn => btn.textContent === '1000');
    const unselectedButton = buttons.find(btn => btn.textContent === '2000');

    expect(selectedButton?.className).toContain('bg-blue-100');
    expect(selectedButton?.className).toContain('text-blue-700');
    expect(unselectedButton?.className).toContain('bg-white');
    expect(unselectedButton?.className).toContain('text-gray-700');
  });
}); 