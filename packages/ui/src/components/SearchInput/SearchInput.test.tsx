import { render, screen, fireEvent } from '@testing-library/react';

// Components
import { SearchInput } from './';

describe('SearchInput component', () => {
  const handleChange = jest.fn();

  test('renders the default SearchInput', () => {
    expect(render(<SearchInput onChange={handleChange} />)).toMatchSnapshot();
  });

  test('Test handles change events', () => {
    render(<SearchInput onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Test input' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('Test when the disabled prop is set', () => {
    render(<SearchInput disabled onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
