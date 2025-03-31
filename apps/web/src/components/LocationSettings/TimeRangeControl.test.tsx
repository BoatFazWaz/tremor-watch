import { render, screen, fireEvent } from '@testing-library/react';
import { TimeRangeControl } from './TimeRangeControl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-datepicker', () => {
  return {
    default: ({ onChange, startDate, endDate, placeholderText }: any) => (
      <input
        type="text"
        onChange={(e) => onChange([new Date(e.target.value), endDate])}
        value={startDate ? startDate.toLocaleDateString() : ''}
        placeholder={placeholderText}
        data-testid="date-picker"
      />
    )
  };
});

describe('TimeRangeControl', () => {
  const mockProps = {
    timeRange: '24h',
    limit: 50,
    startDate: new Date('2024-03-05'),
    endDate: new Date('2024-03-06'),
    onDateRangeChange: vi.fn(),
    onTimeRangeChange: vi.fn(),
    onLimitChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<TimeRangeControl {...mockProps} />);

    expect(screen.getByText('Last Hour')).toBeInTheDocument();
    expect(screen.getByText('Last 24h')).toBeInTheDocument();
    expect(screen.getByText('Last 7d')).toBeInTheDocument();
    expect(screen.getByText('Last 14d')).toBeInTheDocument();
    expect(screen.getByText('Last 30d')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50 results' })).toBeInTheDocument();
  });

  it('handles time range button click', () => {
    render(<TimeRangeControl {...mockProps} />);

    fireEvent.click(screen.getByText('Last 7d'));

    expect(mockProps.onTimeRangeChange).toHaveBeenCalledWith('7d');
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    expect(mockProps.onDateRangeChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)]);
  });

  it('handles limit change', () => {
    render(<TimeRangeControl {...mockProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '100' } });

    expect(mockProps.onLimitChange).toHaveBeenCalledWith(100);
  });

  it('highlights selected time range button', () => {
    render(<TimeRangeControl {...mockProps} />);

    const selectedButton = screen.getByText('Last 24h');
    expect(selectedButton.className).toContain('bg-blue-50');
    expect(selectedButton.className).toContain('text-blue-700');
    expect(selectedButton.className).toContain('border-blue-200');

    const unselectedButton = screen.getByText('Last 7d');
    expect(unselectedButton.className).toContain('bg-white');
    expect(unselectedButton.className).toContain('text-gray-700');
    expect(unselectedButton.className).toContain('border-gray-200');
  });

  it('handles date picker change', () => {
    render(<TimeRangeControl {...mockProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2024-03-05' } });

    expect(mockProps.onDateRangeChange).toHaveBeenCalled();
  });
}); 