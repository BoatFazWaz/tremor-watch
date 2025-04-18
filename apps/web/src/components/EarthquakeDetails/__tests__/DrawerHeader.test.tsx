import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DrawerHeader } from '../components/DrawerHeader';

describe('DrawerHeader', () => {
  it('renders with the correct title', () => {
    render(<DrawerHeader onClose={() => {}} title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<DrawerHeader onClose={onClose} title="Test Title" />);
    
    const closeButton = screen.getByLabelText('Close drawer');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has the correct accessibility attributes', () => {
    render(<DrawerHeader onClose={() => {}} title="Test Title" />);
    
    const closeButton = screen.getByLabelText('Close drawer');
    expect(closeButton).toHaveAttribute('aria-label', 'Close drawer');
    expect(screen.getByText('Close')).toHaveClass('sr-only');
  });
}); 