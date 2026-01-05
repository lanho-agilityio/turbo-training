import { render, screen } from '@testing-library/react';

// Components
import { Toast } from './index';

describe('Toast component', () => {
  test('renders the Toast with children', () => {
    render(<Toast message="Status" />);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('renders icon', () => {
    render(<Toast icon={<span>Icon</span>} message="Status" />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  test('applies the correct theme classes', () => {
    render(<Toast variant="success" message="Status" />);
    expect(screen.getByTestId('toast')).toHaveClass('bg-emerald-500');
  });
});
