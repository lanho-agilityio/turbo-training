import { render, screen } from '@testing-library/react';

// Components
import { NavLink } from './index';

describe('NavLink component', () => {
  test('renders the NavLink with children', () => {
    render(<NavLink href="/" label="Home" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('renders icon', () => {
    render(<NavLink href="/" icon={<span>Icon</span>} label="Home" />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  test('applies the correct class when isSelected', () => {
    render(
      <NavLink href="/" label="Status" isActive={true} className="pt-2" />,
    );
    expect(screen.getByText('Status')).toHaveClass(
      'bg-black font-bold text-white fill-white',
    );
  });
});
