import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/utils';
import { Header } from './Header';

describe('Header', () => {
  const defaultProps = {
    loading: false,
    onRefresh: vi.fn(),
    isLiveFetchEnabled: false,
    onToggleLiveFetch: vi.fn(),
  };

  it('renders the title correctly', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Tremor Watch')).toBeInTheDocument();
  });

  it('renders the live data badge', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Live Data')).toBeInTheDocument();
  });

  it('renders the live monitoring button', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Start Live Monitoring')).toBeInTheDocument();
  });

  it('changes live monitoring button text when enabled', () => {
    render(<Header {...defaultProps} isLiveFetchEnabled={true} />);
    expect(screen.getByText('Live Monitoring')).toBeInTheDocument();
  });

  it('renders the refresh button', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn();
    render(<Header {...defaultProps} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByText('Refresh Data'));
    expect(onRefresh).toHaveBeenCalled();
  });

  it('calls onToggleLiveFetch when live monitoring button is clicked', () => {
    const onToggleLiveFetch = vi.fn();
    render(<Header {...defaultProps} onToggleLiveFetch={onToggleLiveFetch} />);
    fireEvent.click(screen.getByText('Start Live Monitoring'));
    expect(onToggleLiveFetch).toHaveBeenCalled();
  });

  it('renders the GitHub link', () => {
    render(<Header {...defaultProps} />);
    const githubLink = screen.getByText('View on GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/BoatFazWaz/tremor-watch'
    );
  });
}); 