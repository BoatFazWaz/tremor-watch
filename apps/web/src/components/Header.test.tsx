import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test/utils';
import { Header } from './Header';

describe('Header', () => {
  const defaultProps = {
    loading: false,
    onRefresh: vi.fn(),
    isLiveFetchEnabled: false,
    onToggleLiveFetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title correctly', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Tremor Watch')).toBeInTheDocument();
  });

  it('renders the beta badge', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  describe('Desktop View', () => {
    it('renders the live monitoring button', () => {
      render(<Header {...defaultProps} />);
      const desktopNav = screen.getByRole('navigation', { name: /desktop navigation/i });
      const button = screen.getAllByText('Start Live Monitoring')[0];
      expect(button).toBeInTheDocument();
      expect(desktopNav).toHaveClass('hidden', 'sm:flex');
    });

    it('changes live monitoring button text when enabled', () => {
      render(<Header {...defaultProps} isLiveFetchEnabled={true} />);
      const desktopNav = screen.getByRole('navigation', { name: /desktop navigation/i });
      const button = screen.getAllByText('Live Monitoring')[0];
      expect(button).toBeInTheDocument();
      expect(desktopNav).toHaveClass('hidden', 'sm:flex');
    });

    it('renders the refresh button', () => {
      render(<Header {...defaultProps} />);
      const desktopNav = screen.getByRole('navigation', { name: /desktop navigation/i });
      const button = screen.getAllByText('Refresh Data')[0];
      expect(button).toBeInTheDocument();
      expect(desktopNav).toHaveClass('hidden', 'sm:flex');
    });

    it('renders the GitHub link', () => {
      render(<Header {...defaultProps} />);
      const desktopNav = screen.getByRole('navigation', { name: /desktop navigation/i });
      const githubLinks = screen.getAllByText('View on GitHub');
      const githubLink = githubLinks[0];
      expect(githubLink).toBeInTheDocument();
      expect(githubLink.closest('a')).toHaveAttribute(
        'href',
        'https://github.com/BoatFazWaz/tremor-watch'
      );
      expect(desktopNav).toHaveClass('hidden', 'sm:flex');
    });
  });

  describe('Mobile View', () => {
    it('renders the burger menu button on mobile', () => {
      render(<Header {...defaultProps} />);
      const burgerButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(burgerButton).toBeInTheDocument();
      expect(burgerButton).toHaveClass('sm:hidden');
    });

    it('shows mobile menu when burger button is clicked', () => {
      render(<Header {...defaultProps} />);
      const burgerButton = screen.getByRole('button', { name: /toggle menu/i });
      
      // Initially menu should be hidden
      const mobileNav = screen.getByRole('navigation', { name: /mobile menu/i });
      expect(mobileNav).toHaveClass('opacity-0', 'invisible');
      
      // Click burger button
      fireEvent.click(burgerButton);
      
      // Menu should be visible
      expect(mobileNav).toHaveClass('opacity-100', 'visible');
    });

    it('hides mobile menu when burger button is clicked again', () => {
      render(<Header {...defaultProps} />);
      const burgerButton = screen.getByRole('button', { name: /toggle menu/i });
      
      // Open menu
      fireEvent.click(burgerButton);
      
      // Click again to close
      fireEvent.click(burgerButton);
      
      // Menu should be hidden
      const mobileNav = screen.getByRole('navigation', { name: /mobile menu/i });
      expect(mobileNav).toHaveClass('opacity-0', 'invisible');
    });

    it('closes mobile menu after clicking a menu item', () => {
      render(<Header {...defaultProps} />);
      const burgerButton = screen.getByRole('button', { name: /toggle menu/i });
      
      // Open menu
      fireEvent.click(burgerButton);
      
      // Click a menu item
      fireEvent.click(screen.getAllByText('Refresh Data')[1]); // Use the mobile menu button
      
      // Menu should be hidden
      const mobileNav = screen.getByRole('navigation', { name: /mobile menu/i });
      expect(mobileNav).toHaveClass('opacity-0', 'invisible');
      
      // Action should be called
      expect(defaultProps.onRefresh).toHaveBeenCalled();
    });

    it('calls onToggleLiveFetch from mobile menu', () => {
      render(<Header {...defaultProps} />);
      const burgerButton = screen.getByRole('button', { name: /toggle menu/i });
      
      // Open menu
      fireEvent.click(burgerButton);
      
      // Click live monitoring button
      fireEvent.click(screen.getAllByText('Start Live Monitoring')[1]); // Use the mobile menu button
      
      // Action should be called
      expect(defaultProps.onToggleLiveFetch).toHaveBeenCalled();
      
      // Menu should be hidden
      const mobileNav = screen.getByRole('navigation', { name: /mobile menu/i });
      expect(mobileNav).toHaveClass('opacity-0', 'invisible');
    });
  });
}); 