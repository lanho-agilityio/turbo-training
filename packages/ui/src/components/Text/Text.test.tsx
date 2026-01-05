import { render, screen } from '@testing-library/react';

// Components
import { Text } from './index';

describe('Text component', () => {
  test('renders the Text with children', () => {
    render(<Text value="Sample Text" />);
    expect(screen.getByText('Sample Text')).toBeInTheDocument();
  });

  test('renders icon', () => {
    render(<Text icon={<span>Icon</span>} value="Sample Text" />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  test('applies the correct theme classes', () => {
    render(<Text variant="primary" value="Sample Text" />);
    expect(screen.getByText('Sample Text')).toHaveClass(
      'fill-black text-black',
    );
  });
});
