import { render, screen, fireEvent } from '@testing-library/react';

// Components
import { Button } from './';

describe('Button component', () => {
  test('renders the Button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toMatchSnapshot();
  });

  test('renders startIcon and endIcon', () => {
    render(
      <Button startIcon={<span>Start</span>} endIcon={<span>End</span>}>
        Click me
      </Button>,
    );
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  test('applies the correct variant classes', () => {
    render(<Button variant="outline">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass(
      'border border-gray-200 hover:bg-gray-100 bg-transparent text-black',
    );
  });

  test('applies customClass', () => {
    render(<Button customClass="custom-class">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('custom-class');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  test('renders button with type submit', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
  });
});
