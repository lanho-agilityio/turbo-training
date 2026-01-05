import { render, screen, fireEvent } from '@testing-library/react';

// Components
import { Input } from './';

describe('Input component', () => {
  const handleChange = jest.fn();

  test('renders the default Input', () => {
    expect(render(<Input onChange={handleChange} />)).toMatchSnapshot();
  });

  test('Test the correct variant class', () => {
    render(<Input onChange={handleChange} variant="outline" />);
    expect(screen.getByRole('textbox')).toHaveClass(
      'bg-transparent text-zinc-500',
    );
  });

  test('Test customClass', () => {
    render(<Input customClass="custom-class" onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  test('Test handles change events', () => {
    render(<Input onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Test input' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('Test when the disabled prop is set', () => {
    render(<Input disabled onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
