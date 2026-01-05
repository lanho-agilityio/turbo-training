import { render, screen, fireEvent } from '@testing-library/react';

// Component
import { ErrorContent } from '.';

const mockProps = {
  onClick: jest.fn(),
};

describe('ErrorContent component', () => {
  test('Render component correctly', () => {
    expect(render(<ErrorContent {...mockProps} />)).toMatchSnapshot();
  });

  test('Show correct default title', () => {
    render(<ErrorContent {...mockProps} />);
    const title = screen.getByText('Something went wrong');

    expect(title).toBeInTheDocument();
  });

  test('Show correct default description', () => {
    render(<ErrorContent {...mockProps} />);
    const description = screen.getByText(
      'The page you were trying to reach is currently unavailable.',
    );

    expect(description).toBeInTheDocument();
  });

  test('Should render button element', () => {
    render(<ErrorContent {...mockProps} />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
  });

  test('Should call onSelect function', async () => {
    render(<ErrorContent {...mockProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('Show correct title passing thourgh props', () => {
    const { getByText } = render(
      <ErrorContent title="Opp! Something went wrong" {...mockProps} />,
    );
    const title = getByText('Opp! Something went wrong');

    expect(title).toBeInTheDocument();
  });

  test('Show correct description passing thourgh props', () => {
    const { getByText } = render(
      <ErrorContent description="The page is unavailable." {...mockProps} />,
    );
    const description = getByText('The page is unavailable.');

    expect(description).toBeInTheDocument();
  });

  test('Should render label button passing thourgh props', () => {
    const { getByText } = render(
      <ErrorContent labelButton="Try again" {...mockProps} />,
    );
    const buttonElement = getByText('Try again');

    expect(buttonElement).toBeInTheDocument();
  });
});
