import { render, screen } from '@testing-library/react';

// Components
import { Badge } from './index';

describe('Badge component', () => {
  test('renders the Badge with children', () => {
    render(<Badge label="Status" />);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('renders icon', () => {
    render(<Badge icon={<span>Icon</span>} label="Status" />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  test('applies the correct variant classes', () => {
    render(<Badge variant="success" label="Status" />);
    expect(screen.getByText('Status')).toHaveClass('bg-emerald-400');
  });
});
