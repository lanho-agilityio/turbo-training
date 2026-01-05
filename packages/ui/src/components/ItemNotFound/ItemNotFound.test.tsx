import { render, screen } from '@testing-library/react';

// Component
import { ItemNotFound } from '.';

const mockProps = {
  title: 'Item not found',
  description: 'The page you were trying to reach is currently unavailable.',
};

describe('ItemNotFound component', () => {
  test('Render component match snapshot', () => {
    const { asFragment, getByText } = render(
      <ItemNotFound
        {...mockProps}
        customClass={{
          title: 'text-black',
          description: 'text-white',
        }}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
    expect(
      getByText('The page you were trying to reach is currently unavailable.'),
    ).toHaveClass('text-white');
  });

  test('Show correct title', () => {
    render(<ItemNotFound {...mockProps} />);
    const title = screen.getByText('Item not found');

    expect(title).toBeInTheDocument();
  });

  test('Show correct description', () => {
    render(<ItemNotFound {...mockProps} />);
    const description = screen.getByText(
      'The page you were trying to reach is currently unavailable.',
    );

    expect(description).toBeInTheDocument();
  });
});
